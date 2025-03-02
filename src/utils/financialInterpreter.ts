import { Debt } from './debtUtils';

// Financial Term Dictionary
interface FinancialTerm {
  term: string;
  synonyms: string[];
  category: 'debt' | 'interest' | 'payment' | 'strategy';
  description: string;
}

const financialDictionary: FinancialTerm[] = [
  {
    term: 'interest rate',
    synonyms: ['APR', 'annual percentage rate', 'rate'],
    category: 'interest',
    description: 'The annual cost of borrowing money, expressed as a percentage'
  },
  {
    term: 'minimum payment',
    synonyms: ['min payment', 'monthly minimum', 'minimum due'],
    category: 'payment',
    description: 'The smallest amount you must pay each month on your debt'
  },
  {
    term: 'avalanche method',
    synonyms: ['debt avalanche', 'highest interest first'],
    category: 'strategy',
    description: 'A debt repayment strategy that prioritizes paying off debts with the highest interest rates first'
  },
  {
    term: 'snowball method',
    synonyms: ['debt snowball', 'smallest balance first'],
    category: 'strategy',
    description: 'A debt repayment strategy that prioritizes paying off the smallest debts first'
  }
];

// Context Types
type FinancialContext = {
  intent: 'calculation' | 'explanation' | 'strategy' | 'comparison';
  topic: string;
  relevantTerms: string[];
  numericalValues?: { [key: string]: number };
};

// Financial Calculations Interface
interface FinancialCalculation {
  name: string;
  description: string;
  requiredParams: string[];
  calculate: (params: { [key: string]: number }) => number;
}

// Define common financial calculations
const financialCalculations: { [key: string]: FinancialCalculation } = {
  totalInterestPaid: {
    name: 'Total Interest Paid',
    description: 'Calculates the total interest paid over the life of a debt',
    requiredParams: ['principal', 'interestRate', 'months'],
    calculate: ({ principal, interestRate, months }) => {
      const monthlyRate = interestRate / 12 / 100;
      const totalPaid = principal * Math.pow(1 + monthlyRate, months);
      return totalPaid - principal;
    }
  },
  monthlyPayment: {
    name: 'Monthly Payment',
    description: 'Calculates the monthly payment required to pay off a debt',
    requiredParams: ['principal', 'interestRate', 'months'],
    calculate: ({ principal, interestRate, months }) => {
      const monthlyRate = interestRate / 12 / 100;
      return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
             (Math.pow(1 + monthlyRate, months) - 1);
    }
  },
  payoffTime: {
    name: 'Payoff Time',
    description: 'Calculates the number of months needed to pay off a debt',
    requiredParams: ['principal', 'interestRate', 'monthlyPayment'],
    calculate: ({ principal, interestRate, monthlyPayment }) => {
      const monthlyRate = interestRate / 12 / 100;
      return Math.ceil(
        Math.log(monthlyPayment / (monthlyPayment - principal * monthlyRate)) /
        Math.log(1 + monthlyRate)
      );
    }
  }
};

// Context Analysis Functions
export const analyzeQuery = (query: string): FinancialContext => {
  const context: FinancialContext = {
    intent: 'explanation',
    topic: '',
    relevantTerms: []
  };

  // Detect calculation intent
  if (query.match(/calculate|compute|find|what is|how much|how long/i)) {
    context.intent = 'calculation';
  }
  // Detect strategy intent
  else if (query.match(/strategy|method|approach|better|which|compare/i)) {
    context.intent = 'strategy';
  }
  // Detect comparison intent
  else if (query.match(/compare|difference|versus|vs|better/i)) {
    context.intent = 'comparison';
  }

  // Find relevant financial terms
  context.relevantTerms = financialDictionary
    .filter(term => {
      const termPattern = new RegExp(`\\b(${[term.term, ...term.synonyms].join('|')})\\b`, 'i');
      return query.match(termPattern);
    })
    .map(term => term.term);

  // Extract numerical values
  const numbers = query.match(/\d+(\.\d+)?/g);
  if (numbers) {
    context.numericalValues = {
      amount: parseFloat(numbers[0])
    };
  }

  return context;
};

// Generate insights based on context
export const generateInsights = (context: FinancialContext, debts: Debt[]) => {
  const insights: string[] = [];

  switch (context.intent) {
    case 'calculation':
      if (context.relevantTerms.includes('interest rate')) {
        const totalInterest = debts.reduce((acc, debt) => {
          return acc + (debt.balance * (debt.interestRate / 100));
        }, 0);
        insights.push(`Based on your current debts, you're paying approximately $${totalInterest.toFixed(2)} in interest annually.`);
      }
      break;

    case 'strategy':
      if (context.relevantTerms.includes('avalanche method')) {
        const highestInterestDebt = [...debts].sort((a, b) => b.interestRate - a.interestRate)[0];
        insights.push(
          `Using the Avalanche method, you should focus on paying off your ${highestInterestDebt.creditor} debt first ` +
          `since it has the highest interest rate at ${highestInterestDebt.interestRate}%.`
        );
      }
      break;

    case 'comparison':
      if (context.relevantTerms.includes('avalanche method') && context.relevantTerms.includes('snowball method')) {
        insights.push(
          'The Avalanche method will save you more money in interest over time, while the Snowball method ' +
          'can provide more psychological wins by paying off smaller debts first.'
        );
      }
      break;
  }

  return insights;
};

// Process financial query
export const processFinancialQuery = (query: string, debts: Debt[]): string => {
  const context = analyzeQuery(query);
  const insights = generateInsights(context, debts);

  if (insights.length > 0) {
    return insights.join('\n');
  }

  // Fallback response
  return 'I understand you\'re asking about ' + context.relevantTerms.join(', ') + 
         '. Could you please provide more specific information about what you\'d like to know?';
};