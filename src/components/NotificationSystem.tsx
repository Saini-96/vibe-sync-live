import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  X, 
  Heart, 
  Users, 
  Gift, 
  Play,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'live' | 'follow' | 'gift' | 'like';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
}

const NotificationSystem = ({ isOpen, onClose }: NotificationSystemProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "live",
      title: "Alice_Sunshine is now live!",
      message: "Join her late night singing session",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
      avatar: "👩‍🎤"
    },
    {
      id: "2", 
      type: "follow",
      title: "New Follower",
      message: "MusicLover99 started following you",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      avatar: "🎵"
    },
    {
      id: "3",
      type: "gift",
      title: "Gift Received!",
      message: "StreamFan42 sent you a Crown 👑",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: true,
      avatar: "👑"
    },
    {
      id: "4",
      type: "like", 
      title: "Your stream got 1000 likes!",
      message: "Your 'Acoustic Evening' stream reached 1K likes",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      avatar: "❤️"
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'live': return <Play className="w-5 h-5 text-red-500" />;
      case 'follow': return <Users className="w-5 h-5 text-blue-500" />;
      case 'gift': return <Gift className="w-5 h-5 text-yellow-500" />;
      case 'like': return <Heart className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
          className="w-full md:w-96 bg-card rounded-t-3xl md:rounded-3xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-lg font-bold text-foreground">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">{unreadCount} new notifications</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">
                  When your friends go live or interact with you, you'll see it here.
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all hover:bg-muted/50 ${
                      !notification.read ? 'bg-primary/10 border border-primary/20' : 'bg-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar/Icon */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          {notification.avatar ? (
                            <span className="text-lg">{notification.avatar}</span>
                          ) : (
                            getNotificationIcon(notification.type)
                          )}
                        </div>
                        {!notification.read && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-bold text-sm ${
                            !notification.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full rounded-full">
              View All Notifications
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationSystem;