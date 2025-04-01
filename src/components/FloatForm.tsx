
import React from 'react';
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

const floatSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Float amount must be greater than 0' }),
});

type FloatFormValues = z.infer<typeof floatSchema>;

interface FloatFormProps {
  onSubmit: (amount: number) => void;
  onCancel: () => void;
}

const FloatForm: React.FC<FloatFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<FloatFormValues>({
    resolver: zodResolver(floatSchema),
    defaultValues: { amount: 0 },
  });

  const handleSubmit = (data: FloatFormValues) => {
    onSubmit(data.amount);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0A2645] text-white p-6 rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Enter Starting Float</h2>
        <p className="text-gray-300 mt-1">
          Please enter the amount of cash in the drawer at the start of this shift.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Cash Amount (R)</FormLabel>
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
