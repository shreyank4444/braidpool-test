import React from 'react';
// Removed MUI Table imports
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import Card from '../common/Card'; // Assuming this is the migrated shadcn/ui Card
// import colors from '../../theme/colors'; // Will be removed as sx props are gone

// Mock data for recent blocks
const recentBlocks = [
  {
    height: 837192,
    hash: '000000000000000000030f31e862f407bb97d0d299e6ae92b428b540f8d26237',
    time: '4 hrs ago',
  },
  {
    height: 837192,
    hash: '000000000000000000023a97e8c10a8ba61827f37b019871bf3aab48015d3273',
    time: '5 hrs ago',
  },
  {
    height: 837192,
    hash: '0000000000000000000b98c4d0ff2b7d48ab5aeadcfb94c53fef7b9e18982f34',
    time: '6 hrs ago',
  },
  {
    height: 837192,
    hash: '00000000000000000007f3e72173d22dd9fbd000b7acb328c5559346b5f6af89',
    time: '7 hrs ago',
  },
];

interface RecentBlocksTableProps {
  maxHeight?: number;
}

const RecentBlocksTable: React.FC<RecentBlocksTableProps> = ({
  maxHeight = 400,
}) => {
  // Helper function to truncate hash
  const truncateHash = (hash: string) => {
    return hash.substring(0, 10) + '...' + hash.substring(hash.length - 10);
  };

  // Replacing colors.cardAccentSecondary with a Tailwind compatible color or CSS variable
  // For now, let's use the primary color for accent, or remove if not desired.
  // Using braidpoolPrimary defined in tailwind.config.js
  const cardAccentColor = 'var(--braidpool-primary)'; // Example, assuming braidpoolPrimary is defined as HSL var or a direct hex value
                                                // Or use a tailwind class like `border-braidpoolPrimary` on the Card itself.
                                                // For the accentColor prop on our custom Card, it expects a string value for `backgroundColor`.
                                                // Let's use a placeholder from our theme, e.g. the primary color.
                                                // The `Card` component's accentColor prop takes a direct color string.
                                                // We have braidpoolPrimary: '#3986e8' in tailwind.config.js
                                                // So we can use that.
                                                // Or, use the CSS variable for primary: "hsl(var(--primary))"
  
  return (
    <Card
      title="Recent Blocks"
      subtitle="Latest blocks found by the pool"
      accentColor="hsl(var(--primary))" // Using the primary color from CSS vars
    >
      {/* Replaced TableContainer with a div for scrollability */}
      <div
        style={maxHeight ? { maxHeight: `${maxHeight}px` } : {}}
        className="overflow-auto" // Standard Tailwind class for overflow
      >
        <ShadcnTable className="w-full">
          <TableHeader>
            <TableRow>
              {/* Replaced TableCell sx with TableHead component and Tailwind classes */}
              <TableHead className="bg-card text-foreground font-bold sticky top-0">Height</TableHead>
              <TableHead className="bg-card text-foreground font-bold sticky top-0">Hash</TableHead>
              <TableHead className="bg-card text-foreground font-bold sticky top-0">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBlocks.map((block, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                {/* Replaced TableCell sx with Tailwind classes */}
                <TableCell className="text-foreground">{block.height}</TableCell>
                <TableCell className="text-primary font-mono text-xs"> {/* Using primary color for hash, and monospace small font */}
                  {truncateHash(block.hash)}
                </TableCell>
                <TableCell className="text-muted-foreground">{block.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ShadcnTable>
      </div>
    </Card>
  );
};

export default RecentBlocksTable;
