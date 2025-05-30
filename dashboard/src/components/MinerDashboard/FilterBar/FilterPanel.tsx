import React, { useState } from 'react'; // Added React import for useState
import { motion } from 'framer-motion';
import { BEADS } from '../lib/constants';
// Removed ChevronDown as shadcn/ui Select has its own. Calendar will be replaced by CalendarDays.
import { CalendarDays, Search } from 'lucide-react';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '~/components/ui/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover';
import { Calendar as ShadcnCalendar } from '~/components/ui/calendar';
import { Button } from '~/components/ui/button';

interface FilterPanelProps {
  // startRef and endRef removed as they are no longer needed for shadcn/ui Calendar
}

export default function FilterPanel({}: FilterPanelProps) { // Props are now empty
  const [startDate, setStartDate] = useState<Date | undefined>(new Date("2024-07-31"));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date("2024-07-31"));

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-4">
        {/* Miner Select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-muted-foreground">Miner</label>
          <Select defaultValue="(All)">
            <SelectTrigger className="w-full bg-background border-border hover:border-ring">
              <SelectValue placeholder="Select a miner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="(All)">(All)</SelectItem>
              {BEADS.map((bead) => (
                <SelectItem key={bead.id} value={bead.id}>
                  {bead.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block mb-1 text-sm font-medium text-muted-foreground">
            Start Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal bg-background border-border hover:border-ring hover:bg-muted/50 ${
                  !startDate && "text-muted-foreground"
                }`}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {startDate ? new Date(startDate).toLocaleDateString() : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <ShadcnCalendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div>
          <label className="block mb-1 text-sm font-medium text-muted-foreground">
            End Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal bg-background border-border hover:border-ring hover:bg-muted/50 ${
                  !endDate && "text-muted-foreground"
                }`}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {endDate ? new Date(endDate).toLocaleDateString() : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <ShadcnCalendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Search (remains unchanged as per instructions) */}
        <div>
          <label className="block mb-2 text-blue-300 font-medium">Search</label>
          <div className="relative group">
            <input
              type="text"
              className="w-full bg-gray-900/80 border border-gray-700/80 rounded-lg p-2.5 pl-9 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 group-hover:border-blue-400/70"
              placeholder="Search transactions, miners..."
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                }}
              >
                <Search className="h-4 w-4 text-blue-400" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
