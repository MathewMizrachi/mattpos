
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  fromDate: Date;
  toDate: Date;
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">From Date</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-white text-[#0A2645] border-[#0A2645]"
            >
              {format(fromDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => date && setFromDate(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">To Date</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-white text-[#0A2645] border-[#0A2645]"
            >
              {format(toDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) => date && setToDate(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
