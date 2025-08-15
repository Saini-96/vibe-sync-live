import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface EmojiPickerProps {
  isOpen: boolean;
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker = ({ isOpen, onEmojiSelect, onClose }: EmojiPickerProps) => {
  const emojiCategories = {
    "Faces": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳"],
    "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️", "💋", "💯"],
    "Hands": ["👏", "🙌", "👐", "🤲", "🤝", "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "🤏", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖"],
    "Symbols": ["🔥", "⭐", "✨", "💫", "🌟", "💥", "💢", "💦", "💨", "🕳️", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "🎉", "🎊", "🎈", "🎀", "🎁", "🏆", "🥇", "🥈", "🥉"]
  };

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full right-0 mb-2 bg-card/95 backdrop-blur-sm border border-white/20 rounded-2xl p-4 max-w-80 z-10"
    >
      <div className="max-h-48 overflow-y-auto scrollbar-hide">
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category} className="mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">{category}</h4>
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 p-0 text-lg hover:bg-primary/20 transition-colors"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EmojiPicker;