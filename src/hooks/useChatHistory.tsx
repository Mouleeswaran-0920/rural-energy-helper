import { useState } from 'react';
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
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm your renewable energy assistant. I can help you with information about solar energy, wind power, biogas systems, and government schemes for rural areas. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);

  const loadChatSessions = async () => {
    // Mock data since we removed authentication
    setSessions([]);
  };

  const loadMessages = async (sessionId: string) => {
    setLoading(true);
    // Mock implementation
    setMessages([{
      id: "welcome",
      content: "Hello! I'm your renewable energy assistant. I can help you with information about solar energy, wind power, biogas systems, and government schemes for rural areas. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }]);
    setCurrentSessionId(sessionId);
    setLoading(false);
  };

  const createNewSession = async () => {
    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    setMessages([{
      id: "welcome",
      content: "Hello! I'm your renewable energy assistant. I can help you with information about solar energy, wind power, biogas systems, and government schemes for rural areas. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }]);
    return newSessionId;
  };

  const saveMessage = async (message: ChatMessage) => {
    // Mock implementation - messages are only stored in memory
    console.log('Message saved:', message);
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

  const deleteSession = async (sessionId: string) => {
    // Mock implementation
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setMessages([{
        id: "welcome",
        content: "Hello! I'm your renewable energy assistant. I can help you with information about solar energy, wind power, biogas systems, and government schemes for rural areas. How can I assist you today?",
        isUser: false,
        timestamp: new Date()
      }]);
    }
    
    toast({
      title: 'Success',
      description: 'Chat session deleted',
    });
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