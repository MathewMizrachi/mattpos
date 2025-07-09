
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
      <div className="text-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-lg">
            <Package2Icon className="h-10 w-10 text-gray-500" />
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms or add new products</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] border-none hover:bg-gradient-to-r hover:from-[#1a3a5f] hover:to-[#0A2645]">
            <TableHead className="text-[#FAA225] font-bold text-sm">BarCode</TableHead>
            <TableHead className="text-[#FAA225] font-bold text-sm">StockCode</TableHead>
            <TableHead className="text-[#FAA225] font-bold text-sm">LinkCode</TableHead>
            <TableHead className="text-[#FAA225] font-bold text-sm">Description</TableHead>
            <TableHead className="text-[#FAA225] font-bold text-sm">Units</TableHead>
            <TableHead className="text-[#FAA225] font-bold text-sm">AvgCostIncl</TableHead>
            <TableHead className="text-[#FAA225] font-bold text-sm">Selling</TableHead>
            <TableHead className="text-right text-[#FAA225] font-bold text-sm">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow 
              key={product.id}
              className={`cursor-pointer hover:bg-gradient-to-r hover:from-[#FAA225]/5 hover:to-[#FAA225]/10 border-b border-gray-100 transition-all duration-200 hover:shadow-lg ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <TableCell className="font-mono text-xs text-[#0A2645]">
                {product.barcode || 'N/A'}
              </TableCell>
              <TableCell className="text-[#0A2645] font-medium">
                {product.stockCode || 'N/A'}
              </TableCell>
              <TableCell className="text-[#0A2645]">
                {product.linkCode || 'N/A'}
              </TableCell>
              <TableCell className="font-semibold max-w-xs truncate text-[#0A2645]" title={product.name}>
                {product.name}
              </TableCell>
              <TableCell className="text-[#0A2645]">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  (product.stock ?? 0) > 10 
                    ? 'bg-green-100 text-green-800' 
                    : (product.stock ?? 0) > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock !== undefined ? product.stock : 'N/A'}
                </span>
              </TableCell>
              <TableCell className="text-[#0A2645] font-semibold">
                {product.avgCostIncl !== undefined ? formatCurrency(product.avgCostIncl) : 'N/A'}
              </TableCell>
              <TableCell className="font-bold text-green-600 text-lg">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(product)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 hover:scale-110"
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
