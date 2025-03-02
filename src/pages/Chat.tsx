
import React from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import { motion } from 'framer-motion';

const Chat = () => {

  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      {/* Chat Page Content */}
      <section className="pt-32 pb-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1 className="text-3xl font-medium mb-2">Debt Advisor Chat</h1>
              <p className="text-muted-foreground">
                Get personalized advice and answers to your debt management questions
              </p>
            </div>
          </motion.div>
          
          <div className="w-full">
            <ChatInterface />
          </div>
        </div>w
      </section>
    </div>
  );
};

export default Chat;
