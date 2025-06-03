
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';

const floatSchema = z.object({
  cash: z.coerce.number().nonnegative({ message: 'Cash amount must be 0 or greater' }),
  coins: z.coerce.number().nonnegative({ message: 'Coins amount must be 0 or greater' }),
});

type FloatFormValues = z.infer<typeof floatSchema>;

interface FloatFormProps {
  onSubmit: (amount: number) => void;
  onCancel: () => void;
}

const FloatForm: React.FC<FloatFormProps> = ({ onSubmit, onCancel }) => {
  const { getLastShiftEndFloat } = useApp();
  const [previousFloat, setPreviousFloat] = useState<number | null>(null);
  
  useEffect(() => {
    const lastFloat = getLastShiftEndFloat();
    setPreviousFloat(lastFloat);
  }, [getLastShiftEndFloat]);

  const form = useForm<FloatFormValues>({
    resolver: zodResolver(floatSchema),
    defaultValues: { 
      cash: 0,
      coins: 0
    },
  });

  const watchedValues = form.watch();
  const totalAmount = watchedValues.cash + watchedValues.coins;

  const handleSubmit = (data: FloatFormValues) => {
    const totalFloat = data.cash + data.coins;
    onSubmit(totalFloat);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0A2645] text-white p-6 rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Enter Starting Float</h2>
        <p className="text-gray-300 mt-1">
          Please enter the amount of cash and coins in the drawer at the start of this shift.
        </p>
        {previousFloat !== null && (
          <p className="text-gray-300 mt-2">
            Previous shift ended with R{previousFloat.toFixed(2)} in the drawer.
          </p>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="cash"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Cash Notes (R)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0.00"
                    className="bg-white text-black"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coins"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Coins (R)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    placeholder="0.00"
                    className="bg-white text-black"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-white/10 p-3 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-300">Total Float Amount</p>
              <p className="text-xl font-bold text-white">R{totalAmount.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" className="text-white border-white hover:bg-white/20" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Start Shift
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FloatForm;
