
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

const endShiftSchema = z.object({
  cashAmount: z.coerce.number().nonnegative({ message: 'Cash amount must be 0 or greater' }),
});

type EndShiftFormValues = z.infer<typeof endShiftSchema>;

interface EndShiftFormProps {
  onSubmit: (cashAmount: number) => void;
  onCancel: () => void;
  expectedAmount: number;
}

const EndShiftForm: React.FC<EndShiftFormProps> = ({ 
  onSubmit, 
  onCancel,
  expectedAmount 
}) => {
  const form = useForm<EndShiftFormValues>({
    resolver: zodResolver(endShiftSchema),
    defaultValues: { cashAmount: expectedAmount },
  });

  const handleSubmit = (data: EndShiftFormValues) => {
    onSubmit(data.cashAmount);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0A2645] text-white p-6 rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">End Shift</h2>
        <p className="text-gray-300 mt-1">
          Please count and enter the actual amount of cash in the drawer.
        </p>
        <p className="text-gray-300 mt-2">
          Expected amount: R{expectedAmount.toFixed(2)}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="cashAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Actual Cash Amount (R)</FormLabel>
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
              Complete Shift
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EndShiftForm;
