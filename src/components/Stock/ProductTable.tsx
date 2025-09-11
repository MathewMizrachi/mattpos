
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
    <>
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3 p-2">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-primary truncate" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {product.barcode || 'No barcode'}
                </p>
              </div>
              <div className="flex space-x-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <EditIcon className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(product)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <TrashIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Stock:</span>
                <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                  (product.stock ?? 0) > 10 
                    ? 'bg-green-100 text-green-800' 
                    : (product.stock ?? 0) > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock !== undefined ? product.stock : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Stock Code:</span>
                <span className="ml-1 font-medium">{product.stockCode || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg Cost:</span>
                <span className="ml-1 font-medium">
                  {product.avgCostIncl !== undefined ? formatCurrency(product.avgCostIncl) : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Selling:</span>
                <span className="ml-1 font-bold text-green-600">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>
            
            {product.linkCode && (
              <div className="mt-2 text-xs">
                <span className="text-muted-foreground">Link Code:</span>
                <span className="ml-1 font-medium">{product.linkCode}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-primary to-primary/80 border-none hover:bg-gradient-to-r hover:from-primary/80 hover:to-primary">
              <TableHead className="text-secondary font-bold text-xs sm:text-sm whitespace-nowrap">BarCode</TableHead>
              <TableHead className="text-secondary font-bold text-xs sm:text-sm whitespace-nowrap">StockCode</TableHead>
              <TableHead className="text-secondary font-bold text-xs sm:text-sm whitespace-nowrap">LinkCode</TableHead>
              <TableHead className="text-secondary font-bold text-xs sm:text-sm">Description</TableHead>
              <TableHead className="text-secondary font-bold text-xs sm:text-sm whitespace-nowrap">Units</TableHead>
              <TableHead className="text-secondary font-bold text-xs sm:text-sm whitespace-nowrap">AvgCostIncl</TableHead>
              <TableHead className="text-secondary font-bold text-xs sm:text-sm whitespace-nowrap">Selling</TableHead>
              <TableHead className="text-right text-secondary font-bold text-xs sm:text-sm whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow 
                key={product.id}
                className={`cursor-pointer hover:bg-gradient-to-r hover:from-primary hover:to-primary/80 border-b border-gray-100 transition-all duration-200 hover:shadow-lg group ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <TableCell className="font-mono text-xs text-primary group-hover:text-white whitespace-nowrap">
                  {product.barcode || 'N/A'}
                </TableCell>
                <TableCell className="text-primary font-medium group-hover:text-white text-xs sm:text-sm whitespace-nowrap">
                  {product.stockCode || 'N/A'}
                </TableCell>
                <TableCell className="text-primary group-hover:text-white text-xs sm:text-sm whitespace-nowrap">
                  {product.linkCode || 'N/A'}
                </TableCell>
                <TableCell className="font-semibold max-w-[150px] sm:max-w-xs truncate text-primary group-hover:text-white text-xs sm:text-sm" title={product.name}>
                  {product.name}
                </TableCell>
                <TableCell className="text-primary group-hover:text-white">
                  <span className={`px-1.5 sm:px-2 py-1 rounded-full text-xs font-bold ${
                    (product.stock ?? 0) > 10 
                      ? 'bg-green-100 text-green-800 group-hover:bg-green-200 group-hover:text-green-900' 
                      : (product.stock ?? 0) > 0 
                      ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200 group-hover:text-yellow-900' 
                      : 'bg-red-100 text-red-800 group-hover:bg-red-200 group-hover:text-red-900'
                  }`}>
                    {product.stock !== undefined ? product.stock : 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="text-primary font-semibold group-hover:text-white text-xs sm:text-sm whitespace-nowrap">
                  {product.avgCostIncl !== undefined ? formatCurrency(product.avgCostIncl) : 'N/A'}
                </TableCell>
                <TableCell className="font-bold text-green-600 text-sm sm:text-lg group-hover:text-green-300 whitespace-nowrap">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 hover:scale-110 group-hover:text-blue-300 group-hover:hover:text-blue-100"
                    >
                      <EditIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 hover:scale-110 group-hover:text-red-300 group-hover:hover:text-red-100"
                    >
                      <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ProductTable;
