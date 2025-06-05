
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const customerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  idNumber: z.string().optional(),
  paymentTermDays: z.coerce.number().int().min(0).optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormValues) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      idNumber: '',
      paymentTermDays: 30,
    },
  });

  const handleSubmit = (data: CustomerFormValues) => {
    onSubmit(data);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#0A2645] text-xl font-bold">Add New Customer</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#0A2645] font-semibold">Customer Name</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-white border-2 border-gray-300 focus:border-[#FAA225] text-[#0A2645]" 
                      {...field} 
                      placeholder="Enter customer name" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#0A2645] font-semibold">Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-white border-2 border-gray-300 focus:border-[#FAA225] text-[#0A2645]"
                      {...field} 
                      placeholder="Enter phone number" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#0A2645] font-semibold">ID/Passport Number (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-white border-2 border-gray-300 focus:border-[#FAA225] text-[#0A2645]"
                      {...field} 
                      placeholder="Enter ID or passport number" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentTermDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#0A2645] font-semibold">Payment Terms (Days)</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-white border-2 border-gray-300 focus:border-[#FAA225] text-[#0A2645]"
                      type="number" 
                      min="0" 
                      placeholder="30"
                      {...field}
                      value={field.value === undefined ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="border-2 border-gray-300 text-[#0A2645] hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 font-bold border-2 border-[#FAA225]"
              >
                Add Customer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerForm;
