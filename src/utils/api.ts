
import { CreditCard, convertCreditCardsToDebts, Debt, mockCreditCards } from './debtUtils';
import { v4 as uuidv4 } from 'uuid';

// Mock API implementation using localStorage

// Helper function to format date (kept for compatibility)
const formatDate = (date: string | Date) => {
  return new Date(date).toISOString();
};

// Fetch credit card data from localStorage or use mock data
export const fetchCreditCards = async (): Promise<CreditCard[]> => {
  try {
    // Try to get from localStorage first
    const storedCards = localStorage.getItem('creditCards');
    if (storedCards) {
      return JSON.parse(storedCards);
    }
    
    // If not in localStorage, use mock data and store it
    localStorage.setItem('creditCards', JSON.stringify(mockCreditCards));
    return mockCreditCards;
  } catch (error) {
    console.error('Error fetching credit cards:', error);
    return mockCreditCards;
  }
};

// Fetch credit card data and convert to Debt format
export const fetchCreditCardsAsDebts = async (): Promise<Debt[]> => {
  try {
    const creditCards = await fetchCreditCards();
    return convertCreditCardsToDebts(creditCards);
  } catch (error) {
    console.error('Error fetching credit cards as debts:', error);
    return [];
  }
};

// Get all chat sessions from localStorage
export const getAllChatSessions = async () => {
  try {
    const sessions = localStorage.getItem('chatSessions');
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    return [];
  }
};

// Create a chat session in localStorage
export const createChatSession = async (): Promise<string> => {
  try {
    const chatId = uuidv4();
    const newSession = {
      id: chatId,
      name: 'New Chat',
      created_at: new Date().toISOString()
    };
    
    // Get existing sessions
    const existingSessions = await getAllChatSessions();
    const updatedSessions = [...existingSessions, newSession];
    
    // Save to localStorage
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    
    return chatId;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

// Get chat history for a specific session from localStorage
export const getChatHistory = async (chatId: string) => {
  try {
    const key = `chatMessages_${chatId}`;
    const messages = localStorage.getItem(key);
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

// Send a message in a chat session to localStorage
export const sendChatMessage = async (chatId: string, message: string) => {
  try {
    const key = `chatMessages_${chatId}`;
    const existingMessages = await getChatHistory(chatId);
    
    const newMessage = {
      id: uuidv4(),
      session_id: chatId,
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...existingMessages, newMessage];
    localStorage.setItem(key, JSON.stringify(updatedMessages));
    
    return newMessage;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

// Delete a chat session from localStorage
export const deleteChatSession = async (chatId: string) => {
  try {
    // Remove chat messages
    localStorage.removeItem(`chatMessages_${chatId}`);
    
    // Remove from sessions list
    const existingSessions = await getAllChatSessions();
    const updatedSessions = existingSessions.filter(session => session.id !== chatId);
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting chat session:', error);
    throw error;
  }
};

// No default export needed
