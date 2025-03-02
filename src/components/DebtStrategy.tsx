
import React, { useState } from 'react';
import { 
  calculatePaymentPlan, 
  Debt, 
  type DebtStrategy as DebtStrategyType, 
  getTotalMinimumPayment 
} from '@/utils/debtUtils';
import Button from './Button';
import { cn } from '@/lib/utils';
import { ArrowRight, DollarSign, TrendingDown, CreditCard, Percent, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DebtStrategyProps {
  debts: Debt[];
}

const DebtStrategy: React.FC<DebtStrategyProps> = ({ debts }) => {
  const [strategy, setStrategy] = useState<DebtStrategyType>('avalanche');
  const [extraPayment, setExtraPayment] = useState<number>(100);
  const [animateResults, setAnimateResults] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const minimumPayment = getTotalMinimumPayment(debts);
  const paymentPlan = calculatePaymentPlan(debts, extraPayment, strategy);
  
  const handleStrategyChange = (newStrategy: DebtStrategyType) => {
    if (strategy !== newStrategy) {
      setStrategy(newStrategy);
      // Trigger animation
      setAnimateResults(false);
      setTimeout(() => setAnimateResults(true), 50);
    }
  };
  
  const handleExtraPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setExtraPayment(value);
      // Trigger animation
      setAnimateResults(false);
      setTimeout(() => setAnimateResults(true), 50);
    }
  };

  const handleSeeDetailedPaymentSchedule = () => {
    navigate('/dashboard', { state: { activeTab: 'payment-plan', strategy, extraPayment } });
  };

  const renderStrategyDescription = () => {
    if (strategy === 'avalanche') {
      return (
        <div className="bg-primary/10 p-4 rounded-xl mt-4">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <Percent size={16} className="mr-2 text-primary" />
            Avalanche Strategy
          </h4>
          <p className="text-xs text-muted-foreground">
            Focuses on highest interest rate debts first to minimize total interest. 
            This saves you more money in the long run by eliminating the most expensive debts first.
          </p>
          {debts.length > 0 && (
            <div className="mt-3 text-xs">
              <p className="font-medium">Your payment order:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                {[...debts].sort((a, b) => b.interestRate - a.interestRate).map((debt, index) => (
                  <li key={debt.id} className="text-muted-foreground">
                    {debt.creditor} ({debt.interestRate}% interest)
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="bg-primary/10 p-4 rounded-xl mt-4">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <Calendar size={16} className="mr-2 text-primary" />
            Snowball Strategy
          </h4>
          <p className="text-xs text-muted-foreground">
            Focuses on lowest balance debts first for psychological wins. 
            This gives you quick victories to build momentum and motivation as you pay off each debt.
          </p>
          {debts.length > 0 && (
            <div className="mt-3 text-xs">
              <p className="font-medium">Your payment order:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                {[...debts].sort((a, b) => a.balance - b.balance).map((debt, index) => (
                  <li key={debt.id} className="text-muted-foreground">
                    {debt.creditor} (${debt.balance.toLocaleString()} balance)
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="mb-4">
        <h3 className="text-xl font-medium">Debt Repayment Strategy</h3>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Strategy
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleStrategyChange('avalanche')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl transition-all duration-300 text-sm font-medium",
                strategy === 'avalanche'
                  ? "bg-primary text-white shadow-soft" 
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              Avalanche
            </button>
            <button
              onClick={() => handleStrategyChange('snowball')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl transition-all duration-300 text-sm font-medium",
                strategy === 'snowball' 
                  ? "bg-primary text-white shadow-soft" 
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              Snowball
            </button>
          </div>
          
          {renderStrategyDescription()}
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Extra Monthly Payment
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <DollarSign size={16} className="text-muted-foreground" />
            </div>
            <input
              type="number"
              value={extraPayment}
              onChange={handleExtraPaymentChange}
              min="0"
              step="50"
              className="w-full rounded-xl border border-border bg-white pl-9 pr-4 py-3 shadow-soft 
                       focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Add any amount above your minimum payments to accelerate debt payoff.
          </p>
          
          <div className="mt-4 p-4 bg-accent/10 rounded-xl">
            <h4 className="font-medium text-sm mb-2 flex items-center">
              <ArrowRight size={16} className="mr-2 text-accent" />
              Strategy Impact
            </h4>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Interest Paid:</span>
                <span className="font-medium">${paymentPlan.totalInterestPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Saved:</span>
                <span className="font-medium text-accent">${paymentPlan.interestSaved.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time to Debt-Free:</span>
                <span className="font-medium">{paymentPlan.monthsToDebtFree} months</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 transition-opacity duration-500",
        animateResults ? "opacity-100" : "opacity-0"
      )}>
        <div className="glass-dark p-4 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">Total Monthly Payment</p>
          <h4 className="text-xl font-medium">${(minimumPayment + extraPayment).toLocaleString()}</h4>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <CreditCard size={12} className="mr-1" />
            <span>${minimumPayment} minimum + ${extraPayment} extra</span>
          </div>
        </div>
        
        <div className="glass-dark p-4 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">Interest Saved</p>
          <h4 className="text-xl font-medium text-accent">${paymentPlan.interestSaved.toLocaleString()}</h4>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <TrendingDown size={12} className="mr-1" />
            <span>vs. minimum payments only</span>
          </div>
        </div>
        
        <div className="glass-dark p-4 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">Debt-Free Timeline</p>
          <h4 className="text-xl font-medium">{paymentPlan.monthsToDebtFree} months</h4>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <ArrowRight size={12} className="mr-1" />
            <span>By {paymentPlan.payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button className="w-full md:w-auto" onClick={handleSeeDetailedPaymentSchedule}>
          See Detailed Payment Schedule
        </Button>
      </div>
    </div>
  );
};

export default DebtStrategy;
