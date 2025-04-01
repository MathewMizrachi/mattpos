
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
}

const productSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be greater than 0' }),
  stock: z.coerce.number().int().nonnegative().optional(),
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
      ? { name: product.name, price: product.price, stock: product.stock } 
      : { name: '', price: 0, stock: undefined },
  });

  const handleSubmit = (data: ProductFormValues) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input className="bg-white" {...field} placeholder="Enter product name" />
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
                  <FormLabel>Price (R)</FormLabel>
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
            
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-white"
                      type="number" 
                      step="1" 
                      min="0" 
                      placeholder="Leave empty for unlimited"
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
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
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
