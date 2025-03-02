import { createChatSession, sendChatMessage, getChatHistory, getAllChatSessions } from './api';
import { processFinancialQuery } from './financialInterpreter';
import { Debt } from './debtUtils';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const initializeChat = async (): Promise<string> => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const chatId = await createChatSession();
      return chatId;
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) {
        throw new Error('Failed to initialize chat session after multiple attempts');
      }
      await delay(RETRY_DELAY);
    }
  }
  throw new Error('Failed to initialize chat session');
};

export const fetchChatHistory = async (chatId: string): Promise<ChatMessage[]> => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const history = await getChatHistory(chatId);
      return history.map(msg => ({
        id: msg.id || Date.now().toString(),
        content: msg.content || msg.message,
        sender: msg.sender || (msg.is_bot ? 'ai' : 'user'),
        timestamp: new Date(msg.timestamp || Date.now())
      }));
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) {
        throw new Error('Failed to fetch chat history after multiple attempts');
      }
      await delay(RETRY_DELAY);
    }
  }
  return [];
};

export const sendMessage = async (chatId: string, message: string, debts: Debt[] = []): Promise<string> => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      // Process the message through the financial interpreter
      const interpretedResponse = processFinancialQuery(message, debts);
      
      // Send both the original message and the interpreted response
      const response = await sendChatMessage(chatId, message);
      
      // Return the interpreted response if available, otherwise fallback to the original response
      return interpretedResponse || response;
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) {
        throw new Error('Failed to send message after multiple attempts');
      }
      await delay(RETRY_DELAY);
    }
  }
  throw new Error('Failed to send message');
};

export const fetchAllChatSessions = async () => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const sessions = await getAllChatSessions();
      return sessions.map(session => ({
        id: session.chat_id || session.id,
        name: session.name || `Chat ${session.chat_id || session.id}`,
        createdAt: new Date(session.created_at || Date.now())
      }));
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) {
        throw new Error('Failed to fetch chat sessions after multiple attempts');
      }
      await delay(RETRY_DELAY);
    }
  }
  return [];
};