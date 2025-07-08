
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
        <Package2Icon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>BarCode</TableHead>
            <TableHead>StockCode</TableHead>
            <TableHead>LinkCode</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>AvgCostIncl</TableHead>
            <TableHead>Selling</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-mono text-xs">{product.barcode || 'N/A'}</TableCell>
              <TableCell>{product.stockCode || 'N/A'}</TableCell>
              <TableCell>{product.linkCode || 'N/A'}</TableCell>
              <TableCell className="font-medium max-w-xs truncate" title={product.name}>
                {product.name}
              </TableCell>
              <TableCell>{product.stock !== undefined ? product.stock : 'N/A'}</TableCell>
              <TableCell>{product.avgCostIncl !== undefined ? formatCurrency(product.avgCostIncl) : 'N/A'}</TableCell>
              <TableCell className="font-semibold">{formatCurrency(product.price)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(product)}
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
