import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator'; // Not explicitly needed based on structure

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

/**
 * ShareDetails Component
 *
 * Displays detailed information about a bead/share in the Braidpool network.
 * Can be triggered from various places in the dashboard.
 */
export default function ShareDetails({
  beadHash,
  bead: propBead,
  open,
  onClose,
  onNavigateToBead,
}: ShareDetailsProps) {
  const [tabValue, setTabValue] = useState("header"); // Default to first tab

  // For demo purposes, if no bead is provided, use the tip bead from mock data
  const bead =
    propBead ||
    (beadHash
      ? Object.values(mockBeads).find((b) => b.beadHash === beadHash) ||
        mockBeads.tip
      : mockBeads.tip);

  // Handler for navigating to a parent bead
  const handleParentClick = (parentHash: string) => {
    if (onNavigateToBead) {
      onNavigateToBead(parentHash);
    }
    console.log('📣 Navigate to parent bead:', parentHash);
  };

  // Generic Section component (replaces StyledPaper)
  const InfoSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-muted/30 p-4 my-3 rounded-lg border border-border shadow-sm ${className}`}>
      {children}
    </div>
  );

  // Label component
  const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-sm font-medium text-muted-foreground mb-0.5">{children}</p>
  );

  // Value component
  const Value: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-sm text-foreground break-words">{children}</p>
  );

  // Hash component
  const HashValue: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="font-mono text-sm text-foreground break-all">{children}</p>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Share Details
            {bead.isTip && (
              <Badge variant="outline" className="ml-2 bg-secondary text-secondary-foreground">Tip</Badge>
            )}
            {bead.isGenesis && (
              <Badge variant="outline" className="ml-2 bg-primary text-primary-foreground">Genesis</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-6 -mr-6"> {/* Scrollable area */}
          {/* Bead Hash and Basic Info */}
          <InfoSection>
            <div className="mb-3">
              <Label>Bead Hash</Label>
              <HashValue>{bead.beadHash}</HashValue>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <Label>Observation Time</Label>
                <Value>{bead.formattedTimestamp}</Value>
              </div>
              <div>
                <Label>Cohort</Label>
                <Value>{bead.cohortId}</Value>
              </div>
              <div>
                <Label>Validation Status</Label>
                <Badge variant={bead.validationStatus === 'valid' ? 'default' : bead.validationStatus === 'invalid' ? 'destructive' : 'secondary'}>
                  {bead.validationStatus}
                </Badge>
              </div>
              <div>
                <Label>Lesser Difficulty Target</Label>
                <Value>{bead.lesserDifficultyTarget.toString(16)}</Value>
              </div>
            </div>
          </InfoSection>

          {/* Tabs for different sections */}
          <Tabs defaultValue="header" value={tabValue} onValueChange={setTabValue} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="header">Block Header</TabsTrigger>
              <TabsTrigger value="parents">Parents</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            {/* Block Header Tab */}
            <TabsContent value="header" className="mt-2">
              <div className="p-0.5">
                <InfoSection>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <Label>Version</Label>
                      <Value>{bead.blockHeader.version}</Value>
                    </div>
                    <div>
                      <Label>Timestamp</Label>
                      <Value>{new Date(bead.blockHeader.timestamp).toLocaleString()}</Value>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Previous Block Hash</Label>
                      <HashValue>{bead.blockHeader.prevBlockHash}</HashValue>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Merkle Root</Label>
                      <HashValue>{bead.blockHeader.merkleRoot}</HashValue>
                    </div>
                    <div>
                      <Label>Bits</Label>
                      <Value>{bead.blockHeader.bits}</Value>
                    </div>
                    <div>
                      <Label>Nonce</Label>
                      <Value>{bead.blockHeader.nonce}</Value>
                    </div>
                  </div>
                </InfoSection>
              </div>
            </TabsContent>

            {/* Parents Tab */}
            <TabsContent value="parents" className="mt-2">
              <div className="p-0.5">
                {bead.parents.length === 0 ? (
                  <p className="text-muted-foreground">Genesis bead has no parents</p>
                ) : (
                  bead.parents.map((parent, index) => (
                    <InfoSection key={index}>
                      <div className="space-y-2">
                        <div>
                          <Label>Parent Hash</Label>
                          <div className="flex items-center justify-between">
                            <HashValue>{parent.beadHash}</HashValue>
                            <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleParentClick(parent.beadHash)}>
                              View
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label>Timestamp</Label>
                          <Value>{new Date(parent.timestamp).toLocaleString()}</Value>
                        </div>
                      </div>
                    </InfoSection>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-2">
              <div className="p-0.5">
                <div>
                  <h4 className="text-md font-semibold mt-4 mb-2">Coinbase Transaction</h4>
                  <InfoSection>
                    <div className="space-y-2">
                      <div>
                        <Label>Transaction ID</Label>
                        <HashValue>{bead.coinbaseTransaction.transaction.txid}</HashValue>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <Label>Version</Label>
                          <Value>{bead.coinbaseTransaction.transaction.version}</Value>
                        </div>
                        <div>
                          <Label>Lock Time</Label>
                          <Value>{bead.coinbaseTransaction.transaction.lockTime}</Value>
                        </div>
                      </div>
                    </div>
                  </InfoSection>
                </div>

                <div>
                  <h4 className="text-md font-semibold mt-4 mb-2">Payout Update Transaction</h4>
                  <InfoSection>
                     <div className="space-y-2">
                        <div>
                          <Label>Transaction ID</Label>
                          <HashValue>{bead.payoutUpdateTransaction.transaction.txid}</HashValue>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <Label>Version</Label>
                            <Value>{bead.payoutUpdateTransaction.transaction.version}</Value>
                          </div>
                          <div>
                            <Label>Lock Time</Label>
                            <Value>{bead.payoutUpdateTransaction.transaction.lockTime}</Value>
                          </div>
                        </div>
                      </div>
                  </InfoSection>
                </div>

                <div>
                  <h4 className="text-md font-semibold mt-4 mb-2">Other Transactions ({bead.transactions.length})</h4>
                  {bead.transactions.map((tx, index) => (
                    <InfoSection key={index}>
                      <div className="space-y-2">
                        <div>
                          <Label>Transaction ID</Label>
                          <HashValue>{tx.txid}</HashValue>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <Label>Size</Label>
                            <Value>{tx.size} bytes</Value>
                          </div>
                          <div>
                            <Label>Weight</Label>
                            <Value>{tx.weight}</Value>
                          </div>
                        </div>
                      </div>
                    </InfoSection>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
