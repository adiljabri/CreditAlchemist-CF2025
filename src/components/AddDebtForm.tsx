import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Button from './Button';
import { addDebt } from '@/utils/dbService';

interface AddDebtFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddDebtForm: React.FC<AddDebtFormProps> = ({ onSuccess, onCancel }) => {
  const [creditor, setCreditor] = useState('');
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!creditor || !balance || !interestRate || !minimumPayment || !dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await addDebt({
        creditor,
        balance: parseFloat(balance),
        interestRate: parseFloat(interestRate),
        minimumPayment: parseFloat(minimumPayment),
        dueDate,
      });

      toast({
        title: "Success",
        description: "Debt added successfully",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add debt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-lg font-medium mb-4">Add New Debt</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Creditor
          </label>
          <input
            type="text"
            value={creditor}
            onChange={(e) => setCreditor(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-4 py-2 shadow-soft 
                     focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Credit Card Company, Bank, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Balance
          </label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-border bg-white px-4 py-2 shadow-soft 
                     focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="5000.00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Interest Rate (%)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-border bg-white px-4 py-2 shadow-soft 
                     focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="18.99"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Minimum Payment
          </label>
          <input
            type="number"
            value={minimumPayment}
            onChange={(e) => setMinimumPayment(e.target.value)}
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-border bg-white px-4 py-2 shadow-soft 
                     focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="150.00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-4 py-2 shadow-soft 
                     focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Debt'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDebtForm;
