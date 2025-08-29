import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Send, Volume2, VolumeX, Zap, Wind, Sun, Droplets, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Speech Recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: () => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

const API_KEY = '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';

export const RenewableEnergyChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your renewable energy assistant. I can help you with information about solar energy, wind power, biogas systems, and government schemes for rural areas. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-IN"; // English language

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [toast]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
        },
        body: JSON.stringify({
          model: "microsoft/phi-3-medium-128k-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are an expert renewable energy advisor specifically trained on MNRE (Ministry of New and Renewable Energy) data and policies. You help rural communities understand renewable energy options, government schemes, and subsidies. Always respond in clear, simple English. Focus on:\n\n1. Solar energy systems and rooftop schemes\n2. Wind energy for small scale applications\n3. Biogas and biomass options\n4. Government subsidies and schemes like PM-KUSUM, Rooftop Solar Scheme\n5. Rural energy solutions and micro-grids\n6. Energy efficiency measures\n7. Financial assistance and loan schemes\n\nKeep responses practical, actionable, and relevant to rural communities. Always include relevant government scheme details when applicable."
            },
            ...messages.slice(-5).map(msg => ({
              role: msg.isUser ? "user" : "assistant",
              content: msg.content
            })),
            {
              role: "user",
              content: inputMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "Sorry, I could not understand your query.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Auto-speak the response
      speakMessage(aiResponse);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const quickActions = [
    { icon: Sun, label: "Solar Energy", query: "Tell me about solar energy schemes for rural areas" },
    { icon: Wind, label: "Wind Power", query: "What are small wind energy options?" },
    { icon: Droplets, label: "Hydro Power", query: "Micro hydro power for villages" },
    { icon: Sprout, label: "Biogas", query: "Government biogas schemes and subsidies" }
  ];

  const handleQuickAction = (query: string) => {
    setInputMessage(query);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Quick Actions */}
      <div className="p-4 border-b bg-gradient-card">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Topics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.query)}
              className="h-auto p-3 flex flex-col gap-2 hover:bg-primary-light hover:border-primary transition-all duration-200"
            >
              <action.icon className="w-5 h-5 text-primary" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] ${
              message.isUser 
                ? 'bg-gradient-primary text-primary-foreground shadow-soft' 
                : 'bg-card shadow-card'
            }`}>
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
                {!message.isUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakMessage(message.content)}
                    className="mt-2 h-6 px-2 text-xs"
                  >
                    <Volume2 className="w-3 h-3 mr-1" />
                    Listen
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-bounce w-2 h-2 bg-primary rounded-full"></div>
                  <div className="animate-bounce w-2 h-2 bg-primary rounded-full" style={{ animationDelay: '0.1s' }}></div>
                  <div className="animate-bounce w-2 h-2 bg-primary rounded-full" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-gradient-card">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about renewable energy schemes..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={isListening ? stopListening : startListening}
                className={`h-7 w-7 p-0 ${isListening ? 'animate-pulse-glow' : ''}`}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={isSpeaking ? stopSpeaking : () => {}}
                className="h-7 w-7 p-0"
                disabled={!isSpeaking}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 opacity-50" />}
              </Button>
            </div>
          </div>
          <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Click the mic icon to speak or type your question about renewable energy
        </p>
      </div>
    </div>
  );
};