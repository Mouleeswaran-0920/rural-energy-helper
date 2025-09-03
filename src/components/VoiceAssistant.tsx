import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Waves } from 'lucide-react';

interface VoiceAssistantProps {
  onSpeechResult: (transcript: string) => void;
  isProcessing?: boolean;
  autoSpeak?: boolean;
  lastResponse?: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onSpeechResult,
  isProcessing = false,
  autoSpeak = false,
  lastResponse
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [confidence, setConfidence] = useState<number>(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-IN';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setInterimTranscript('');
          setConfidence(0);
        };

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let interim = '';

          for (let i = event.results.length - 1; i >= 0; --i) {
            const result = event.results[i];
            if (result[0]) {
              const transcript = result[0].transcript;
              const conf = result[0].confidence || 0;
              
              if (result.isFinal) {
                finalTranscript = transcript;
                setConfidence(conf * 100);
                onSpeechResult(transcript);
              } else {
                interim = transcript;
              }
            }
          }
          
          setInterimTranscript(interim);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event);
          setIsListening(false);
          setInterimTranscript('');
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };
      }
    }
  }, [onSpeechResult]);

  // Auto-speak last response
  useEffect(() => {
    if (autoSpeak && lastResponse && !isSpeaking && !isListening) {
      speakText(lastResponse);
    }
  }, [lastResponse, autoSpeak, isSpeaking, isListening]);

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing) {
      // Stop any ongoing speech first
      if (isSpeaking) {
        stopSpeaking();
      }
      
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && text.trim()) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <Badge variant="secondary" className="text-xs">
        Voice not supported
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Voice Input Button */}
      <div className="relative">
        <Button
          variant={isListening ? "default" : "outline"}
          size="sm"
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`relative ${isListening ? 'animate-pulse' : ''}`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              {isListening && (
                <div className="absolute inset-0 rounded-md bg-primary/20 animate-ping" />
              )}
            </>
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </Button>

        {/* Listening indicator with interim transcript */}
        {(isListening || interimTranscript) && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-popover text-popover-foreground rounded-md border shadow-md min-w-48 max-w-64 z-10">
            <div className="flex items-center gap-2 mb-1">
              <Waves className="w-3 h-3 animate-pulse text-primary" />
              <span className="text-xs font-medium">
                {isListening ? 'Listening...' : 'Processing...'}
              </span>
            </div>
            {interimTranscript && (
              <p className="text-xs text-muted-foreground italic">
                "{interimTranscript}"
              </p>
            )}
            {confidence > 0 && (
              <Badge variant="outline" className="text-xs mt-1">
                Confidence: {confidence.toFixed(0)}%
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Voice Output Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={isSpeaking ? stopSpeaking : () => lastResponse && speakText(lastResponse)}
        disabled={!lastResponse || isProcessing}
        className={isSpeaking ? 'animate-pulse' : ''}
      >
        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>

      {/* Status Badge */}
      {(isListening || isSpeaking) && (
        <Badge 
          variant={isListening ? "default" : "secondary"}
          className="text-xs animate-pulse"
        >
          {isListening ? '🎤 Listening' : '🔊 Speaking'}
        </Badge>
      )}
    </div>
  );
};