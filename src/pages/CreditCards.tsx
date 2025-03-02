
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { CreditCard, Plus, CreditCard as CreditCardIcon, ArrowUpDown } from 'lucide-react';
import { mockCreditCards, CreditCard as CreditCardType } from '@/utils/debtUtils';
import CreditCardDisplay from '@/components/CreditCardDisplay';
import { fetchCreditCards } from '@/utils/dbService';
import { useToast } from '@/hooks/use-toast';

const CreditCards: React.FC = () => {
  const [creditCards, setCreditCards] = useState<CreditCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'balance' | 'dueDate' | 'interestRate'>('balance');
  const { toast } = useToast();

  useEffect(() => {
    loadCreditCards();
  }, []);

  const loadCreditCards = async () => {
    setLoading(true);
    try {
      const fetchedCards = await fetchCreditCards();
      if (fetchedCards.length > 0) {
        setCreditCards(fetchedCards);
      } else {
        // Use mock data if no cards found
        setCreditCards(mockCreditCards);
      }
    } catch (error) {
      console.error("Error loading credit cards:", error);
      toast({
        title: "Error",
        description: "Failed to load your credit cards. Using sample data instead.",
        variant: "destructive",
      });
      setCreditCards(mockCreditCards);
    } finally {
      setLoading(false);
    }
  };

  const sortedCards = [...creditCards].sort((a, b) => {
    switch (sortBy) {
      case 'balance':
        return b.currentBalance - a.currentBalance;
      case 'dueDate':
        return new Date(a.minimumPaymentDueDate).getTime() - new Date(b.minimumPaymentDueDate).getTime();
      case 'interestRate':
        return b.interestRate - a.interestRate;
      default:
        return 0;
    }
  });

  const totalBalance = creditCards.reduce((sum, card) => sum + card.currentBalance, 0);
  const totalMinimumDue = creditCards.reduce((sum, card) => sum + card.minimumPaymentDue, 0);
  const totalPastDue = creditCards.reduce((sum, card) => sum + card.pastDueAmount, 0);

  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      {/* Credit Cards Header */}
      <section className="pt-32 pb-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h1 
            className="text-3xl font-medium mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Credit Cards
          </motion.h1>
          <motion.p 
            className="text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Monitor and manage your credit card accounts
          </motion.p>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                label: 'Total Balance',
                value: `$${totalBalance.toLocaleString()}`,
                icon: <CreditCardIcon size={20} className="text-primary" />,
                color: 'from-blue-500/10 to-primary/10',
                iconBg: 'bg-blue-500/10',
              },
              {
                label: 'Minimum Due',
                value: `$${totalMinimumDue.toLocaleString()}`,
                icon: <Plus size={20} className="text-primary" />,
                color: 'from-primary/10 to-blue-400/10',
                iconBg: 'bg-primary/10',
              },
              {
                label: 'Past Due',
                value: `$${totalPastDue.toLocaleString()}`,
                icon: <ArrowUpDown size={20} className="text-primary" />,
                color: 'from-blue-400/10 to-blue-300/10',
                iconBg: 'bg-blue-400/10',
              }
            ].map((metric, index) => (
              <motion.div 
                key={index}
                className="glass p-6 rounded-xl overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color}`} />
                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${metric.iconBg}`}>
                    {metric.icon}
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <h3 className="text-2xl font-medium">{metric.value}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Your Credit Cards</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('balance')}
                className={`px-3 py-1.5 text-xs rounded-lg ${sortBy === 'balance' ? 'bg-primary text-white' : 'bg-secondary'}`}
              >
                Sort by Balance
              </button>
              <button
                onClick={() => setSortBy('dueDate')}
                className={`px-3 py-1.5 text-xs rounded-lg ${sortBy === 'dueDate' ? 'bg-primary text-white' : 'bg-secondary'}`}
              >
                Sort by Due Date
              </button>
              <button
                onClick={() => setSortBy('interestRate')}
                className={`px-3 py-1.5 text-xs rounded-lg ${sortBy === 'interestRate' ? 'bg-primary text-white' : 'bg-secondary'}`}
              >
                Sort by Interest Rate
              </button>
            </div>
          </div>
          
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCards.map((card, index) => (
              <CreditCardDisplay key={card.name} card={card} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreditCards;
