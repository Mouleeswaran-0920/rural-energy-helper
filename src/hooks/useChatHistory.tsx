import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const useChatHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user's chat sessions
  useEffect(() => {
    if (user) {
      loadChatSessions();
    }
  }, [user]);

  const loadChatSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive',
      });
    }
  };

  // Load messages for a specific session
  const loadMessages = async (sessionId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const formattedMessages: ChatMessage[] = (data || []).map((msg) => ({
        id: msg.id,
        content: msg.content,
        isUser: msg.is_user,
        timestamp: new Date(msg.created_at),
      }));

      setMessages(formattedMessages);
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new chat session
  const createNewSession = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: `Chat ${new Date().toLocaleDateString()}`,
        })
        .select()
        .single();

      if (error) throw error;
      
      await loadChatSessions();
      setCurrentSessionId(data.id);
      setMessages([{
        id: "welcome",
        content: "Hello! I'm your renewable energy assistant. I can help you with information about solar energy, wind power, biogas systems, and government schemes for rural areas. How can I assist you today?",
        isUser: false,
        timestamp: new Date()
      }]);
      
      return data.id;
    } catch (error) {
      console.error('Error creating new session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new chat session',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Save message to current session
  const saveMessage = async (message: ChatMessage) => {
    if (!user || !currentSessionId) return;

    try {
      // Don't save the welcome message
      if (message.id === "welcome") return;

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          session_id: currentSessionId,
          content: message.content,
          is_user: message.isUser,
        });

      if (error) throw error;

      // Generate catchy session name from first user message
      if (message.isUser && messages.length <= 1) {
        const catchyName = generateCatchySessionName(message.content);
        await supabase
          .from('chat_sessions')
          .update({ 
            title: catchyName,
            updated_at: new Date().toISOString() 
          })
          .eq('id', currentSessionId);
        
        // Refresh sessions to show the new name
        await loadChatSessions();
      } else {
        // Update session's updated_at timestamp
        await supabase
          .from('chat_sessions')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentSessionId);
      }

    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const generateCatchySessionName = (firstMessage: string): string => {
    const message = firstMessage.toLowerCase();
    
    // Solar related
    if (message.includes('solar') || message.includes('pm-kusum') || message.includes('rooftop')) {
      return `☀️ Solar Energy Solutions`;
    }
    
    // Wind related
    if (message.includes('wind')) {
      return `💨 Wind Power Discussion`;
    }
    
    // Biogas related
    if (message.includes('biogas') || message.includes('bio')) {
      return `🌱 Biogas & Biomass Chat`;
    }
    
    // Hydro related
    if (message.includes('hydro') || message.includes('water')) {
      return `💧 Hydro Power Consultation`;
    }
    
    // Government schemes
    if (message.includes('scheme') || message.includes('subsidy') || message.includes('government')) {
      return `🏛️ Government Schemes Guide`;
    }
    
    // General energy
    if (message.includes('energy') || message.includes('electricity') || message.includes('power')) {
      return `⚡ Renewable Energy Chat`;
    }
    
    // Rural specific
    if (message.includes('rural') || message.includes('village') || message.includes('farming')) {
      return `🏡 Rural Energy Solutions`;
    }
    
    // Default catchy names based on common topics
    const catchyNames = [
      '🌟 Energy Transformation',
      '🔋 Power Solutions Chat',
      '♻️ Green Energy Guide',
      '🌍 Sustainable Living',
      '💡 Smart Energy Talk'
    ];
    
    return catchyNames[Math.floor(Math.random() * catchyNames.length)];
  };

  // Delete a chat session
  const deleteSession = async (sessionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await loadChatSessions();
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      
      toast({
        title: 'Success',
        description: 'Chat session deleted',
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete chat session',
        variant: 'destructive',
      });
    }
  };

  return {
    sessions,
    currentSessionId,
    messages,
    loading,
    setMessages,
    loadMessages,
    createNewSession,
    saveMessage,
    deleteSession,
    loadChatSessions,
  };
};