import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ChatSession } from '@/hooks/useChatHistory';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  className?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  className,
}) => {
  const { user, signOut } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn("h-full bg-gradient-card border-r flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-primary">Chat History</h2>
          <Button
            size="sm"
            onClick={onCreateSession}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {user && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="truncate flex-1">{user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
            >
              <LogOut className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Chat Sessions */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No chat history yet</p>
              <p>Start a new conversation!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-soft group",
                  currentSessionId === session.id 
                    ? "bg-primary-light border-primary shadow-soft" 
                    : "bg-card hover:bg-primary-light/50"
                )}
                onClick={() => onSelectSession(session.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {session.title || 'Untitled Chat'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(session.updated_at)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};