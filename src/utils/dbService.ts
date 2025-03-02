import { v4 as uuidv4 } from 'uuid';
import { Debt, CreditCard, mockCreditCards } from './debtUtils';

// Function to fetch credit cards from the API or use local storage
export const fetchCreditCards = async (): Promise<CreditCard[]> => {
  try {
    // Try to fetch from API first
    const response = await fetch('http://127.0.0.1:8000/cc');
    if (response.ok) {
      const cards = await response.json();
      // Save to local storage as backup
      localStorage.setItem('creditCards', JSON.stringify(cards));
      return cards;
    }
    
    // If API fails, try local storage
    const localCards = localStorage.getItem('creditCards');
    if (localCards) {
      return JSON.parse(localCards);
    }
    
    // If no local storage data, use mock data
    localStorage.setItem('creditCards', JSON.stringify(mockCreditCards));
    return mockCreditCards;
  } catch (error) {
    console.error('Error fetching credit cards:', error);
    
    // Try local storage if API fails
    const localCards = localStorage.getItem('creditCards');
    if (localCards) {
      return JSON.parse(localCards);
    }
    
    // Fall back to mock data
    localStorage.setItem('creditCards', JSON.stringify(mockCreditCards));
    return mockCreditCards;
  }
};

// Function to add a new debt
export const addDebt = async (debt: Omit<Debt, "id">): Promise<Debt> => {
  return new Promise((resolve, reject) => {
    try {
      // Generate a unique ID
      const newDebt: Debt = {
        ...debt,
        id: uuidv4(),
      };
      
      // Get existing debts from local storage
      const existingDebtsStr = localStorage.getItem('debts');
      const existingDebts: Debt[] = existingDebtsStr ? JSON.parse(existingDebtsStr) : [];
      
      // Add new debt to the array
      const updatedDebts = [...existingDebts, newDebt];
      
      // Save back to local storage
      localStorage.setItem('debts', JSON.stringify(updatedDebts));
      
      resolve(newDebt);
    } catch (error) {
      reject(error);
    }
  });
};

// Function to fetch all debts
export const fetchDebts = async (): Promise<Debt[]> => {
  return new Promise((resolve) => {
    // Get debts from local storage
    const debtsStr = localStorage.getItem('debts');
    const debts = debtsStr ? JSON.parse(debtsStr) : [];
    
    resolve(debts);
  });
};

// Function to delete a debt
export const deleteDebt = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Get existing debts from local storage
      const existingDebtsStr = localStorage.getItem('debts');
      const existingDebts: Debt[] = existingDebtsStr ? JSON.parse(existingDebtsStr) : [];
      
      // Filter out the debt to delete
      const updatedDebts = existingDebts.filter(debt => debt.id !== id);
      
      // Save back to local storage
      localStorage.setItem('debts', JSON.stringify(updatedDebts));
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
