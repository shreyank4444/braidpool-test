import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ShareDetails from './ShareDetails'; // Corrected path
import { mockBeads, printDebug } from '../../data/mockBeads'; // Corrected path
import { BeadDisplayData } from '../../types/Bead'; // Attempted import

/**
 * ShareDetailsDemo Component
 *
 * A simple demo component that shows how to use the ShareDetails component.
 * It provides buttons to open different types of beads in the ShareDetails modal.
 */
export default function ShareDetailsDemo() {
  const [open, setOpen] = useState(false);
  const [selectedBeadKey, setSelectedBeadKey] = useState<string | null>(null); // Renamed to avoid confusion with bead object

  // Handler for opening the modal with a specific bead
  const handleOpenBead = (beadType: string) => {
    setSelectedBeadKey(beadType);
    setOpen(true);
    console.log('🔍 Opening bead details for:', beadType);
    printDebug(); // Print debug information to console
  };

  // Handler for closing the modal
  const handleClose = () => {
    setOpen(false);
  };

  // Handler for navigating to a different bead
  const handleNavigateToBead = (beadHash: string) => {
    const beadType = Object.entries(mockBeads).find(
      ([_key, bead]) => (bead as BeadDisplayData).beadHash === beadHash // Type assertion for bead
    )?.[0];

    if (beadType) {
      setSelectedBeadKey(beadType);
      console.log('🔄 Navigating to bead:', beadType);
    }
  };

  return (
    <div className="p-6 bg-background text-foreground min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center">Share Details Component Demo</h1>

      <div className="bg-card text-card-foreground p-6 my-4 mx-auto max-w-2xl rounded-xl shadow-lg flex flex-col gap-4 items-center">
        <h2 className="text-xl font-medium text-center">
          Open different types of beads to see the ShareDetails component in action
        </h2>

        <div className="flex flex-wrap justify-center gap-4 my-2">
          <Button variant="default" onClick={() => handleOpenBead('genesis')}>
            Open Genesis Bead
          </Button>

          <Button variant="secondary" onClick={() => handleOpenBead('regular')}>
            Open Regular Bead
          </Button>

          <Button variant="outline" onClick={() => handleOpenBead('tip')}>
            Open Tip Bead
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center mt-2">
          Click "View" on parent beads to navigate between related beads.
        </p>
      </div>

      {/* The ShareDetails component */}
      <ShareDetails
        open={open}
        onClose={handleClose}
        bead={selectedBeadKey ? mockBeads[selectedBeadKey] as BeadDisplayData : undefined}
        onNavigateToBead={handleNavigateToBead}
      />
    </div>
  );
}
