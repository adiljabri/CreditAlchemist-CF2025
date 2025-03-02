import React from 'react';
import { MonthlyPayment } from '@/utils/debtUtils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, TrendingDown } from 'lucide-react';

interface PaymentScheduleProps {
  paymentSchedule: MonthlyPayment[];
  startDate: Date;
}

const PaymentSchedule: React.FC<PaymentScheduleProps> = ({ paymentSchedule, startDate }) => {
  if (!paymentSchedule || paymentSchedule.length === 0) {
    return (
      <div className="p-4 md:p-6 text-center">
        <p className="text-muted-foreground">No payment schedule available. Please calculate a payment plan first.</p>
      </div>
    );
  }

  // Calculate financial insights
  const totalInterestPaid = paymentSchedule.reduce((sum, payment) => sum + payment.interestPayment, 0);
  const totalPrincipalPaid = paymentSchedule.reduce((sum, payment) => sum + payment.principalPayment, 0);
  const totalPaid = totalInterestPaid + totalPrincipalPaid;
  
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4">
        <div className="glass-dark p-3 md:p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <DollarSign size={16} className="text-primary md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Payments</p>
              <h4 className="text-base md:text-lg font-medium">${totalPaid.toFixed(2)}</h4>
            </div>
          </div>
        </div>
        
        <div className="glass-dark p-3 md:p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <TrendingDown size={16} className="text-accent md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Interest</p>
              <h4 className="text-base md:text-lg font-medium">${totalInterestPaid.toFixed(2)}</h4>
            </div>
          </div>
        </div>
        
        <div className="glass-dark p-3 md:p-4 rounded-xl sm:col-span-2 md:col-span-1">
          <div className="flex items-center space-x-3">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Calendar size={16} className="text-primary md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time to Debt-Free</p>
              <h4 className="text-base md:text-lg font-medium">{paymentSchedule.length} months</h4>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Schedule Table */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[640px] px-4 md:px-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium text-muted-foreground">Month</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium text-muted-foreground">Date</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium text-muted-foreground">Total Payment</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium text-muted-foreground">Principal</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium text-muted-foreground">Interest</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium text-muted-foreground">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {paymentSchedule.map((payment, index) => {
                const paymentDate = new Date(startDate);
                paymentDate.setMonth(paymentDate.getMonth() + payment.month - 1);
                
                return (
                  <motion.tr 
                    key={payment.month}
                    className={cn(
                      "border-b border-border hover:bg-muted/20 transition-colors",
                      payment.remainingBalance === 0 ? "bg-accent/5" : ""
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                  >
                    <td className="py-2 md:py-3 px-2 md:px-4 text-sm">{payment.month}</td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-sm">{format(paymentDate, 'MMM yyyy')}</td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-sm font-medium">${payment.totalPayment.toFixed(2)}</td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-sm">${payment.principalPayment.toFixed(2)}</td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-sm">${payment.interestPayment.toFixed(2)}</td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-sm">
                      <span className={payment.remainingBalance === 0 ? "text-accent font-medium" : ""}>
                        ${payment.remainingBalance.toFixed(2)}
                      </span>
                      {payment.remainingBalance === 0 && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-accent/20 text-accent">
                          Debt Free!
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Import cn helper
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default PaymentSchedule;