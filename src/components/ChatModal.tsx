import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  X, 
  Send, 
  MessageCircle, 
  Search,
  Phone,
  Video,
  MoreVertical,
  Crown,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isVip?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'gift' | 'system';
}

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatUsers: ChatUser[] = [
    {
      id: "1",
      name: "Alice_Sunshine",
      avatar: "👩‍🎤",
      isOnline: true,
      lastMessage: "Thanks for the gift! 🌹",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      unreadCount: 2,
      isVip: true
    },
    {
      id: "2", 
      name: "MusicLover99",
      avatar: "🎵",
      isOnline: true,
      lastMessage: "Your stream was amazing!",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 0
    },
    {
      id: "3",
      name: "StreamFan42",
      avatar: "🎮",
      isOnline: false,
      lastMessage: "When's your next stream?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      unreadCount: 1
    },
    {
      id: "4",
      name: "DanceQueen",
      avatar: "💃",
      isOnline: true,
      lastMessage: "Let's collab soon!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 0,
      isVip: true
    }
  ];

  const messages: { [key: string]: Message[] } = {
    "1": [
      {
        id: "1",
        senderId: "1",
        content: "Hey! Loved your stream tonight 🎤",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        type: 'text'
      },
      {
        id: "2",
        senderId: "me",
        content: "Thank you so much! 💖",
        timestamp: new Date(Date.now() - 1000 * 60 * 8),
        type: 'text'
      },
      {
        id: "3",
        senderId: "1",
        content: "Just sent you a rose 🌹",
        timestamp: new Date(Date.now() - 1000 * 60 * 6),
        type: 'gift'
      },
      {
        id: "4",
        senderId: "me",
        content: "Thanks for the gift! 🌹",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: 'text'
      }
    ]
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat]);

  const filteredUsers = chatUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return timestamp.toLocaleDateString();
  };

  const [allMessages, setAllMessages] = useState<{ [key: string]: Message[] }>(messages);

  const handleSendMessage = () => {
    if (message.trim() && activeChat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: "me",
        content: message,
        timestamp: new Date(),
        type: 'text'
      };
      
      setAllMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), newMessage]
      }));
      
      // Clear unread count for active chat
      setMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          className="w-full md:w-[600px] bg-card rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-hidden flex"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Chat List */}
          <div className={`${activeChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-border`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Chats</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveChat(user.id)}
                  className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                    activeChat === user.id ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-lg">{user.avatar}</span>
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground truncate">{user.name}</h3>
                          {user.isVip && <Crown className="w-3 h-3 text-yellow-500" />}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(user.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                        {user.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">{user.unreadCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          {activeChat && (
            <div className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden"
                    onClick={() => setActiveChat(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span>{chatUsers.find(u => u.id === activeChat)?.avatar}</span>
                      </div>
                      {chatUsers.find(u => u.id === activeChat)?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground flex items-center gap-2">
                        {chatUsers.find(u => u.id === activeChat)?.name}
                        {chatUsers.find(u => u.id === activeChat)?.isVip && <Crown className="w-3 h-3 text-yellow-500" />}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {chatUsers.find(u => u.id === activeChat)?.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(allMessages[activeChat] || []).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${
                      msg.senderId === 'me' 
                        ? 'bg-primary text-white' 
                        : msg.type === 'gift'
                          ? 'bg-gradient-gift text-white'
                          : 'bg-muted text-foreground'
                    } rounded-2xl px-4 py-2`}>
                      {msg.type === 'gift' && (
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="w-4 h-4" />
                          <span className="text-xs font-bold">Gift Sent</span>
                        </div>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        msg.senderId === 'me' ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatModal;