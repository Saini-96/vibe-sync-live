import { useState } from 'react';

export interface ModerationAction {
  type: 'mute' | 'ban' | 'assign_moderator' | 'pin' | 'delete';
  userId: string;
  messageId?: string;
  reason?: string;
}

export interface ModeratedUser {
  id: string;
  username: string;
  status: 'muted' | 'banned' | 'active';
  isModerator: boolean;
  mutedUntil?: Date;
  bannedUntil?: Date;
}

export interface PinnedMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

export const useModerationControls = () => {
  const [moderatedUsers, setModeratedUsers] = useState<ModeratedUser[]>([]);
  const [pinnedMessage, setPinnedMessage] = useState<PinnedMessage | null>(null);
  const [deletedMessages, setDeletedMessages] = useState<Set<string>>(new Set());

  const muteUser = (userId: string, username: string, duration: number = 600000) => { // 10 minutes default
    const mutedUntil = new Date(Date.now() + duration);
    
    setModeratedUsers(prev => {
      const existing = prev.find(u => u.id === userId);
      if (existing) {
        return prev.map(u => 
          u.id === userId 
            ? { ...u, status: 'muted', mutedUntil }
            : u
        );
      }
      return [...prev, { 
        id: userId, 
        username, 
        status: 'muted', 
        isModerator: false,
        mutedUntil 
      }];
    });

    // Auto-unmute after duration
    setTimeout(() => {
      setModeratedUsers(prev => 
        prev.map(u => 
          u.id === userId && u.status === 'muted'
            ? { ...u, status: 'active', mutedUntil: undefined }
            : u
        )
      );
    }, duration);
  };

  const banUser = (userId: string, username: string) => {
    setModeratedUsers(prev => {
      const existing = prev.find(u => u.id === userId);
      if (existing) {
        return prev.map(u => 
          u.id === userId 
            ? { ...u, status: 'banned', bannedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) } // 24 hours
            : u
        );
      }
      return [...prev, { 
        id: userId, 
        username, 
        status: 'banned', 
        isModerator: false,
        bannedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }];
    });
  };

  const assignModerator = (userId: string, username: string) => {
    setModeratedUsers(prev => {
      const existing = prev.find(u => u.id === userId);
      if (existing) {
        return prev.map(u => 
          u.id === userId 
            ? { ...u, isModerator: true, status: 'active' }
            : u
        );
      }
      return [...prev, { 
        id: userId, 
        username, 
        status: 'active', 
        isModerator: true
      }];
    });
  };

  const pinMessage = (messageId: string, username: string, message: string) => {
    setPinnedMessage({
      id: messageId,
      username,
      message,
      timestamp: new Date()
    });
  };

  const unpinMessage = () => {
    setPinnedMessage(null);
  };

  const deleteMessage = (messageId: string) => {
    setDeletedMessages(prev => new Set([...prev, messageId]));
  };

  const isUserMuted = (userId: string): boolean => {
    const user = moderatedUsers.find(u => u.id === userId);
    return user?.status === 'muted' && (user.mutedUntil ? user.mutedUntil > new Date() : true);
  };

  const isUserBanned = (userId: string): boolean => {
    const user = moderatedUsers.find(u => u.id === userId);
    return user?.status === 'banned' && (user.bannedUntil ? user.bannedUntil > new Date() : true);
  };

  const isUserModerator = (userId: string): boolean => {
    const user = moderatedUsers.find(u => u.id === userId);
    return user?.isModerator || false;
  };

  const isMessageDeleted = (messageId: string): boolean => {
    return deletedMessages.has(messageId);
  };

  const clearModerationData = () => {
    setModeratedUsers([]);
    setPinnedMessage(null);
    setDeletedMessages(new Set());
  };

  return {
    moderatedUsers,
    pinnedMessage,
    muteUser,
    banUser,
    assignModerator,
    pinMessage,
    unpinMessage,
    deleteMessage,
    isUserMuted,
    isUserBanned,
    isUserModerator,
    isMessageDeleted,
    clearModerationData
  };
};