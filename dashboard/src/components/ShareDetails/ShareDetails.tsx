import React, { useState } from 'react';
// Removed MUI imports

// Shadcn/ui component imports
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose, // Although not explicitly used in footer, good for accessibility if needed
} from '~/components/ui/dialog';
import {
  Tabs as ShadcnTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '~/components/ui/tabs';
import { Badge } from '~/components/ui/badge';
import { Button as ShadcnButton } from '~/components/ui/button';

import { BeadDisplayData } from '../../types/Bead';
import { mockBeads } from '../../data/mockBeads';

// Interface for component props
interface ShareDetailsProps {
  beadHash?: string;
  bead?: BeadDisplayData;
  open: boolean;
  onClose: () => void;
  onNavigateToBead?: (beadHash: string) => void;
}

// Removed StyledPaper, HashText, LabelText, ValueText (will use Tailwind classes)
// Removed TabPanel function

/**
 * ShareDetails Component (Refactored with shadcn/ui and Tailwind CSS)
 *
 * Displays detailed information about a bead/share in the Braidpool network.
 */
export default function ShareDetails({
  beadHash,
  bead: propBead,
  open,
  onClose,
  onNavigateToBead,
}: ShareDetailsProps) {
  const [tabValue, setTabValue] = useState("block-header"); // Default tab value for shadcn/ui Tabs

  const bead =
    propBead ||
    (beadHash
      ? Object.values(mockBeads).find((b) => b.beadHash === beadHash) ||
      mockBeads.tip
      : mockBeads.tip);

  // Handler for navigating to a parent bead (no change in logic)
  const handleParentClick = (parentHash: string) => {
    if (onNavigateToBead) {
      onNavigateToBead(parentHash);
    }
    console.log('📣 Navigate to parent bead:', parentHash);
  };

  // Helper for rendering key-value pairs
  const InfoRow: React.FC<{ label: string; children: React.ReactNode; isHash?: boolean; fullWidth?: boolean }> = ({ label, children, isHash, fullWidth }) => (
    <div className={`flex flex-col ${fullWidth ? 'w-full' : 'sm:w-1/2 w-full'} mb-3`}>
      <span className="text-xs font-medium text-muted-foreground uppercase">{label}</span>
      {isHash ? (
        <span className="font-mono break-all text-sm text-foreground">{children}</span>
      ) : (
        <span className="text-sm break-words text-foreground">{children}</span>
      )}
    </div>
  );
  
  const SectionTitle: React.FC<{children: React.ReactNode}> = ({children}) => (
    <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h3>
  );

  return (
    <ShadcnDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-card p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl text-foreground">
            Share Details
            {bead.isTip && (
              <Badge variant="secondary" className="ml-2">Tip</Badge>
            )}
            {bead.isGenesis && (
              <Badge variant="default" className="ml-2 bg-blue-600 hover:bg-blue-700">Genesis</Badge> // Using default variant with custom color for Genesis
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Bead Hash and Basic Info */}
        <div className="p-3 bg-background border border-border rounded-md shadow-sm my-3 space-y-2">
          <InfoRow label="Bead Hash" isHash fullWidth>{bead.beadHash}</InfoRow>
          
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/2 px-2"><InfoRow label="Observation Time">{bead.formattedTimestamp}</InfoRow></div>
            <div className="w-full sm:w-1/2 px-2"><InfoRow label="Cohort">{bead.cohortId}</InfoRow></div>
            <div className="w-full sm:w-1/2 px-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Validation Status</span>
              <div> {/* Wrapper div for badge to control layout if needed */}
                <Badge variant={bead.validationStatus === 'valid' ? 'default' /* Using default for success */ : bead.validationStatus === 'invalid' ? 'destructive' : 'outline'}
                       className={bead.validationStatus === 'valid' ? 'bg-green-600 hover:bg-green-700' : ''} // Custom success color
                >
                  {bead.validationStatus}
                </Badge>
              </div>
            </div>
            <div className="w-full sm:w-1/2 px-2"><InfoRow label="Lesser Difficulty Target">{bead.lesserDifficultyTarget.toString(16)}</InfoRow></div>
          </div>
        </div>

        <ShadcnTabs defaultValue="block-header" onValueChange={setTabValue} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 rounded-md p-1">
            <TabsTrigger value="block-header" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Block Header</TabsTrigger>
            <TabsTrigger value="parents" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Parents</TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="block-header" className="mt-3 p-3 bg-background border border-border rounded-md shadow-sm">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full sm:w-1/2 px-2"><InfoRow label="Version">{bead.blockHeader.version}</InfoRow></div>
              <div className="w-full sm:w-1/2 px-2"><InfoRow label="Timestamp">{new Date(bead.blockHeader.timestamp).toLocaleString()}</InfoRow></div>
              <div className="w-full px-2"><InfoRow label="Previous Block Hash" isHash>{bead.blockHeader.prevBlockHash}</InfoRow></div>
              <div className="w-full px-2"><InfoRow label="Merkle Root" isHash>{bead.blockHeader.merkleRoot}</InfoRow></div>
              <div className="w-full sm:w-1/2 px-2"><InfoRow label="Bits">{bead.blockHeader.bits}</InfoRow></div>
              <div className="w-full sm:w-1/2 px-2"><InfoRow label="Nonce">{bead.blockHeader.nonce}</InfoRow></div>
            </div>
          </TabsContent>

          <TabsContent value="parents" className="mt-3 p-3 bg-background border border-border rounded-md shadow-sm">
            {bead.parents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Genesis bead has no parents</p>
            ) : (
              bead.parents.map((parent, index) => (
                <div key={index} className="p-3 bg-card border border-border rounded-md shadow-sm mb-3 last:mb-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <InfoRow label="Parent Hash" isHash fullWidth>{parent.beadHash}</InfoRow>
                    <ShadcnButton variant="link" size="sm" onClick={() => handleParentClick(parent.beadHash)} className="p-0 h-auto text-primary hover:underline">View</ShadcnButton>
                  </div>
                  <InfoRow label="Timestamp" fullWidth>{new Date(parent.timestamp).toLocaleString()}</InfoRow>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="transactions" className="mt-3 space-y-4">
            <div>
              <SectionTitle>Coinbase Transaction</SectionTitle>
              <div className="p-3 bg-background border border-border rounded-md shadow-sm space-y-2">
                <InfoRow label="Transaction ID" isHash fullWidth>{bead.coinbaseTransaction.transaction.txid}</InfoRow>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full sm:w-1/2 px-2"><InfoRow label="Version">{bead.coinbaseTransaction.transaction.version}</InfoRow></div>
                  <div className="w-full sm:w-1/2 px-2"><InfoRow label="Lock Time">{bead.coinbaseTransaction.transaction.lockTime}</InfoRow></div>
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>Payout Update Transaction</SectionTitle>
              <div className="p-3 bg-background border border-border rounded-md shadow-sm space-y-2">
                <InfoRow label="Transaction ID" isHash fullWidth>{bead.payoutUpdateTransaction.transaction.txid}</InfoRow>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full sm:w-1/2 px-2"><InfoRow label="Version">{bead.payoutUpdateTransaction.transaction.version}</InfoRow></div>
                  <div className="w-full sm:w-1/2 px-2"><InfoRow label="Lock Time">{bead.payoutUpdateTransaction.transaction.lockTime}</InfoRow></div>
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>Other Transactions ({bead.transactions.length})</SectionTitle>
              {bead.transactions.map((tx, index) => (
                <div key={index} className="p-3 bg-background border border-border rounded-md shadow-sm mb-3 last:mb-0 space-y-2">
                  <InfoRow label="Transaction ID" isHash fullWidth>{tx.txid}</InfoRow>
                  <div className="flex flex-wrap -mx-2">
                    <div className="w-full sm:w-1/2 px-2"><InfoRow label="Size">{tx.size} bytes</InfoRow></div>
                    <div className="w-full sm:w-1/2 px-2"><InfoRow label="Weight">{tx.weight}</InfoRow></div>
                  </div>
                </div>
              ))}
              {bead.transactions.length === 0 && <p className="text-sm text-muted-foreground p-3 bg-background border border-border rounded-md shadow-sm">No other transactions.</p>}
            </div>
          </TabsContent>
        </ShadcnTabs>

        <DialogFooter className="mt-6 pt-4 border-t border-border">
          <ShadcnButton variant="outline" onClick={onClose}>Close</ShadcnButton>
        </DialogFooter>
      </DialogContent>
    </ShadcnDialog>
  );
}
