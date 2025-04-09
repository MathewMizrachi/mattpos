
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InventoryStatusTabProps {
  inventoryData: {
    productName: string;
    currentStock: number;
    reorderLevel: number;
    lastRestocked: string;
  }[];
}

export const InventoryStatusTab: React.FC<InventoryStatusTabProps> = ({ inventoryData }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Inventory Status Report</h3>
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
            {inventoryData.slice(0, 10).map((item) => (
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
        <p>Products Below Reorder Level: <strong>{inventoryData.filter(item => item.currentStock < item.reorderLevel).length}</strong></p>
        <p>Total Products: <strong>{inventoryData.length}</strong></p>
      </div>
    </div>
  );
};
