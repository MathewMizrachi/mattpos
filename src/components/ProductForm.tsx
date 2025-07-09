
import React, { useState } from 'react';
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
import { Package, X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
  barcode?: string;
  stockCode?: string;
  linkCode?: string;
  avgCostIncl?: number;
}

const productSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be greater than 0' }),
  stock: z.coerce.number().int().nonnegative().optional(),
  barcode: z.string().optional(),
  stockCode: z.string().optional(),
  linkCode: z.string().optional(),
  avgCostIncl: z.coerce.number().nonnegative().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, isOpen, onClose, onSubmit }) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product 
      ? { 
          name: product.name, 
          price: product.price, 
          stock: product.stock,
          barcode: product.barcode || '',
          stockCode: product.stockCode || '',
          linkCode: product.linkCode || '',
          avgCostIncl: product.avgCostIncl || 0,
        } 
      : { 
          name: '', 
          price: 0, 
          stock: undefined,
          barcode: '',
          stockCode: '',
          linkCode: '',
          avgCostIncl: 0,
        },
  });

  const handleSubmit = (data: ProductFormValues) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-white via-blue-50/80 to-blue-100/60 border-2 border-[#FAA225]/30 shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-[#0A2645] via-[#0A2645]/95 to-[#0A2645]/90 text-white p-6 -m-6 mb-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {product ? 'Edit Product' : 'Add Product'}
                </DialogTitle>
                <p className="text-white/80 text-sm mt-1">
                  {product ? 'Update product information' : 'Create a new product'}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-6 -m-6 mt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50/80 to-[#FAA225]/10 p-4 rounded-xl border-2 border-blue-200/50">
                <h3 className="text-lg font-bold text-[#0A2645] mb-4">Product Identification</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0A2645] font-semibold">Barcode</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white/80 border-2 border-blue-200 focus:border-[#FAA225] transition-colors" 
                            {...field} 
                            placeholder="Enter barcode" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stockCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0A2645] font-semibold">Stock Code</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white/80 border-2 border-blue-200 focus:border-[#FAA225] transition-colors" 
                            {...field} 
                            placeholder="Enter stock code" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="linkCode"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="text-[#0A2645] font-semibold">Link Code</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-white/80 border-2 border-blue-200 focus:border-[#FAA225] transition-colors" 
                          {...field} 
                          placeholder="Enter link code" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="bg-gradient-to-r from-green-50/80 to-blue-50/60 p-4 rounded-xl border-2 border-green-200/50">
                <h3 className="text-lg font-bold text-[#0A2645] mb-4">Product Details</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#0A2645] font-semibold">Description</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-white/80 border-2 border-green-200 focus:border-[#FAA225] transition-colors" 
                          {...field} 
                          placeholder="Enter product description" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="bg-gradient-to-r from-[#FAA225]/10 to-orange-50/60 p-4 rounded-xl border-2 border-[#FAA225]/30">
                <h3 className="text-lg font-bold text-[#0A2645] mb-4">Pricing & Inventory</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0A2645] font-semibold">Units</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white/80 border-2 border-orange-200 focus:border-[#FAA225] transition-colors"
                            type="number" 
                            step="1" 
                            min="0" 
                            placeholder="Stock quantity"
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
                  
                  <FormField
                    control={form.control}
                    name="avgCostIncl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0A2645] font-semibold">Avg Cost Incl (R)</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white/80 border-2 border-orange-200 focus:border-[#FAA225] transition-colors"
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="0.00"
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#0A2645] font-semibold">Selling Price (R)</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-white/80 border-2 border-orange-200 focus:border-[#FAA225] transition-colors"
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="0.00"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t-2 border-blue-200/50">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="bg-white/80 text-[#0A2645] border-2 border-[#0A2645] hover:bg-[#0A2645]/10 font-semibold transition-all duration-200 px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-[#FAA225] to-[#e8940f] hover:from-[#e8940f] hover:to-[#FAA225] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6"
                >
                  Save Product
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
