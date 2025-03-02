// Mock database pool implementation using localStorage
const pool = {
  query: async (text: string, params?: any[]) => {
    console.log('Mock database query:', text, params);
    
    // Return empty results for any query
    return {
      rows: [],
      rowCount: 0
    };
  },
  connect: (callback: (err: Error | null, client: any, done: () => void) => void) => {
    // Mock successful connection
    console.log('Mock database connection successful');
    callback(null, {}, () => {});
  }
};

console.log('Using mock database implementation with localStorage');

export { pool };