
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
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode</FormLabel>
                    <FormControl>
                      <Input className="bg-white" {...field} placeholder="Enter barcode" />
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
                    <FormLabel>Stock Code</FormLabel>
                    <FormControl>
                      <Input className="bg-white" {...field} placeholder="Enter stock code" />
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
                <FormItem>
                  <FormLabel>Link Code</FormLabel>
                  <FormControl>
                    <Input className="bg-white" {...field} placeholder="Enter link code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input className="bg-white" {...field} placeholder="Enter product description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units</FormLabel>
                    <FormControl>
                      <Input 
                        className="bg-white"
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
                    <FormLabel>Avg Cost Incl (R)</FormLabel>
                    <FormControl>
                      <Input 
                        className="bg-white"
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
                    <FormLabel>Selling Price (R)</FormLabel>
                    <FormControl>
                      <Input 
                        className="bg-white"
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
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
