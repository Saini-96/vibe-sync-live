import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Coins, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GiftPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onGiftSent: (giftType: string) => void;
  onTopUp?: () => void;
  coinBalance: number;
  onCoinUpdate: (newBalance: number) => void;
}


interface GiftItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: 'small' | 'medium' | 'large' | 'premium';
  animation: string;
}

const GiftPanel = ({ isOpen, onClose, onGiftSent, onTopUp, coinBalance, onCoinUpdate }: GiftPanelProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const gifts: GiftItem[] = [
    { id: '1', name: 'Rose', emoji: '🌹', cost: 1, category: 'small', animation: 'float' },
    { id: '2', name: 'Heart', emoji: '❤️', cost: 5, category: 'small', animation: 'pulse' },
    { id: '3', name: 'Kiss', emoji: '💋', cost: 10, category: 'small', animation: 'bounce' },
    { id: '4', name: 'Thumbs Up', emoji: '👍', cost: 15, category: 'medium', animation: 'scale' },
    { id: '5', name: 'Microphone', emoji: '🎤', cost: 25, category: 'medium', animation: 'swing' },
    { id: '6', name: 'Guitar', emoji: '🎸', cost: 50, category: 'medium', animation: 'strum' },
    { id: '7', name: 'Fireworks', emoji: '🎆', cost: 100, category: 'large', animation: 'explode' },
    { id: '8', name: 'Diamond', emoji: '💎', cost: 200, category: 'large', animation: 'sparkle' },
    { id: '9', name: 'Crown', emoji: '👑', cost: 500, category: 'premium', animation: 'royal' },
    { id: '10', name: 'Castle', emoji: '🏰', cost: 1000, category: 'premium', animation: 'majestic' },
    { id: '11', name: 'Rocket', emoji: '🚀', cost: 300, category: 'large', animation: 'launch' },
    { id: '12', name: 'Trophy', emoji: '🏆', cost: 150, category: 'large', animation: 'victory' },
  ];

  const categories = [
    { id: 'all', name: 'All', emoji: '💝' },
    { id: 'small', name: 'Small', emoji: '🌸' },
    { id: 'medium', name: 'Medium', emoji: '⭐' },
    { id: 'large', name: 'Large', emoji: '🎊' },
    { id: 'premium', name: 'Premium', emoji: '👑' },
  ];

  const filteredGifts = selectedCategory === 'all' 
    ? gifts 
    : gifts.filter(gift => gift.category === selectedCategory);

  const handleSendGift = (gift: GiftItem) => {
    if (coinBalance >= gift.cost) {
      onCoinUpdate(coinBalance - gift.cost);
      onGiftSent(gift.animation);
      onClose(); // Close panel immediately after gift selection
      
      // Show success feedback
      // In a real app, this would also send to backend
    } else {
      // Show insufficient coins message
      alert("Not enough coins! Top up to send this gift.");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'small': return 'from-green-500 to-green-600';
      case 'medium': return 'from-blue-500 to-blue-600';
      case 'large': return 'from-purple-500 to-purple-600';
      case 'premium': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-transparent z-50 flex items-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          className="w-full bg-card/80 backdrop-blur-xl border border-white/20 rounded-t-3xl h-[60vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-gift flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Send Gifts</h2>
                <p className="text-sm text-muted-foreground">Support your favorite streamer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-foreground">{coinBalance.toLocaleString()}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 p-4 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap rounded-full"
              >
                <span className="mr-1">{category.emoji}</span>
                {category.name}
              </Button>
            ))}
          </div>

          {/* Coin Balance & Top Up */}
          <div className="px-4 mb-4">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-black text-foreground">{coinBalance.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">coins</span>
                  </div>
                </div>
                <Button variant="gift" size="sm" className="rounded-full" onClick={() => { onTopUp?.(); }}>
                  <Plus className="w-4 h-4 mr-1" />
                  Top Up
                </Button>
              </div>
            </div>
          </div>

          {/* Gifts Grid */}
          <div className="px-4 pb-6 flex-1 overflow-hidden">
            <div className={`grid grid-cols-4 gap-3 h-full ${selectedCategory === 'all' ? 'overflow-y-auto' : ''} scrollbar-hide`}>
              {filteredGifts.map((gift, index) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendGift(gift)}
                  className="relative cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${getCategoryColor(gift.category)} rounded-2xl p-4 text-center relative overflow-hidden group hover:scale-105 transition-transform`}>
                    {/* Gift Emoji */}
                    <div className="text-3xl mb-2 group-hover:animate-bounce">
                      {gift.emoji}
                    </div>
                    
                    {/* Gift Name */}
                    <p className="text-white font-bold text-xs mb-1">{gift.name}</p>
                    
                    {/* Cost */}
                    <div className="flex items-center justify-center gap-1">
                      <Coins className="w-3 h-3 text-yellow-300" />
                      <span className="text-white font-bold text-xs">{gift.cost}</span>
                    </div>

                    {/* Insufficient Coins Overlay */}
                    {coinBalance < gift.cost && (
                      <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Need {gift.cost - coinBalance} more</span>
                      </div>
                    )}

                    {/* Sparkle Effect for Premium */}
                    {gift.category === 'premium' && (
                      <div className="absolute top-1 right-1">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="text-yellow-300 text-xs"
                        >
                          ✨
                        </motion.span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-full">
                Purchase History
              </Button>
              <Button variant="secondary" className="flex-1 rounded-full">
                Gift Rules
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GiftPanel;