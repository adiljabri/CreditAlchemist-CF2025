
import React from 'react';
import { CreditCard } from '@/utils/debtUtils';
import { motion } from 'framer-motion';
import { CreditCard as CreditCardIcon, Percent, Calendar, AlertTriangle } from 'lucide-react';

interface CreditCardDisplayProps {
  card: CreditCard;
}

const CreditCardDisplay: React.FC<CreditCardDisplayProps> = ({ card }) => {
  const isOverLimit = card.amountOverLimit > 0;
  const isPastDue = card.pastDueAmount > 0;
  const utilizationRate = (card.currentBalance / card.creditLimit) * 100;
  
  const getUtilizationColor = () => {
    if (utilizationRate >= 90) return 'from-red-500/20 to-red-400/10';
    if (utilizationRate >= 70) return 'from-amber-500/20 to-amber-400/10';
    return 'from-green-500/20 to-green-400/10';
  };

  return (
    <motion.div 
      className="glass rounded-xl overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getUtilizationColor()} shimmer`} />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-primary animate-pulse" />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium">{card.name}</h3>
            <p className="text-sm text-muted-foreground">{card.creditorName}</p>
          </div>
          <div className="p-2 bg-white/30 backdrop-blur-sm rounded-lg">
            <CreditCardIcon size={20} className="text-primary" />
          </div>
        </div>
        
        {/* Balance and Limit */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
          <div className="flex items-end gap-2">
            <h2 className="text-2xl font-semibold">${card.currentBalance.toLocaleString()}</h2>
            <p className="text-sm text-muted-foreground">of ${card.creditLimit.toLocaleString()}</p>
          </div>
          <div className="mt-2 h-2 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${Math.min(utilizationRate, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>Utilization: {utilizationRate.toFixed(0)}%</span>
            <span>Available: ${card.availableCredit.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
              <Percent size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Interest Rate</p>
              <p className="font-medium">{card.interestRate}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
              <Calendar size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="font-medium">{new Date(card.minimumPaymentDueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        {/* Min Payment */}
        <div className="p-3 bg-white/30 backdrop-blur-sm rounded-lg mb-4">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Minimum Payment Due</p>
            <p className="text-sm font-semibold">${card.minimumPaymentDue.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Warnings */}
        {(isOverLimit || isPastDue) && (
          <div className={`p-3 rounded-lg ${isOverLimit && isPastDue ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className={isOverLimit && isPastDue ? 'text-red-600' : 'text-amber-600'} />
              <div>
                {isPastDue && (
                  <p className="text-sm font-medium">Past Due: ${card.pastDueAmount.toLocaleString()}</p>
                )}
                {isOverLimit && (
                  <p className="text-sm font-medium">Over Limit: ${card.amountOverLimit.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CreditCardDisplay;
