
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { ArrowRight, BarChart3, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Take control of your{' '}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                financial future
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Credit Alchemist helps you visualize your debt, create a personalized repayment 
              plan, and find the fastest route to financial freedom.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/dashboard">
                <Button size="lg" icon={<BarChart3 size={18} />}>
                  View Dashboard
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="secondary" size="lg" icon={<MessageCircle size={18} />}>
                  Debt Advisor Chat
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="relative w-full max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="glass overflow-hidden rounded-2xl shadow-medium">
                <img 
                  src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Financial dashboard visualization" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Smart features for your financial journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our tools are designed to simplify debt management and accelerate your path to financial freedom.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 size={24} className="text-primary" />,
                title: 'Visual Debt Dashboard',
                description: 'See your complete financial picture with intuitive charts and visualizations.',
              },
              {
                icon: <Sparkles size={24} className="text-primary" />,
                title: 'Smart Repayment Strategies',
                description: 'Compare Avalanche and Snowball methods to find your optimal payoff path.',
              },
              {
                icon: <MessageCircle size={24} className="text-primary" />,
                title: 'Debt Advisor Chat',
                description: 'Get personalized advice and answers to your financial questions.',
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="glass p-6 rounded-2xl card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <a 
                  href="#" 
                  className="inline-flex items-center text-primary text-sm font-medium hover:underline"
                >
                  Learn more <ArrowRight size={14} className="ml-1" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-medium mb-4">
                  Start your journey to financial freedom today
                </h2>
                <p className="text-lg text-muted-foreground">
                  Set up your debt dashboard in minutes and discover your fastest path to becoming debt-free.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link to="/dashboard">
                  <Button size="lg" icon={<ArrowRight size={18} />}>
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">
                Credit Alchemist
              </div>
              <p className="text-sm text-muted-foreground">
                Your journey to financial freedom starts here.
              </p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">About</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Credit Alchemist. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
