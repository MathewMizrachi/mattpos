
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  onEndShiftReport?: () => void;
  expectedAmount: number;
}

const EndShiftForm: React.FC<EndShiftFormProps> = ({ 
  onSubmit, 
  onCancel,
  onEndShiftReport,
  expectedAmount 
}) => {
  const form = useForm<EndShiftFormValues>({
    resolver: zodResolver(endShiftSchema),
    defaultValues: { cashAmount: expectedAmount },
  });
  const navigate = useNavigate();

  const handleSubmit = (data: EndShiftFormValues) => {
    onSubmit(data.cashAmount);
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0A2645] text-white p-6 rounded-lg">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBackClick} 
          className="mr-2 text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center flex-1 pr-9">
          <h2 className="text-2xl font-bold">End Shift</h2>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4">
        Please count and enter the actual amount of cash in the drawer.
      </p>
      <p className="text-gray-300 mb-6">
        Expected amount: R{expectedAmount.toFixed(2)}
      </p>
      
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
            <Button 
              type="submit" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Complete Shift
            </Button>
            {onEndShiftReport && (
              <Button 
                type="button" 
                variant="outline" 
                className="bg-white text-[#0A2645] hover:bg-white/80 flex items-center gap-2" 
                onClick={onEndShiftReport}
              >
                <FileText className="h-4 w-4" />
                Shift Report
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EndShiftForm;
