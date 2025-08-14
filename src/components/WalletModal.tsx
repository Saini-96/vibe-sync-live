import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  X, 
  Wallet, 
  Coins, 
  CreditCard, 
  Smartphone,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Transaction {
  id: string;
  type: 'purchase' | 'gift_sent' | 'gift_received' | 'earnings';
  amount: number;
  description: string;
  timestamp: Date;
}

const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {
  const [activeTab, setActiveTab] = useState<'balance' | 'topup' | 'history'>('balance');
  const [coinBalance, setCoinBalance] = useState(1250);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const quickAmounts = [100, 500, 1000, 2500, 5000, 10000];
  
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "gift_received",
      amount: 500,
      description: "Received Crown from StreamFan42",
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: "2", 
      type: "gift_sent",
      amount: -100,
      description: "Sent Fireworks to Alice_Sunshine",
      timestamp: new Date(Date.now() - 1000 * 60 * 60)
    },
    {
      id: "3",
      type: "purchase",
      amount: 1000,
      description: "Coin Purchase",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: "4",
      type: "earnings",
      amount: 250,
      description: "Stream earnings - 2 hours",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
    }
  ];

  const handleTopUp = (amount: number) => {
    setCoinBalance(prev => prev + amount);
    // In a real app, this would process payment
    setActiveTab('balance');
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'gift_sent': return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'gift_received': return <Gift className="w-4 h-4 text-purple-500" />;
      case 'earnings': return <Coins className="w-4 h-4 text-yellow-500" />;
      default: return <History className="w-4 h-4 text-gray-500" />;
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
          className="w-full md:w-96 bg-card rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Wallet</h2>
                <p className="text-sm text-muted-foreground">Manage your coins</p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {[
              { id: 'balance', label: 'Balance', icon: Wallet },
              { id: 'topup', label: 'Top Up', icon: CreditCard },
              { id: 'history', label: 'History', icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {activeTab === 'balance' && (
              <div className="space-y-4">
                {/* Balance Display */}
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Coins className="w-8 h-8 text-yellow-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                  <p className="text-3xl font-black text-foreground">{coinBalance.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">coins</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col gap-1"
                    onClick={() => setActiveTab('topup')}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">Top Up</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex-col gap-1"
                    onClick={() => setActiveTab('history')}
                  >
                    <History className="w-5 h-5" />
                    <span className="text-xs">History</span>
                  </Button>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="font-bold text-foreground mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{formatTimestamp(transaction.timestamp)}</p>
                          </div>
                        </div>
                        <div className={`font-bold text-sm ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'topup' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">Top Up Coins</h3>
                  <p className="text-sm text-muted-foreground">Choose an amount to add to your wallet</p>
                </div>

                {/* Quick Amounts */}
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((amount) => (
                    <motion.button
                      key={amount}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAmount(amount)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedAmount === amount
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-foreground">{amount.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">${(amount * 0.01).toFixed(2)}</p>
                    </motion.button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Custom Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter coin amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="text-center"
                  />
                </div>

                {/* Payment Methods */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Payment Method</h4>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-foreground">Credit/Debit Card</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                      <Smartphone className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-foreground">Mobile Payment</span>
                    </button>
                  </div>
                </div>

                {/* Purchase Button */}
                <Button 
                  className="w-full"
                  disabled={!selectedAmount && !customAmount}
                  onClick={() => handleTopUp(selectedAmount || parseInt(customAmount) || 0)}
                >
                  Purchase {selectedAmount || customAmount || 0} Coins
                </Button>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className="font-bold text-foreground">Transaction History</h3>
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{formatTimestamp(transaction.timestamp)}</p>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletModal;