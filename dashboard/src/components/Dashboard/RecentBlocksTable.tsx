import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Card from '../common/Card'; // Assuming Card is already refactored

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

  return (
    <Card
      title="Recent Blocks"
      subtitle="Latest blocks found by the pool"
      accentColor="#ff9800" // Updated accentColor
    >
      <div
        className="overflow-y-auto"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-card text-foreground font-bold sticky top-0 z-10">
                Height
              </TableHead>
              <TableHead className="bg-card text-foreground font-bold sticky top-0 z-10">
                Hash
              </TableHead>
              <TableHead className="bg-card text-foreground font-bold sticky top-0 z-10">
                Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBlocks.map((block, index) => (
              <TableRow key={index}>
                <TableCell className="text-foreground">
                  {block.height}
                </TableCell>
                <TableCell className="text-amber-500 font-mono text-xs">
                  {truncateHash(block.hash)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {block.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default RecentBlocksTable;
