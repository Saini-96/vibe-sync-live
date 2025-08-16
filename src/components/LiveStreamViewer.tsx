import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Heart, 
  Gift, 
  Share2, 
  Eye, 
  MoreVertical,
  Send,
  Pin,
  UserPlus,
  Flag,
  Smile,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ViewerListModal, { Viewer } from "@/components/ViewerListModal";
import ReportModal from "@/components/ReportModal";
import EmojiPicker from "@/components/EmojiPicker";
import { toast } from "@/hooks/use-toast";
import { useAdvancedModeration } from "@/hooks/useAdvancedModeration";
import { useGiftAnimations } from "@/hooks/useGiftAnimations";

interface LiveStreamViewerProps {
  streamId: string;
  onBack: () => void;
  onGiftPanel: () => void;
  giftAnimation?: string | null;
  coinBalance: number;
  onCoinUpdate: (newBalance: number) => void;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isStreamer?: boolean;
  isModerator?: boolean;
  isPinned?: boolean;
}

interface FloatingHeart {
  id: string;
  x: number;
  y: number;
}

const LiveStreamViewer = ({ streamId, onBack, onGiftPanel, giftAnimation: externalGiftAnimation, coinBalance, onCoinUpdate }: LiveStreamViewerProps) => {
  const [message, setMessage] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(1247);
  const [viewerCount, setViewerCount] = useState(24123);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [giftAnimation, setGiftAnimation] = useState<string | null>(null);

  const [isViewerListOpen, setIsViewerListOpen] = useState(false);
  const [viewers] = useState<Viewer[]>([
    { id: "u1", name: "User123", avatarUrl: "https://i.pravatar.cc/100?img=1", totalCoins: 120 },
    { id: "u2", name: "Luna", avatarUrl: "https://i.pravatar.cc/100?img=2", totalCoins: 540 },
    { id: "u3", name: "NovaStar", avatarUrl: "https://i.pravatar.cc/100?img=3", totalCoins: 15 },
    { id: "u4", name: "BeatRider", avatarUrl: "https://i.pravatar.cc/100?img=4", totalCoins: 0 },
    { id: "u5", name: "Melody", avatarUrl: "https://i.pravatar.cc/100?img=5", totalCoins: 1000 },
  ]);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);
  const { checkMessage, moderationState } = useAdvancedModeration();
  const giftAnimations = useGiftAnimations();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mock stream data
  const streamData = {
    streamer: "Alice_Sunshine",
    title: "Late Night Singing Session 🎤",
    category: "Music",
    isLive: true,
  };

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      username: "MusicLover99",
      message: "Amazing voice! 😍",
      timestamp: new Date(),
    },
    {
      id: "2",
      username: "Alice_Sunshine",
      message: "Thank you so much everyone! 💕",
      timestamp: new Date(),
      isStreamer: true,
    },
    {
      id: "3",
      username: "StreamMod",
      message: "Welcome everyone! Be kind and enjoy the show 🎵",
      timestamp: new Date(),
      isModerator: true,
      isPinned: true,
    },
    {
      id: "4",
      username: "FanGirl22",
      message: "Can you sing my favorite song?",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const mod = checkMessage(trimmed);
    if (mod.flagged) {
      toast({ 
        title: "Message blocked", 
        description: mod.reason || "Please be respectful in chat.", 
        variant: "destructive" 
      });
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: "You",
      message: trimmed,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newMessage]);
    setMessage("");
    
    // Auto scroll to bottom when user sends message
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  const handleChatScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop === clientHeight;
    setIsScrolledUp(!isAtBottom);
    
    if (isAtBottom) {
      setShowNewMessageIndicator(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMessageIndicator(false);
    setIsScrolledUp(false);
  };

  const handleLike = () => {
    setLikeCount(prev => prev + 1);
    
    // Create floating heart
    const heartId = Date.now().toString();
    const newHeart: FloatingHeart = {
      id: heartId,
      x: Math.random() * 100,
      y: 100,
    };
    
    setFloatingHearts(prev => [...prev, newHeart]);
    
    // Remove heart after animation
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => heart.id !== heartId));
    }, 3000);
  };

  const handleGift = (giftType: string) => {
    setGiftAnimation(giftType);
    setTimeout(() => setGiftAnimation(null), 2000);
  };

  // Update gift animation when external prop changes
  useEffect(() => {
    if (!externalGiftAnimation) return;
    setGiftAnimation(externalGiftAnimation);
    const timeout = setTimeout(() => setGiftAnimation(null), 2500);
    return () => clearTimeout(timeout);
  }, [externalGiftAnimation]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // Simulate new chat messages and handle scroll indicator
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        "This is so good! 🔥",
        "Love this song! ❤️",
        "You're amazing!",
        "More songs please! 🎵",
        "Best stream ever! ⭐",
      ];
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: `User${Math.floor(Math.random() * 1000)}`,
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      
      // Show new message indicator if scrolled up
      if (isScrolledUp) {
        setShowNewMessageIndicator(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isScrolledUp]);

  // Prune chat messages older than 2 minutes
  useEffect(() => {
    const prune = setInterval(() => {
      setChatMessages(prev => prev.filter(m => Date.now() - m.timestamp.getTime() < 2 * 60 * 1000));
    }, 10000);
    return () => clearInterval(prune);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Live Video Area */}
      <div className="relative h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
        {/* Background Video Simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10">
          <motion.div
            className="w-full h-full flex items-center justify-center text-8xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎤
          </motion.div>
        </div>

        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-overlay-dark to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-sm">👩‍🎤</span>
                </div>
                <div>
                  <h2 className="text-white font-bold">{streamData.streamer}</h2>
                  <div className="flex items-center gap-2">
                    <Badge className="live-indicator text-xs">LIVE</Badge>
                    <button
                      type="button"
                      onClick={() => setIsViewerListOpen(true)}
                      className="viewer-count cursor-pointer hover:opacity-90 transition-opacity"
                      aria-label="Viewers list"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {viewerCount.toLocaleString()}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isFollowing ? "secondary" : "follow"}
                size="sm"
                onClick={handleFollow}
                className="text-white"
              >
                {isFollowing ? "Following" : <><UserPlus className="w-4 h-4 mr-1" />Follow</>}
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Pinned Message */}
        {chatMessages.find(msg => msg.isPinned) && (
          <div className="absolute top-20 left-4 right-4">
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-start gap-2">
                <Pin className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <span className="text-yellow-400 font-bold text-sm">
                    {chatMessages.find(msg => msg.isPinned)?.username}:
                  </span>
                  <span className="text-white ml-2">
                    {chatMessages.find(msg => msg.isPinned)?.message}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Chat Messages with Transparent Background */}
        <div 
          ref={chatContainerRef}
          className="absolute left-4 bottom-32 right-24 max-h-64 overflow-y-auto scrollbar-hide"
          onScroll={handleChatScroll}
        >
          <AnimatePresence initial={false}>
            <div className="space-y-2">
              {chatMessages
                .filter((m) => !m.isPinned)
                .map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="group relative"
                  >
                    <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-2 max-w-xs">
                      <span className={`font-bold text-sm ${
                        msg.isStreamer ? 'text-yellow-400' : 
                        msg.isModerator ? 'text-green-400' : 
                        'text-blue-400'
                      }`}>
                        {msg.isModerator && !msg.isStreamer && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mr-1"
                          >
                            🛡️
                          </motion.span>
                        )}
                        {msg.username}:
                      </span>
                      <span className="ml-2 text-white text-sm">{msg.message}</span>
                      
                      {/* Moderation Controls - Only visible to assigned moderators */}
                      {!msg.isStreamer && (
                        <div className="absolute -right-16 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/60 rounded-full p-1">
                          <button
                            onClick={() => console.log('Mute user:', msg.username)}
                            className="text-xs text-orange-400 hover:text-orange-300 p-1 rounded-full hover:bg-white/20"
                            title="Mute user"
                          >
                            🔇
                          </button>
                          <button
                            onClick={() => console.log('Ban user:', msg.username)}
                            className="text-xs text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-white/20"
                            title="Ban user"
                          >
                            🚫
                          </button>
                          <button
                            onClick={() => console.log('Pin message:', msg.message)}
                            className="text-xs text-yellow-400 hover:text-yellow-300 p-1 rounded-full hover:bg-white/20"
                            title="Pin message"
                          >
                            📌
                          </button>
                          <button
                            onClick={() => console.log('Delete message:', msg.id)}
                            className="text-xs text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-white/20"
                            title="Delete message"
                          >
                            🛡️
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              <div ref={chatEndRef} />
            </div>
          </AnimatePresence>
          
          {/* New Message Indicator */}
          {showNewMessageIndicator && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={scrollToBottom}
              className="sticky bottom-0 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-primary/90 transition-colors"
            >
              New Messages
              <ChevronDown className="w-3 h-3" />
            </motion.button>
          )}
        </div>

        {/* Gift Acknowledgment Message */}
        {giftAnimations.acknowledgmentMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-32 left-4 right-4 z-20"
          >
            <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm rounded-xl p-3 text-center">
              <span className="text-white font-bold text-sm">
                {giftAnimations.acknowledgmentMessage}
              </span>
            </div>
          </motion.div>
        )}

        {/* Floating Hearts */}
        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ 
                opacity: 1, 
                y: window.innerHeight - 200,
                x: `${heart.x}%`,
                scale: 0.8
              }}
              animate={{ 
                opacity: 0, 
                y: -100,
                scale: 1.2,
                rotate: 360
              }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute text-red-500 text-2xl pointer-events-none"
            >
              ❤️
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced Gift Animations */}
        <AnimatePresence>
          {(giftAnimation || giftAnimations.currentAnimation) && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div className="text-center">
                {/* Enhanced Gift Animations with Sound */}
                {(giftAnimation === 'float' || giftAnimations.currentAnimation?.giftName === 'Rose') && (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: -100, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="text-6xl"
                  >
                    🌹
                  </motion.div>
                )}
                
                {(giftAnimation === 'explode' || giftAnimations.currentAnimation?.giftName === 'Fireworks') && (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 2, 1] }}
                      transition={{ duration: 1 }}
                      className="text-8xl mb-4"
                    >
                      🎆
                    </motion.div>
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{ 
                          scale: 1, 
                          x: (Math.cos(i * 30 * Math.PI / 180) * 250),
                          y: (Math.sin(i * 30 * Math.PI / 180) * 250),
                          opacity: [1, 0]
                        }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="absolute text-3xl"
                      >
                        ✨
                      </motion.div>
                    ))}
                  </>
                )}
                
                {(giftAnimation === 'royal' || giftAnimations.currentAnimation?.giftName === 'Crown') && (
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.5, repeat: 4 }}
                      className="text-8xl mb-4"
                    >
                      👑
                    </motion.div>
                    <div className="text-yellow-400 text-4xl font-black mb-2">ROYAL CROWN!</div>
                    <div className="w-full h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 animate-pulse" />
                  </motion.div>
                )}

                {/* Diamond Animation */}
                {giftAnimations.currentAnimation?.giftName === 'Diamond' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: 2 }}
                      className="text-8xl mb-4"
                    >
                      💎
                    </motion.div>
                    <div className="text-blue-400 text-3xl font-black">DIAMOND!</div>
                  </motion.div>
                )}
                
                {/* Default animation for other gift types */}
                {!['float', 'explode', 'royal'].includes(giftAnimation || '') && 
                 !['Rose', 'Fireworks', 'Crown', 'Diamond'].includes(giftAnimations.currentAnimation?.giftName || '') && 
                 (giftAnimation || giftAnimations.currentAnimation) && (
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    {giftAnimations.currentAnimation?.giftEmoji || '🎁'}
                  </motion.div>
                )}
                
                <motion.p
                  className="text-2xl font-black text-white bg-black/50 px-4 py-2 rounded-full"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {giftAnimations.currentAnimation ? 
                    `${giftAnimations.currentAnimation.giftName} Received!` : 
                    'Gift Received!'
                  }
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side Controls */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-4">
          {/* Like Button */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <Heart className="w-6 h-6 fill-red-500 text-red-500" />
            </Button>
            <span className="text-white text-xs mt-1 font-bold">{likeCount}</span>
          </motion.div>

          {/* Gift Button */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onGiftPanel}
              className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <Gift className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs mt-1">Gifts</span>
          </motion.div>

          {/* Report Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsReportOpen(true)}
            className="w-12 h-12 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          >
            <Flag className="w-5 h-5" />
          </Button>
        </div>

        {/* Enhanced Chat Input with Emoji Picker */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2">
            <div className="flex-1 flex bg-black/40 backdrop-blur-sm rounded-full border border-white/20 relative">
              <Input
                placeholder={moderationState.isBanned ? "You are temporarily banned" : "Send a message..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={moderationState.isBanned}
                className="bg-transparent border-0 text-white placeholder:text-white/70 px-4 py-3 rounded-l-full focus:ring-0 pr-12"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full w-8 h-8"
              >
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim() || moderationState.isBanned}
                className="text-white hover:bg-white/20 rounded-r-full"
              >
                <Send className="w-5 h-5" />
              </Button>
              
              {/* Emoji Picker */}
              <EmojiPicker
                isOpen={isEmojiPickerOpen}
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setIsEmojiPickerOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <ViewerListModal 
        isOpen={isViewerListOpen}
        onClose={() => setIsViewerListOpen(false)}
        viewers={viewers}
      />
      
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        streamId={streamId}
        streamerName={streamData.streamer}
      />
    </div>
  );
};

export default LiveStreamViewer;