import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming default path
import { Menu, Settings, Bell, Filter, Home } from 'lucide-react';
import ActionIconButton from './ActionIconButton';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'BRAIDPOOL' }) => {
  const [notificationCount] = useState<number>(3); // Mock notification count

  // Mock function to add miner
  const handleAddMiner = () => {
    console.log('🔌 Adding new miner...');
    // In real implementation, this would open a dialog to add a new miner
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-card text-foreground border-b border-border shadow-md h-14 z-50">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between relative">
        {/* Left side - Logo and Brand */}
        <div className="flex items-center h-full">
          <div className="flex items-center justify-center text-foreground rounded-full w-9 h-9 mr-2 shadow-sm flex-shrink-0 overflow-hidden">
            <img
              src="/favicon.ico" // Update this path to your actual icon path
              alt="favicon"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', // Adjust image fit
              }}
            />
          </div>

          <span className="font-bold text-foreground tracking-wide text-lg mr-2 whitespace-nowrap">
            BRAIDPOOL
          </span>
          <div className="hidden md:flex border-l border-border/50 h-7 mx-2" />
          <div className="hidden md:flex items-center text-foreground">
            <Menu className="h-5 w-5 mr-1" />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center h-full space-x-3">
          <Button variant="secondary" size="sm" onClick={handleAddMiner}>
            Add Miner
          </Button>
          <div className="flex items-center space-x-1 h-full">
            <ActionIconButton icon={<Home className="h-5 w-5" />} />
            <ActionIconButton icon={<Filter className="h-5 w-5" />} />
            <div className="relative">
              <ActionIconButton icon={<Bell className="h-5 w-5" />} />
              {notificationCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground rounded-full w-4 h-4 text-xs font-bold flex items-center justify-center border-2 border-card shadow-sm">
                  {notificationCount}
                </div>
              )}
            </div>
            <ActionIconButton icon={<Settings className="h-5 w-5" />} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
