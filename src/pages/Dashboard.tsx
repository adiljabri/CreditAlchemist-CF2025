
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DebtVisualization from '@/components/DebtVisualization';
import DebtStrategy from '@/components/DebtStrategy';
import { Debt, mockDebts, getTotalDebt, getAverageInterestRate, getTotalMinimumPayment, calculatePaymentPlan } from '@/utils/debtUtils';
import { motion } from 'framer-motion';
import { DollarSign, Percent, Calendar, PlusCircle, CreditCard, Edit, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/Button';
import AddDebtForm from '@/components/AddDebtForm';
import PaymentSchedule from '@/components/PaymentSchedule';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';
import { fetchDebts, deleteDebt } from '@/utils/dbService';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showAddDebtForm, setShowAddDebtForm] = useState(false);
  const [extraPayment, setExtraPayment] = useState(100);
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we have location state with activeTab
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      if (location.state.strategy) setStrategy(location.state.strategy);
      if (location.state.extraPayment) setExtraPayment(location.state.extraPayment);
    }
  }, [location]);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    setLoading(true);
    try {
      const loadedDebts = await fetchDebts();
      if (loadedDebts.length > 0) {
        setDebts(loadedDebts);
      } else {
        // Use mock data if no debts found
        setDebts(mockDebts);
      }
    } catch (error) {
      console.error("Error loading debts:", error);
      toast({
        title: "Error",
        description: "Failed to load your debts. Using sample data instead.",
        variant: "destructive",
      });
      setDebts(mockDebts);
    } finally {
      setLoading(false);
    }
  };
  
  const totalDebt = getTotalDebt(debts);
  const averageInterestRate = getAverageInterestRate(debts);
  const totalMinimumPayment = getTotalMinimumPayment(debts);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleDeleteDebt = async (id: string) => {
    try {
      await deleteDebt(id);
      setDebts(prevDebts => prevDebts.filter(debt => debt.id !== id));
      toast({
        title: "Success",
        description: "Debt deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete debt",
        variant: "destructive",
      });
    }
  };

  const handleAddDebtSuccess = () => {
    setShowAddDebtForm(false);
    loadDebts();
  };

  // Calculate payment plan for the payment-plan tab
  const paymentPlan = calculatePaymentPlan(debts, extraPayment, strategy);

  // Create a payment plan from scratch
  const handleCreatePaymentPlan = () => {
    // Just switch to the overview tab which shows the DebtStrategy component
    setActiveTab('overview');
  };

  const handleExtraPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setExtraPayment(value);
    }
  };

  const handleStrategyChange = (newStrategy: 'avalanche' | 'snowball') => {
    setStrategy(newStrategy);
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      {/* Dashboard Header */}
      <section className="pt-32 pb-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h1 
            className="text-3xl font-medium mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Debt Dashboard
          </motion.h1>
          <motion.p 
            className="text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Track your progress and optimize your debt repayment strategy
          </motion.p>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: <DollarSign size={20} className="text-primary" />,
                label: 'Total Debt',
                value: `$${totalDebt.toLocaleString()}`,
                color: 'from-blue-500/10 to-primary/10',
                iconBg: 'bg-blue-500/10',
              },
              {
                icon: <Percent size={20} className="text-primary" />,
                label: 'Avg. Interest Rate',
                value: `${averageInterestRate}%`,
                color: 'from-primary/10 to-blue-400/10',
                iconBg: 'bg-primary/10',
              },
              {
                icon: <Calendar size={20} className="text-primary" />,
                label: 'Monthly Minimum',
                value: `$${totalMinimumPayment.toLocaleString()}`,
                color: 'from-blue-400/10 to-blue-300/10',
                iconBg: 'bg-blue-400/10',
              }
            ].map((metric, index) => (
              <motion.div 
                key={index}
                className={cn(
                  "glass p-6 rounded-xl overflow-hidden relative"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br",
                  metric.color
                )} />
                <div className="relative z-10">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-4",
                    metric.iconBg
                  )}>
                    {metric.icon}
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <h3 className="text-2xl font-medium">{metric.value}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            {['overview', 'debt-details', 'payment-plan'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all relative",
                  activeTab === tab 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                {activeTab === tab && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeTab"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-medium mb-4">Debt Distribution</h3>
                  <DebtVisualization debts={debts} />
                </div>
                <div>
                  <DebtStrategy debts={debts} />
                </div>
              </motion.div>
            )}
            
            {activeTab === 'debt-details' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {showAddDebtForm ? (
                  <AddDebtForm 
                    onSuccess={handleAddDebtSuccess} 
                    onCancel={() => setShowAddDebtForm(false)} 
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Your Debts</h3>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        icon={<PlusCircle size={16} />}
                        onClick={() => setShowAddDebtForm(true)}
                      >
                        Add New Debt
                      </Button>
                    </div>
                    
                    <div className="glass rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Creditor</th>
                              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Balance</th>
                              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Interest Rate</th>
                              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Min. Payment</th>
                              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Due Date</th>
                              <th className="py-3 px-4 text-xs font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {debts.map((debt, index) => (
                              <motion.tr 
                                key={debt.id}
                                className="border-b border-border"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                              >
                                <td className="py-4 px-4">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                      <CreditCard size={14} className="text-primary" />
                                    </div>
                                    <span>{debt.creditor}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">${debt.balance.toLocaleString()}</td>
                                <td className="py-4 px-4">{debt.interestRate}%</td>
                                <td className="py-4 px-4">${debt.minimumPayment.toLocaleString()}</td>
                                <td className="py-4 px-4">{new Date(debt.dueDate).toLocaleDateString()}</td>
                                <td className="py-4 px-4">
                                  <div className="flex justify-end gap-2">
                                    <button className="p-1 rounded-md hover:bg-secondary text-muted-foreground">
                                      <Edit size={16} />
                                    </button>
                                    <button 
                                      className="p-1 rounded-md hover:bg-secondary text-muted-foreground"
                                      onClick={() => handleDeleteDebt(debt.id)}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
            
            {activeTab === 'payment-plan' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-lg font-medium mb-4">Payment Schedule</h3>
                
                {debts.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 mb-4">
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
                      </div>
                    </div>
                    
                    <div className="glass-dark p-4 rounded-xl mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Total Monthly Payment</p>
                          <h4 className="text-xl font-medium">${(totalMinimumPayment + extraPayment).toLocaleString()}</h4>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Interest Saved</p>
                          <h4 className="text-xl font-medium text-accent">${(paymentPlan.totalInterestPaid * 0.3).toLocaleString()}</h4>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Debt-Free Timeline</p>
                          <h4 className="text-xl font-medium">{paymentPlan.monthsToDebtFree} months</h4>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass rounded-xl overflow-hidden">
                      <PaymentSchedule paymentSchedule={paymentPlan.paymentSchedule} startDate={new Date()} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Calendar size={28} className="text-primary" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">Payment Plan Builder</h4>
                    <p className="text-sm text-muted-foreground max-w-md mb-6">
                      Create a custom payment plan by selecting your repayment strategy and entering your monthly budget.
                    </p>
                    <Button onClick={handleCreatePaymentPlan}>Create Payment Plan</Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
