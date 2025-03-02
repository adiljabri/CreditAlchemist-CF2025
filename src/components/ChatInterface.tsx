
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Send, User, Bot, PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from "@/lib/utils";
import Button from './Button';
import { initializeChat, fetchChatHistory, sendMessage as sendChatServiceMessage, fetchAllChatSessions } from '@/utils/chatService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

interface SuggestedQuestion {
  text: string;
  category: string;
}

const ChatInterface: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const suggestedQuestions: SuggestedQuestion[] = [
    { text: "How does the Avalanche method work?", category: "Strategies" },
    { text: "What is the Snowball method?", category: "Strategies" },
    { text: "Which debt strategy is better for me?", category: "Strategies" },
    { text: "How can I reduce my credit card interest?", category: "Tips" },
    { text: "What's the impact of paying extra each month?", category: "Planning" },
    { text: "How long will it take to pay off my debt?", category: "Planning" },
  ];

  // Initialize with a new conversation if none exists
  useEffect(() => {
    // Load conversations from FastAPI
    const loadConversations = async () => {
      try {
        // Fetch all chat sessions
        const allSessions = await fetchAllChatSessions();
        
        if (allSessions.length > 0) {
          const conversationsPromises = allSessions.map(async (session) => {
            const messages = await fetchChatHistory(session.id);
            return {
              id: session.id,
              title: session.name,
              messages,
              timestamp: session.createdAt
            };
          });
          
          const loadedConversations = await Promise.all(conversationsPromises);
          setConversations(loadedConversations);
          
          // Set active conversation
          const lastChatId = localStorage.getItem('currentChatId');
          const activeConversation = lastChatId
            ? loadedConversations.find(conv => conv.id === lastChatId)
            : loadedConversations[0];
          
          if (activeConversation) {
            setActiveConversationId(activeConversation.id);
            setMessages(activeConversation.messages);
            localStorage.setItem('currentChatId', activeConversation.id);
          } else {
            createNewConversation();
          }
        } else {
          createNewConversation();
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        toast({
          title: "Error",
          description: "Failed to load chat history. Creating a new conversation.",
          variant: "destructive"
        });
        createNewConversation();
      }
    };
    
    loadConversations();
  }, []);

  const sendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      let chatId = localStorage.getItem('currentChatId');
      if (!chatId) {
        chatId = await initializeChat();
        localStorage.setItem('currentChatId', chatId);
      }

      const response = await sendChatServiceMessage(chatId, content);
      const aiMessage = {
        id: Date.now().toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Update conversations state
      const updatedConversations = conversations.map(convo =>
        convo.id === chatId
          ? { ...convo, messages: finalMessages, timestamp: new Date() }
          : convo
      );
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(input);
  };

  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };

  const handleConversationSelect = (conversationId: string) => {
    const conversation = conversations.find(convo => convo.id === conversationId);
    if (conversation) {
      setActiveConversationId(conversationId);
      setMessages(conversation.messages);
    }
  };

  const deleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const updatedConversations = conversations.filter(convo => convo.id !== conversationId);
    setConversations(updatedConversations);
    
    // If we deleted the active conversation, switch to another one or create a new one
    if (conversationId === activeConversationId) {
      if (updatedConversations.length > 0) {
        setActiveConversationId(updatedConversations[0].id);
        setMessages(updatedConversations[0].messages);
      } else {
        createNewConversation();
      }
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Add event listener for common questions
  useEffect(() => {
    const handleAskQuestion = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.question) {
        sendMessage(customEvent.detail.question);
      }
    };

    document.addEventListener('askQuestion', handleAskQuestion);
    return () => {
      document.removeEventListener('askQuestion', handleAskQuestion);
    };
  }, [activeConversationId, messages, conversations]);

  // Group questions by category
  const questionsByCategory: {[key: string]: SuggestedQuestion[]} = {};
  suggestedQuestions.forEach(q => {
    if (!questionsByCategory[q.category]) {
      questionsByCategory[q.category] = [];
    }
    questionsByCategory[q.category].push(q);
  });

  return (
    <div className="flex flex-col h-[600px] glass rounded-2xl">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center">
          <div>
            <h3 className="text-lg font-medium">Debt Advisor Chat</h3>
            <p className="text-sm text-muted-foreground">Ask questions about debt strategies and management</p>
          </div>
        </div>
        <Button 
          variant="secondary"
          size="sm"
          icon={<PlusCircle size={16} />}
          onClick={createNewConversation}
        >
          New Chat
        </Button>
      </div>
      
      <div className="flex h-full">
        {/* Sidebar with conversation history */}
        {conversations.length > 1 && (
          <div className="w-64 border-r border-border p-3 overflow-y-auto hidden md:block">
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase">Recent Conversations</h4>
            <div className="space-y-2">
              {conversations.map((convo) => (
                <div 
                  key={convo.id} 
                  className={cn(
                    "p-2 rounded-lg cursor-pointer flex items-center justify-between group",
                    convo.id === activeConversationId ? "bg-primary/10" : "hover:bg-secondary/50"
                  )}
                  onClick={() => handleConversationSelect(convo.id)}
                >
                  <div className="w-full overflow-hidden">
                    <p className="text-sm font-medium truncate">{convo.title}</p>
                    <p className="text-xs text-muted-foreground">{getRelativeTime(convo.timestamp)}</p>
                  </div>
                  <button 
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded-md transition-opacity"
                    onClick={(e) => deleteConversation(convo.id, e)}
                  >
                    <Trash2 size={14} className="text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      
        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 animate-fade-in",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot size={18} className="text-white" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-4",
                    message.sender === 'user'
                      ? "bg-primary text-white"
                      : "glass-dark"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-[10px] opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-primary" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="glass-dark max-w-[80%] rounded-2xl p-4">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested questions */}
          <div className="px-4 mb-2">
            <button 
              className="w-full flex items-center justify-between p-2 text-sm text-muted-foreground hover:bg-secondary/30 rounded-lg"
              onClick={() => setShowQuestions(!showQuestions)}
            >
              <span>Common questions</span>
              {showQuestions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showQuestions && (
              <div className="mt-2 space-y-4 p-2 bg-secondary/20 rounded-lg max-h-60 overflow-y-auto">
                {Object.entries(questionsByCategory).map(([category, questions]) => (
                  <div key={category}>
                    <h5 className="text-xs font-medium text-muted-foreground mb-2">{category}</h5>
                    <div className="space-y-1">
                      {questions.map((question, idx) => (
                        <button
                          key={idx}
                          className="w-full text-left p-2 text-sm rounded-lg hover:bg-primary/10 transition-colors"
                          onClick={() => handleQuestionClick(question.text)}
                        >
                          {question.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask something about debt management..."
                className="w-full rounded-full pr-12 pl-4 py-3 border border-border bg-white shadow-soft 
                         focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white transition-all hover:opacity-90"
                disabled={!input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

const createNewConversation = async () => {
    try {
      const chatId = await initializeChat();
      localStorage.setItem('currentChatId', chatId);
      
      const newConversation = {
        id: chatId,
        title: "New Conversation",
        messages: [],
        timestamp: new Date()
      };
      
      setConversations(prev => [...prev, newConversation]);
      setActiveConversationId(chatId);
      setMessages([]);
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create a new conversation. Please try again.",
        variant: "destructive"
      });
    }
  };
