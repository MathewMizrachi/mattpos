
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface InventoryStatusTabProps {
  inventoryData: {
    productName: string;
    currentStock: number;
    reorderLevel: number;
    lastRestocked: string;
    isProblematic?: boolean;
  }[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'problematic' | 'popular' | 'restocked' | 'status';
  setSortBy: (sort: 'problematic' | 'popular' | 'restocked' | 'status') => void;
}

export const InventoryStatusTab: React.FC<InventoryStatusTabProps> = ({ 
  inventoryData, 
  searchTerm, 
  setSearchTerm, 
  sortBy, 
  setSortBy 
}) => {
  // Filter and sort data
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = inventoryData.filter(item =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort based on selected option
    switch (sortBy) {
      case 'problematic':
        filtered.sort((a, b) => {
          if (a.isProblematic && !b.isProblematic) return -1;
          if (!a.isProblematic && b.isProblematic) return 1;
          return 0;
        });
        break;
      case 'popular':
        // Mock popularity sort - in real app this would be based on sales data
        filtered.sort((a, b) => b.currentStock - a.currentStock);
        break;
      case 'restocked':
        filtered.sort((a, b) => new Date(b.lastRestocked).getTime() - new Date(a.lastRestocked).getTime());
        break;
      case 'status':
        filtered.sort((a, b) => {
          const aStatus = a.currentStock < a.reorderLevel ? 0 : 1;
          const bStatus = b.currentStock < b.reorderLevel ? 0 : 1;
          return aStatus - bStatus;
        });
        break;
    }

    return filtered;
  }, [inventoryData, searchTerm, sortBy]);

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Inventory Status Report</h3>
      
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A2645] h-4 w-4" />
          <Input
            className="pl-10 bg-[#FAA225] text-[#0A2645] placeholder:text-[#0A2645] border-[#0A2645]"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[200px] bg-[#FAA225] text-[#0A2645] border-[#0A2645]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="problematic">Problematic First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="restocked">Recently Restocked</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Reorder Level</TableHead>
              <TableHead>Last Restocked</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map((item) => (
              <TableRow key={item.productName}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>{item.reorderLevel}</TableCell>
                <TableCell>{item.lastRestocked}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.currentStock < item.reorderLevel 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.currentStock < item.reorderLevel ? 'Reorder' : 'Ok'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Inventory Summary</h4>
        <p>Products Below Reorder Level: <strong>{filteredAndSortedData.filter(item => item.currentStock < item.reorderLevel).length}</strong></p>
        <p>Total Products: <strong>{filteredAndSortedData.length}</strong></p>
        <p>Showing: <strong>{filteredAndSortedData.length}</strong> of <strong>{inventoryData.length}</strong> products</p>
      </div>
    </div>
  );
};
