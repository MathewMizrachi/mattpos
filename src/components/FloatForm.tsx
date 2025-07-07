import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Calculator, DollarSign } from 'lucide-react';

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

  // Ensure finalAmount is always a valid number
  const finalAmount = inputMode === 'denominations' 
    ? calculatedTotal 
    : (typeof totalFloatValue === 'number' && !isNaN(totalFloatValue) ? totalFloatValue : 0);

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
    <div className="min-h-screen bg-[#0A2645] p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-[#0A2645] border-2 border-[#FAA225] shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-[#FAA225] p-3 rounded-full">
              <Calculator className="h-8 w-8 text-[#0A2645]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Starting Float</CardTitle>
          <p className="text-gray-300 mt-2">
            Enter the amount of cash in the drawer at the start of this shift
          </p>
          {previousFloat !== null && (
            <div className="bg-[#FAA225] border border-[#FAA225] rounded-lg p-3 mt-3">
              <p className="text-[#0A2645] text-sm font-medium">
                Previous shift ended with <span className="font-bold">R{previousFloat.toFixed(2)}</span> in the drawer
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Input Mode Selection */}
          <Card className="bg-[#0A2645] border-2 border-[#FAA225]">
            <CardContent className="p-4">
              <RadioGroup
                value={inputMode}
                onValueChange={(value: 'denominations' | 'total') => setInputMode(value)}
                className="flex justify-center space-x-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="denominations" id="denominations" className="border-white text-[#FAA225]" />
                  <label htmlFor="denominations" className="text-white font-medium cursor-pointer flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Count Denominations
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="total" id="total" className="border-white text-[#FAA225]" />
                  <label htmlFor="total" className="text-white font-medium cursor-pointer flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Amount
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {inputMode === 'denominations' ? (
            <Card className="bg-[#0A2645] border-2 border-[#FAA225]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Count Your Cash</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...denominationForm}>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                      {denominations.map((denom) => (
                        <FormField
                          key={denom.key}
                          control={denominationForm.control}
                          name={denom.key as keyof DenominationFormValues}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium">{denom.label}</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  placeholder="0"
                                  className="text-center font-medium bg-white text-[#0A2645] border-2 border-gray-300 focus:border-[#FAA225] focus:ring-[#FAA225]"
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
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#0A2645] border-2 border-[#FAA225]">
              <CardHeader>
                <CardTitle className="text-lg text-white">Enter Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...totalFloatForm}>
                  <form className="space-y-6">
                    <FormField
                      control={totalFloatForm.control}
                      name="totalAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium">Total Float Amount (R)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="1" 
                              min="0" 
                              placeholder="0"
                              className="text-xl text-center font-bold bg-white text-[#0A2645] border-2 border-gray-300 focus:border-[#FAA225] focus:ring-[#FAA225]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Total Display */}
          <Card className="bg-[#FAA225] text-[#0A2645] border-2 border-[#FAA225]">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium opacity-80">Total Float Amount</p>
                <p className="text-3xl font-bold">R{finalAmount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-[#0A2645]" 
              onClick={() => {
                console.log('FloatForm: Cancel button clicked');
                onCancel();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 px-8"
              onClick={handleSubmit}
            >
              Open Till
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloatForm;
