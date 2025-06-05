
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

const denominationSchema = z.object({
  coins_1r: z.coerce.number().nonnegative().default(0),
  coins_2r: z.coerce.number().nonnegative().default(0),
  coins_5r: z.coerce.number().nonnegative().default(0),
  notes_10r: z.coerce.number().nonnegative().default(0),
  notes_20r: z.coerce.number().nonnegative().default(0),
  notes_50r: z.coerce.number().nonnegative().default(0),
  notes_100r: z.coerce.number().nonnegative().default(0),
  notes_200r: z.coerce.number().nonnegative().default(0),
});

const totalFloatSchema = z.object({
  totalAmount: z.coerce.number().nonnegative({ message: 'Total amount must be 0 or greater' }),
});

type DenominationFormValues = z.infer<typeof denominationSchema>;
type TotalFloatFormValues = z.infer<typeof totalFloatSchema>;

interface FloatFormProps {
  onSubmit: (amount: number) => void;
  onCancel: () => void;
}

const FloatForm: React.FC<FloatFormProps> = ({ onSubmit, onCancel }) => {
  const { getLastShiftEndFloat } = useApp();
  const [previousFloat, setPreviousFloat] = useState<number | null>(null);
  const [inputMode, setInputMode] = useState<'denominations' | 'total'>('denominations');
  
  useEffect(() => {
    console.log('FloatForm: Component mounted');
    try {
      const lastFloat = getLastShiftEndFloat();
      console.log('FloatForm: Last float retrieved:', lastFloat);
      setPreviousFloat(lastFloat);
    } catch (error) {
      console.error('FloatForm: Error getting last float:', error);
      setPreviousFloat(null);
    }
  }, [getLastShiftEndFloat]);

  const denominationForm = useForm<DenominationFormValues>({
    resolver: zodResolver(denominationSchema),
    defaultValues: {
      coins_1r: 0, coins_2r: 0, coins_5r: 0,
      notes_10r: 0, notes_20r: 0, notes_50r: 0, notes_100r: 0, notes_200r: 0,
    },
  });

  const totalFloatForm = useForm<TotalFloatFormValues>({
    resolver: zodResolver(totalFloatSchema),
    defaultValues: { totalAmount: 0 },
  });

  const denominationValues = denominationForm.watch();
  const totalFloatValue = totalFloatForm.watch('totalAmount');

  // Calculate total from denominations
  const calculatedTotal = (
    (denominationValues.coins_1r || 0) * 1.00 +
    (denominationValues.coins_2r || 0) * 2.00 +
    (denominationValues.coins_5r || 0) * 5.00 +
    (denominationValues.notes_10r || 0) * 10.00 +
    (denominationValues.notes_20r || 0) * 20.00 +
    (denominationValues.notes_50r || 0) * 50.00 +
    (denominationValues.notes_100r || 0) * 100.00 +
    (denominationValues.notes_200r || 0) * 200.00
  );

  const finalAmount = inputMode === 'denominations' ? calculatedTotal : (totalFloatValue || 0);

  const handleSubmit = () => {
    console.log('FloatForm: Form submitted with final amount:', finalAmount);
    try {
      onSubmit(finalAmount);
    } catch (error) {
      console.error('FloatForm: Error in handleSubmit:', error);
    }
  };

  // Update denominations to exclude cents
  const denominations = [
    { key: 'coins_1r', label: 'R1 Coins', value: 1.00 },
    { key: 'coins_2r', label: 'R2 Coins', value: 2.00 },
    { key: 'coins_5r', label: 'R5 Coins', value: 5.00 },
    { key: 'notes_10r', label: 'R10 Notes', value: 10.00 },
    { key: 'notes_20r', label: 'R20 Notes', value: 20.00 },
    { key: 'notes_50r', label: 'R50 Notes', value: 50.00 },
    { key: 'notes_100r', label: 'R100 Notes', value: 100.00 },
    { key: 'notes_200r', label: 'R200 Notes', value: 200.00 },
  ];

  console.log('FloatForm: Rendering component');

  return (
    <div className="w-full max-w-md mx-auto bg-[#0A2645] text-white p-6 rounded-lg max-h-[80vh] overflow-y-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Enter Starting Float</h2>
        <p className="text-gray-300 mt-1">
          Please enter the amount of cash in the drawer at the start of this shift.
        </p>
        {previousFloat !== null && (
          <p className="text-gray-300 mt-2">
            Previous shift ended with R{previousFloat.toFixed(2)} in the drawer.
          </p>
        )}
      </div>

      <div className="mb-6">
        <RadioGroup
          value={inputMode}
          onValueChange={(value: 'denominations' | 'total') => setInputMode(value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="denominations" id="denominations" />
            <label htmlFor="denominations" className="text-white cursor-pointer">
              Count Denominations
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="total" id="total" />
            <label htmlFor="total" className="text-white cursor-pointer">
              Total Amount
            </label>
          </div>
        </RadioGroup>
      </div>

      {inputMode === 'denominations' ? (
        <Form {...denominationForm}>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {denominations.map((denom) => (
                <FormField
                  key={denom.key}
                  control={denominationForm.control}
                  name={denom.key as keyof DenominationFormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs">{denom.label}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="0"
                          className="bg-white text-black h-8 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </form>
        </Form>
      ) : (
        <Form {...totalFloatForm}>
          <form className="space-y-6">
            <FormField
              control={totalFloatForm.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Total Float Amount (R)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="1" 
                      min="0" 
                      placeholder="0"
                      className="bg-white text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}

      <div className="bg-white/10 p-3 rounded-lg mt-6">
        <div className="text-center">
          <p className="text-sm text-gray-300">Total Float Amount</p>
          <p className="text-xl font-bold text-white">R{finalAmount.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 mt-6">
        <Button 
          type="button" 
          variant="outline" 
          className="text-white border-white hover:bg-white/20" 
          onClick={() => {
            console.log('FloatForm: Cancel button clicked');
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={handleSubmit}
        >
          Open Till
        </Button>
      </div>
    </div>
  );
};

export default FloatForm;
