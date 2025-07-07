
import React from 'react';
import { Button } from '@/components/ui/button';
import { EditIcon, TrashIcon, Package2Icon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

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

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package2Icon className="h-12 w-12 mx-auto text-white/50 mb-4" />
        <p className="text-white/70">No products found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-[#FAA225]">
            <TableHead className="text-white">BarCode</TableHead>
            <TableHead className="text-white">StockCode</TableHead>
            <TableHead className="text-white">LinkCode</TableHead>
            <TableHead className="text-white">Description</TableHead>
            <TableHead className="text-white">Units</TableHead>
            <TableHead className="text-white">AvgCostIncl</TableHead>
            <TableHead className="text-white">Selling</TableHead>
            <TableHead className="text-right text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="border-[#FAA225]/30 hover:bg-white/5">
              <TableCell className="font-mono text-xs text-white">{product.barcode || 'N/A'}</TableCell>
              <TableCell className="text-white">{product.stockCode || 'N/A'}</TableCell>
              <TableCell className="text-white">{product.linkCode || 'N/A'}</TableCell>
              <TableCell className="font-medium max-w-xs truncate text-white" title={product.name}>
                {product.name}
              </TableCell>
              <TableCell className="text-white">{product.stock !== undefined ? product.stock : 'N/A'}</TableCell>
              <TableCell className="text-white">{product.avgCostIncl !== undefined ? formatCurrency(product.avgCostIncl) : 'N/A'}</TableCell>
              <TableCell className="font-semibold text-[#FAA225]">{formatCurrency(product.price)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                    className="text-white hover:bg-white/10"
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(product)}
                    className="text-white hover:bg-white/10"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
