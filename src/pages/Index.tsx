import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import OnboardingCarousel from "@/components/OnboardingCarousel";
import AuthScreen from "@/components/AuthScreen";
import HomeFeed from "@/components/HomeFeed";
import LiveStreamViewer from "@/components/LiveStreamViewer";
import StreamerInterface from "@/components/StreamerInterface";
import GiftPanel from "@/components/GiftPanel";
import UserProfile from "@/components/UserProfile";
import NotificationSystem from "@/components/NotificationSystem";
import WalletModal from "@/components/WalletModal";
import ChatModal from "@/components/ChatModal";

type AppState = 
  | 'splash'
  | 'onboarding' 
  | 'auth'
  | 'home'
  | 'viewer'
  | 'streamer'
  | 'profile';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('splash');
  const [selectedStreamId, setSelectedStreamId] = useState<string>("");
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [giftAnimation, setGiftAnimation] = useState<string | null>(null);

  const handleGiftSent = (giftType: string) => {
    setShowGiftPanel(false);
    setGiftAnimation(giftType);
    setTimeout(() => setGiftAnimation(null), 3000);
    console.log("Gift sent:", giftType);
  };

  const renderCurrentScreen = () => {
    switch (currentState) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentState('onboarding')} />;
        
      case 'onboarding':
        return <OnboardingCarousel onComplete={() => setCurrentState('auth')} />;
        
      case 'auth':
        return (
          <AuthScreen 
            onComplete={() => setCurrentState('home')}
            onBack={() => setCurrentState('onboarding')}
          />
        );
        
      case 'home':
        return (
          <>
            <HomeFeed 
              onStreamSelect={(streamId) => {
                setSelectedStreamId(streamId);
                setCurrentState('viewer');
              }}
              onGoLive={() => setCurrentState('streamer')}
              onProfileClick={() => setCurrentState('profile')}
              onNotificationClick={() => setShowNotifications(true)}
              onWalletClick={() => setShowWallet(true)}
              onChatClick={() => setShowChat(true)}
            />
            <NotificationSystem 
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
            <WalletModal 
              isOpen={showWallet}
              onClose={() => setShowWallet(false)}
            />
            <ChatModal 
              isOpen={showChat}
              onClose={() => setShowChat(false)}
            />
          </>
        );
        
      case 'viewer':
        return (
          <>
            <LiveStreamViewer 
              streamId={selectedStreamId}
              onBack={() => setCurrentState('home')}
              onGiftPanel={() => setShowGiftPanel(true)}
              giftAnimation={giftAnimation}
            />
            <GiftPanel 
              isOpen={showGiftPanel}
              onClose={() => setShowGiftPanel(false)}
              onGiftSent={handleGiftSent}
              onTopUp={() => { setShowGiftPanel(false); setShowWallet(true); }}
            />
          </>
        );
        
      case 'streamer':
        return (
          <StreamerInterface 
            onEndStream={() => setCurrentState('home')}
          />
        );
        
      case 'profile':
        return (
          <UserProfile 
            onBack={() => setCurrentState('home')}
            isOwnProfile={true}
          />
        );
        
      default:
        return <div>Unknown state</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentScreen()}
    </div>
  );
};

export default Index;
