
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
import { User, Phone, CreditCard, Calendar, Plus, X } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[550px] bg-white shadow-2xl border-0 rounded-xl">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-[#0A2645] flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#FAA225] to-[#e8940f] rounded-lg shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </div>
            Add New Customer
          </DialogTitle>
          <p className="text-gray-600 mt-2">Enter customer details to create a new account</p>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#0A2645] font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-[#FAA225]" />
                    Customer Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-white border-2 border-gray-200 focus:border-[#FAA225] focus:ring-[#FAA225]/20 text-[#0A2645] h-12 rounded-lg transition-all duration-200 hover:border-gray-300" 
                      {...field} 
                      placeholder="Enter full customer name" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#0A2645] font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#FAA225]" />
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-white border-2 border-gray-200 focus:border-[#FAA225] focus:ring-[#FAA225]/20 text-[#0A2645] h-12 rounded-lg transition-all duration-200 hover:border-gray-300"
                      {...field} 
                      placeholder="Enter phone number (e.g., +1234567890)" 
                      type="tel"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#0A2645] font-semibold flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[#FAA225]" />
                    ID/Passport Number
                    <span className="text-sm text-gray-500 font-normal">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-white border-2 border-gray-200 focus:border-[#FAA225] focus:ring-[#FAA225]/20 text-[#0A2645] h-12 rounded-lg transition-all duration-200 hover:border-gray-300"
                      {...field} 
                      placeholder="Enter ID or passport number" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentTermDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#0A2645] font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#FAA225]" />
                    Payment Terms (Days)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-white border-2 border-gray-200 focus:border-[#FAA225] focus:ring-[#FAA225]/20 text-[#0A2645] h-12 rounded-lg transition-all duration-200 hover:border-gray-300"
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
                  <FormMessage className="text-red-600" />
                  <p className="text-sm text-gray-500 mt-1">Number of days before payment is due</p>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                size="lg"
                className="h-12 px-6 bg-white border-3 border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white font-bold transition-all duration-200 rounded-lg shadow-md hover:shadow-lg"
              >
                <X className="h-5 w-5 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="h-12 px-6 bg-gradient-to-r from-[#FAA225] to-[#e8940f] hover:from-[#e8940f] hover:to-[#FAA225] text-white font-bold border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
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
