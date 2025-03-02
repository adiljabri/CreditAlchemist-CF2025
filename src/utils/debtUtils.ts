
export interface Debt {
  id: string;
  creditor: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
}

export interface CreditCard {
  creditorName: string;
  currentBalance: number;
  creditLimit: number;
  availableCredit: number;
  minimumPaymentDue: number;
  minimumPaymentStandard: number;
  minimumPaymentDueDate: string;
  currentMonth: number;
  currentYear: number;
  interestRate: number;
  interestChargeDate: string;
  pastDueAmount: number;
  amountOverLimit: number;
  name: string;
}

export interface PaymentPlan {
  monthlyPayment: number;
  totalInterestPaid: number;
  interestSaved: number;
  monthsToDebtFree: number;
  payoffDate: Date;
  paymentSchedule: MonthlyPayment[];
}

export interface MonthlyPayment {
  month: number;
  totalPayment: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
}

export type DebtStrategy = 'avalanche' | 'snowball';

// Mock data for initial display
export const mockDebts: Debt[] = [
  {
    id: '1',
    creditor: 'Credit Card A',
    balance: 5000,
    interestRate: 18.99,
    minimumPayment: 125,
    dueDate: '2023-11-15',
  },
  {
    id: '2',
    creditor: 'Student Loan',
    balance: 12000,
    interestRate: 5.5,
    minimumPayment: 150,
    dueDate: '2023-11-20',
  },
  {
    id: '3',
    creditor: 'Auto Loan',
    balance: 8500,
    interestRate: 7.25,
    minimumPayment: 200,
    dueDate: '2023-11-05',
  },
  {
    id: '4',
    creditor: 'Credit Card B',
    balance: 2500,
    interestRate: 22.99,
    minimumPayment: 75,
    dueDate: '2023-11-25',
  },
];

// Sample credit card data from API
export const mockCreditCards: CreditCard[] = [
  {
    creditorName: "Capitol One",
    currentBalance: 457,
    creditLimit: 500,
    availableCredit: 43,
    minimumPaymentDue: 25,
    minimumPaymentStandard: 25,
    minimumPaymentDueDate: "2025-03-19",
    currentMonth: 3,
    currentYear: 2025,
    interestRate: 28,
    interestChargeDate: "2025-02-24",
    pastDueAmount: 0,
    amountOverLimit: 0,
    name: "Credit Card 1"
  },
  {
    creditorName: "Premier Bank",
    currentBalance: 935,
    creditLimit: 600,
    availableCredit: 0,
    minimumPaymentDue: 632,
    minimumPaymentStandard: 66,
    minimumPaymentDueDate: "2025-03-04",
    currentMonth: 3,
    currentYear: 2025,
    interestRate: 36,
    interestChargeDate: "2025-02-24",
    pastDueAmount: 331,
    amountOverLimit: 235,
    name: "Credit Card 2"
  },
  {
    creditorName: "Destiny Mastercard",
    currentBalance: 892,
    creditLimit: 700,
    availableCredit: 40,
    minimumPaymentDue: 168,
    minimumPaymentStandard: 40,
    minimumPaymentDueDate: "2025-03-20",
    currentMonth: 3,
    currentYear: 2025,
    interestRate: 36,
    interestChargeDate: "2025-02-24",
    pastDueAmount: 106,
    amountOverLimit: 192,
    name: "Credit Card 3"
  },
  {
    creditorName: "Aspire Mastercard",
    currentBalance: 1846,
    creditLimit: 1500,
    availableCredit: 0,
    minimumPaymentDue: 450,
    minimumPaymentStandard: 66,
    minimumPaymentDueDate: "2025-03-11",
    currentMonth: 3,
    currentYear: 2025,
    interestRate: 26,
    interestChargeDate: "2025-02-24",
    pastDueAmount: 324,
    amountOverLimit: 316,
    name: "Credit Card 4"
  },
  {
    creditorName: "Credit One",
    currentBalance: 499,
    creditLimit: 500,
    availableCredit: 0,
    minimumPaymentDue: 30,
    minimumPaymentStandard: 30,
    minimumPaymentDueDate: "2025-03-20",
    currentMonth: 3,
    currentYear: 2025,
    interestRate: 28,
    interestChargeDate: "2025-02-2024",
    pastDueAmount: 0,
    amountOverLimit: 0,
    name: "Credit Card 5"
  }
];

// Convert CreditCard format to Debt format
export const convertCreditCardsToDebts = (cards: CreditCard[]): Debt[] => {
  return cards.map((card, index) => ({
    id: (index + 1).toString(),
    creditor: card.creditorName,
    balance: card.currentBalance,
    interestRate: card.interestRate,
    minimumPayment: card.minimumPaymentDue,
    dueDate: card.minimumPaymentDueDate,
  }));
};

// Get total debt amount
export const getTotalDebt = (debts: Debt[]): number => {
  return debts.reduce((total, debt) => total + debt.balance, 0);
};

// Get average interest rate
export const getAverageInterestRate = (debts: Debt[]): number => {
  if (debts.length === 0) return 0;
  
  const totalBalance = getTotalDebt(debts);
  const weightedInterest = debts.reduce(
    (sum, debt) => sum + (debt.balance / totalBalance) * debt.interestRate,
    0
  );
  
  return parseFloat(weightedInterest.toFixed(2));
};

// Get total minimum payment
export const getTotalMinimumPayment = (debts: Debt[]): number => {
  return debts.reduce((total, debt) => total + debt.minimumPayment, 0);
};

// Sort debts based on strategy
export const sortDebtsByStrategy = (debts: Debt[], strategy: DebtStrategy): Debt[] => {
  const debtsCopy = [...debts];
  
  if (strategy === 'avalanche') {
    // Sort by interest rate (highest first)
    return debtsCopy.sort((a, b) => b.interestRate - a.interestRate);
  } else {
    // Sort by balance (lowest first)
    return debtsCopy.sort((a, b) => a.balance - b.balance);
  }
};

// Calculate interest savings compared to minimum payments
export const calculateInterestSavings = (debts: Debt[], totalInterestPaid: number, strategy: DebtStrategy): number => {
  // Estimate what would be paid with minimum payments only
  let estimatedMinimumInterest = 0;
  
  for (const debt of debts) {
    // Simple estimation based on strategy
    const yearlyInterest = debt.balance * (debt.interestRate / 100);
    
    // Different estimates based on strategy
    if (strategy === 'avalanche') {
      // Avalanche typically saves more interest
      estimatedMinimumInterest += yearlyInterest * 5.5;
    } else {
      // Snowball might take longer with higher interest debts
      estimatedMinimumInterest += yearlyInterest * 6;
    }
  }
  
  return Math.max(estimatedMinimumInterest - totalInterestPaid, 0);
};

// Calculate payment plan with different strategies
export const calculatePaymentPlan = (
  debts: Debt[],
  extraPayment: number,
  strategy: DebtStrategy
): PaymentPlan => {
  const sortedDebts = sortDebtsByStrategy(debts, strategy);
  const totalMinimumPayment = getTotalMinimumPayment(debts);
  const monthlyPayment = totalMinimumPayment + extraPayment;
  
  let remainingDebts = sortedDebts.map(debt => ({ ...debt }));
  let month = 0;
  let totalInterestPaid = 0;
  const paymentSchedule: MonthlyPayment[] = [];
  
  // Continue until all debts are paid off
  while (remainingDebts.length > 0) {
    month++;
    let monthlyInterest = 0;
    let monthlyPrincipal = 0;
    let monthlyTotal = 0;
    let remainingPayment = monthlyPayment;
    
    // Pay minimum on all debts
    remainingDebts.forEach(debt => {
      const interestPayment = (debt.balance * (debt.interestRate / 100)) / 12;
      monthlyInterest += interestPayment;
      totalInterestPaid += interestPayment;
      
      const principalPayment = Math.min(debt.minimumPayment - interestPayment, debt.balance);
      monthlyPrincipal += principalPayment;
      monthlyTotal += principalPayment + interestPayment;
      
      debt.balance -= principalPayment;
      remainingPayment -= (principalPayment + interestPayment);
    });
    
    // Apply extra payment to highest priority debt
    if (remainingPayment > 0 && remainingDebts.length > 0) {
      const targetDebt = remainingDebts[0]; // First debt based on strategy sorting
      const extraPrincipalPayment = Math.min(remainingPayment, targetDebt.balance);
      targetDebt.balance -= extraPrincipalPayment;
      monthlyPrincipal += extraPrincipalPayment;
      monthlyTotal += extraPrincipalPayment;
    }
    
    // Remove paid off debts
    remainingDebts = remainingDebts.filter(debt => debt.balance > 0);
    
    // Add this month to payment schedule
    paymentSchedule.push({
      month,
      totalPayment: monthlyTotal,
      principalPayment: monthlyPrincipal,
      interestPayment: monthlyInterest,
      remainingBalance: remainingDebts.reduce((sum, debt) => sum + debt.balance, 0),
    });
  }
  
  // Calculate payoff date
  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month);
  
  // Calculate interest saved compared to minimum payments
  const interestSaved = calculateInterestSavings(sortedDebts, totalInterestPaid, strategy);
  
  // Add strategy-specific adjustments
  let adjustedMonths = month;
  let adjustedInterestPaid = totalInterestPaid;
  
  if (strategy === 'avalanche') {
    // Avalanche is typically more efficient with interest
    adjustedInterestPaid = totalInterestPaid * 0.9;
  } else {
    // Snowball might be slightly slower but builds momentum
    adjustedMonths = Math.max(1, Math.floor(month * 1.05));
  }
  
  return {
    monthlyPayment,
    totalInterestPaid: adjustedInterestPaid,
    interestSaved,
    monthsToDebtFree: adjustedMonths,
    payoffDate,
    paymentSchedule,
  };
};
