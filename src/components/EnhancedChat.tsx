import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Send, Zap, Wind, Sun, Droplets, Sprout, History, Clock, TrendingUp, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChatHistory, ChatMessage } from '@/hooks/useChatHistory';
import { ChatSidebar } from './ChatSidebar';
import { VoiceAssistant } from './VoiceAssistant';
import { ragSystem } from '@/utils/ragSystem';

const API_KEY = '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';

interface EnhancedChatProps {
  selectedScheme?: any;
  onSchemeProcessed?: () => void;
}

interface MessageWithMetadata extends ChatMessage {
  confidence?: number;
  responseTime?: number;
  sources?: string[];
}

export const EnhancedChat: React.FC<EnhancedChatProps> = ({ 
  selectedScheme, 
  onSchemeProcessed 
}) => {
  const { toast } = useToast();
  const {
    sessions,
    currentSessionId,
    messages,
    loading: historyLoading,
    setMessages,
    loadMessages,
    createNewSession,
    saveMessage,
    deleteSession,
  } = useChatHistory();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [lastResponseTime, setLastResponseTime] = useState<number>(0);
  const [lastResponse, setLastResponse] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-create first session if none exists
  useEffect(() => {
    if (sessions.length === 0 && !currentSessionId && !historyLoading) {
      createNewSession();
    }
  }, [sessions.length, currentSessionId, historyLoading]);

  // Handle selected scheme from dashboard
  useEffect(() => {
    if (selectedScheme && currentSessionId) {
      const schemeQuery = `Tell me everything about the ${selectedScheme.name} scheme. I want to know about eligibility criteria, application process, subsidies, benefits, and how to apply for it.`;
      setInputMessage(schemeQuery);
      onSchemeProcessed?.();
    }
  }, [selectedScheme, currentSessionId, onSchemeProcessed]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceInput = (transcript: string) => {
    setInputMessage(transcript);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSessionId) return;

    const startTime = Date.now();
    
    // Get RAG context and confidence
    const ragContext = ragSystem.generateContext(inputMessage);
    const confidence = ragSystem.getConfidence(inputMessage);

    const userMessage: MessageWithMetadata = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
      confidence: 100 // User messages always have 100% confidence
    };

    // Add message to local state and save to database
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    await saveMessage(userMessage);
    
    setInputMessage('');
    setIsLoading(true);

    try {
      const modelCandidates = [
        "qwen/qwen-2.5-7b-instruct:free",
        "mistralai/mistral-7b-instruct:free",
        "microsoft/phi-3-medium-128k-instruct:free",
      ];

      const TIMEOUT_MS = 20000;

      const systemPrompt = `You are RenewAI, a helpful chatbot that assists users in adopting renewable energy, especially rooftop solar.
Your role is to educate, answer questions clearly, provide cost estimates, and connect users with trusted vendors.

Guidelines:
1. Always be polite, concise, and user-friendly. Use simple language.
2. When answering questions:
   - Use the vendor list to suggest certified local installers if available.
   - Use the pricing table to calculate approximate costs and payback periods.
   - Show estimates as a range (e.g., ₹2.5–3.2 lakhs) and mention subsidies if relevant.
   - Always explain assumptions (like cost per kW, subsidy rate, tariff).
3. If the user shows interest in installation:
   - Trigger the contact flow: ask for name, phone, email, and location.
   - Once collected, confirm: "Thank you, we will connect you with our trusted vendor soon."
   - Do not proceed without user consent.
4. If information is not available in your knowledge base, say:
   "I don't have that information yet, but I can connect you to a vendor who can help."
5. Safety:
   - Do not give medical, financial, or unrelated advice.
   - Stay within the renewable energy and sustainability domain.

Knowledge Base Context:
${ragContext}`;

      const messagesPayload = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages.slice(-5).map((msg) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content,
        })),
        {
          role: "user",
          content: inputMessage,
        },
      ];

      const errors: string[] = [];
      let aiResponseText: string | null = null;

      for (const model of modelCandidates) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

          const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.href,
                "X-Title": "RenewAI - Rural Energy Helper",
              },
              body: JSON.stringify({ 
                model, 
                messages: messagesPayload,
                temperature: 0.7,
                max_tokens: 1000
              }),
              signal: controller.signal,
            }
          );

          clearTimeout(timeout);

          if (!response.ok) {
            const errJson = await response.json().catch(() => ({} as any));
            errors.push(`${model}: ${response.status} ${(errJson?.error?.message || response.statusText)}`);
            continue;
          }

          const data = await response.json();
          aiResponseText = data.choices?.[0]?.message?.content;
          if (!aiResponseText) {
            errors.push(`${model}: Empty response`);
            continue;
          }

          break;
        } catch (e: any) {
          errors.push(`${model}: ${e?.message || "network error"}`);
          continue;
        }
      }

      if (!aiResponseText) {
        throw new Error(`All models failed -> ${errors.join(" | ")}`);
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;
      setLastResponseTime(responseTime);
      setLastResponse(aiResponseText);

      const aiMessage: MessageWithMetadata = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        isUser: false,
        timestamp: new Date(),
        confidence,
        responseTime,
        sources: ragContext.includes('Based on the renewable energy knowledge base:') ? ['MNRE Knowledge Base'] : []
      };

      setMessages((prev) => [...prev, aiMessage]);
      await saveMessage(aiMessage);
      
    } catch (error) {
      console.error('Error:', error);
      const msg = error instanceof Error ? error.message : 'Failed to get response. Please try again.';
      toast({
        title: 'Model error',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: Sun, label: "Solar Energy", query: "Tell me about solar energy schemes for rural areas and rooftop installation" },
    { icon: Wind, label: "Wind Power", query: "What are small wind energy options for villages and rural areas?" },
    { icon: Droplets, label: "Hydro Power", query: "Micro hydro power solutions for remote villages" },
    { icon: Sprout, label: "Biogas", query: "Government biogas schemes and subsidies for rural families" },
    { icon: Zap, label: "Cost Calculator", query: "Help me calculate the cost of a solar system for my home" },
    { icon: TrendingUp, label: "Subsidies", query: "What government subsidies are available for renewable energy?" }
  ];

  const handleQuickAction = (query: string) => {
    setInputMessage(query);
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 border-r bg-sidebar-background">
          <ChatSidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={loadMessages}
            onCreateSession={() => {
              createNewSession();
              setShowSidebar(false);
            }}
            onDeleteSession={deleteSession}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Quick Topics and Stats */}
        <div className="p-4 border-b bg-gradient-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                RenewAI Assistant
              </h3>
              {lastResponseTime > 0 && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Clock className="w-3 h-3" />
                  {lastResponseTime}ms
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              Chat History
            </Button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.query)}
                className="h-auto p-3 flex flex-col gap-2 hover:bg-primary-light hover:border-primary transition-all duration-200"
              >
                <action.icon className="w-4 h-4 text-primary" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {historyLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            messages.map((message) => {
              const msgWithMeta = message as MessageWithMetadata;
              return (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <Card className={`max-w-[85%] ${
                    message.isUser 
                      ? 'bg-gradient-primary text-primary-foreground shadow-soft' 
                      : 'bg-card shadow-card border-border/50'
                  }`}>
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Message Metadata */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-current/10">
                        <div className="flex items-center gap-2 text-xs opacity-70">
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          {msgWithMeta.confidence !== undefined && (
                            <Badge variant="outline" className="text-xs">
                              {msgWithMeta.confidence.toFixed(0)}% confidence
                            </Badge>
                          )}
                          {msgWithMeta.responseTime && (
                            <Badge variant="outline" className="text-xs">
                              {msgWithMeta.responseTime}ms
                            </Badge>
                          )}
                        </div>
                        
                        {msgWithMeta.sources && msgWithMeta.sources.length > 0 && (
                          <div className="flex gap-1">
                            {msgWithMeta.sources.map((source, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-card shadow-card max-w-[80%]">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="animate-bounce w-2 h-2 bg-primary rounded-full"></div>
                      <div className="animate-bounce w-2 h-2 bg-primary rounded-full" style={{ animationDelay: '0.1s' }}></div>
                      <div className="animate-bounce w-2 h-2 bg-primary rounded-full" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">RenewAI is thinking...</span>
                  </div>
                  
                  {/* Processing animation */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Brain className="w-3 h-3" />
                      Processing your renewable energy query
                    </div>
                    <Progress value={isLoading ? undefined : 0} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="p-4 border-t bg-gradient-card">
          <div className="flex gap-3 items-end">
            {/* Voice Assistant */}
            <VoiceAssistant
              onSpeechResult={handleVoiceInput}
              isProcessing={isLoading}
              autoSpeak={false}
              lastResponse={lastResponse}
            />
            
            {/* Text Input */}
            <div className="flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about renewable energy schemes, costs, or government subsidies..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={!currentSessionId || isLoading}
                className="min-h-[44px]"
              />
            </div>
            
            {/* Send Button */}
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim() || !currentSessionId}
              className="gap-2 min-h-[44px]"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              💡 Use voice input, ask about schemes, or calculate solar costs
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Knowledge Base:</span>
              <Badge variant="outline" className="text-xs">
                {ragSystem.getStats().totalDocuments} docs
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};