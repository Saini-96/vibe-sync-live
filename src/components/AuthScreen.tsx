import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Chrome, Facebook, Apple, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface AuthScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const AuthScreen = ({ onComplete, onBack }: AuthScreenProps) => {
  const [step, setStep] = useState<'login' | 'otp' | 'profile'>('login');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    profilePic: ""
  });

  const handleSendOtp = () => {
    if (phoneNumber) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      setStep('profile');
    }
  };

  const handleCompleteProfile = () => {
    if (profile.username) {
      onComplete();
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Simulate social login success
    setStep('profile');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold text-gradient-primary">TangoLive</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-20">
        {step === 'login' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-foreground mb-2">Welcome Back!</h2>
              <p className="text-muted-foreground">Sign in to start streaming and earning</p>
            </div>

            {/* Phone Login */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+91 Enter your number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-12 h-12 bg-card border-border text-lg"
                  />
                </div>
              </div>
              <Button 
                onClick={handleSendOtp}
                className="w-full"
                size="lg"
                disabled={!phoneNumber}
              >
                Send OTP
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button 
                onClick={() => handleSocialLogin('google')}
                variant="outline" 
                size="lg" 
                className="w-full"
              >
                <Chrome className="mr-3 w-5 h-5" />
                Continue with Google
              </Button>
              <Button 
                onClick={() => handleSocialLogin('facebook')}
                variant="outline" 
                size="lg" 
                className="w-full"
              >
                <Facebook className="mr-3 w-5 h-5" />
                Continue with Facebook
              </Button>
              <Button 
                onClick={() => handleSocialLogin('apple')}
                variant="outline" 
                size="lg" 
                className="w-full"
              >
                <Apple className="mr-3 w-5 h-5" />
                Continue with Apple
              </Button>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center mt-6">
              By signing up, you agree to our{" "}
              <a href="#" className="text-primary underline">Terms of Service</a> and{" "}
              <a href="#" className="text-primary underline">Privacy Policy</a>
            </p>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-foreground mb-2">Verify Your Number</h2>
              <p className="text-muted-foreground">
                We sent a code to {phoneNumber}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-digit code</Label>
                <Input
                  id="otp"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-2xl tracking-widest h-14 bg-card border-border"
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={handleVerifyOtp}
                className="w-full"
                size="lg"
                disabled={otp.length !== 6}
              >
                Verify & Continue
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive code?{" "}
                <button className="text-primary font-medium">Resend</button>
              </p>
            </div>
          </motion.div>
        )}

        {step === 'profile' && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-foreground mb-2">Create Your Profile</h2>
              <p className="text-muted-foreground">Let others know who you are</p>
            </div>

            {/* Profile Picture */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-2xl">📸</span>
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a cool username"
                  value={profile.username}
                  onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                  className="h-12 bg-card border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (optional)</Label>
                <Input
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="h-12 bg-card border-border"
                />
              </div>
              <Button 
                onClick={handleCompleteProfile}
                className="w-full"
                size="lg"
                disabled={!profile.username}
              >
                Complete Profile
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;