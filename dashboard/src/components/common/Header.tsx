import React, { useState } from 'react';
// Removed MUI imports: AppBar, Box, Toolbar, Typography, Button
// Removed MUI icon imports
import { Button as ShadcnButton } from '~/components/ui/button';
import { Menu, Settings, Bell, Filter, Home, PlusCircle } from 'lucide-react';
import ActionIconButton from './ActionIconButton'; // Assuming ActionIconButton is already migrated or will be

interface HeaderProps {
  title?: string; // title prop is not used in the new design, but kept for API compatibility if needed elsewhere
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title = 'BRAIDPOOL', onMenuClick }) => {
  const [notificationCount] = useState<number>(3); // Mock notification count

  const handleAddMiner = () => {
    console.log('🔌 Adding new miner...');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[56px] bg-braidpoolHeaderBackground shadow-md border-b border-white/10 flex items-center">
      <div className="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        {/* Left Section */}
        <div className="flex items-center h-full">
          <button
            onClick={onMenuClick}
            className="sm:hidden p-1 -ml-1 mr-2 text-white rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <img
            src="/favicon.ico"
            alt="Braidpool Logo"
            className="h-8 w-8 rounded-full mr-2 shadow-sm"
          />
          <div className="text-base sm:text-lg font-bold text-white tracking-wide whitespace-nowrap">
            BRAIDPOOL {/* title prop is not used here to match the new design spec from the prompt */}
          </div>
          {/* The vertical divider and MenuIcon from original sx were specific to MUI layout and not requested for migration */}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-x-1.5 sm:gap-x-2 h-full">
          <ShadcnButton
            variant="default" // This will use the 'primary' styling from shadcn/ui theme unless customized
            size="sm"
            onClick={handleAddMiner}
            // Using custom class for specific background, or could define a "secondary-dark" variant
            className="bg-[#36454F] hover:bg-[#2a3640] text-white text-xs sm:text-sm h-8 px-2 sm:px-3 rounded-md shadow-sm"
          >
            <PlusCircle className="h-3 w-3 mr-1 hidden xs:inline sm:h-4 sm:w-4" />
            Add Miner
          </ShadcnButton>
          
          {/* Assuming ActionIconButton is a pre-existing or separately migrated component */}
          {/* It should now accept a Lucide icon directly */}
          <ActionIconButton icon={<Home className="h-5 w-5" />} />
          <ActionIconButton icon={<Filter className="h-5 w-5" />} />
          
          <div className="relative">
            <ActionIconButton icon={<Bell className="h-5 w-5" />} />
            {notificationCount > 0 && (
              <div className="absolute top-[-2px] right-[-2px] bg-braidpoolError text-white w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-braidpoolHeaderBackground shadow-sm">
                {/* Adjusted border to border-2 to be more visible like original border-1.5 */}
                {notificationCount}
              </div>
            )}
          </div>
          
          <ActionIconButton icon={<Settings className="h-5 w-5" />} />
        </div>
      </div>
    </header>
  );
};

export default Header;
