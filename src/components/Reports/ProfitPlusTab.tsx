
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from '@/lib/utils';
import { DateRangePicker } from './DateRangePicker';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface ProfitPlusTabProps {
  fromDate: Date;
  toDate: Date;
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
  profitPlusData: {
    daily: {
      date: string;
      transactions: number;
      revenue: number;
      commission: number;
    }[];
    products: {
      name: string;
      count: number;
      value: number;
      commission: number;
    }[];
  };
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'name' | 'count' | 'value' | 'commission';
  setSortBy: (sort: 'name' | 'count' | 'value' | 'commission') => void;
}

export const ProfitPlusTab: React.FC<ProfitPlusTabProps> = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  profitPlusData,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy
}) => {
  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = profitPlusData.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort based on selected option
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'count':
        filtered.sort((a, b) => b.count - a.count);
        break;
      case 'value':
        filtered.sort((a, b) => b.value - a.value);
        break;
      case 'commission':
        filtered.sort((a, b) => b.commission - a.commission);
        break;
    }

    return filtered;
  }, [profitPlusData.products, searchTerm, sortBy]);

  return (
    <div>
      <DateRangePicker 
        fromDate={fromDate} 
        toDate={toDate} 
        setFromDate={setFromDate} 
        setToDate={setToDate} 
      />
      <h3 className="text-lg font-medium mb-4">Profit+ Performance</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profitPlusData.daily.map((day) => (
              <TableRow key={day.date}>
                <TableCell>{day.date}</TableCell>
                <TableCell>{day.transactions}</TableCell>
                <TableCell>{formatCurrency(day.revenue)}</TableCell>
                <TableCell>{formatCurrency(day.commission)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <h3 className="text-lg font-medium my-4">Product Breakdown</h3>
      
      {/* Search and Sort Controls for Products */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="count">Count (High to Low)</SelectItem>
            <SelectItem value="value">Value (High to Low)</SelectItem>
            <SelectItem value="commission">Commission (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.count}</TableCell>
                <TableCell>{formatCurrency(product.value)}</TableCell>
                <TableCell>{formatCurrency(product.commission)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Profit+ Summary</h4>
        <p>Total Transactions: <strong>{profitPlusData.daily.reduce((sum, day) => sum + day.transactions, 0)}</strong></p>
        <p>Total Revenue: <strong>{formatCurrency(profitPlusData.daily.reduce((sum, day) => sum + day.revenue, 0))}</strong></p>
        <p>Total Commission: <strong>{formatCurrency(profitPlusData.daily.reduce((sum, day) => sum + day.commission, 0))}</strong></p>
        <p>Most Popular Product: <strong>{
          filteredAndSortedProducts.length > 0 ? 
          filteredAndSortedProducts.reduce((prev, current) => 
            (prev.count > current.count) ? prev : current
          ).name : 'N/A'
        }</strong></p>
        <p>Showing: <strong>{filteredAndSortedProducts.length}</strong> of <strong>{profitPlusData.products.length}</strong> products</p>
      </div>
    </div>
  );
};
