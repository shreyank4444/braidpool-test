import React from 'react';
// Removed: import { Box, Typography } from '@mui/material';
import KPICard from '../common/KPICard';
// Removed MUI Icon imports
import {
  Globe,
  AlertTriangle,
  Layers, // Replacing BlurOnIcon (structure/layers)
  Wallet, // Replacing AccountBalanceWalletIcon
  Network, // Replacing DeviceHubIcon
  Paperclip, // Replacing AttachmentIcon
  Brain, // Replacing MemoryIcon (tips count)
  Percent,
} from 'lucide-react';

// Mock data for the Braidpool dashboard with realistic values
const mockData = {
  // Primary metrics
  networkHashrate: '725.06',
  difficultyTarget: '8.92e+12',
  beadRate: '4.23',
  estimatedEarnings: '137.20',

  // Secondary metrics
  nbNcRatio: '1.765',
  shareCount: '14,532',
  tipsCount: '4',
  relativeShareValue: '0.028',

  // Other tracking data
  cohortFormationRate: '1.2',
  networkLatency: '215',
};

interface DashboardMetricsProps {
  loading?: boolean;
}

export const PrimaryMetrics: React.FC<DashboardMetricsProps> = ({
  loading = false,
}) => {
  return (
    <div className="mb-8"> {/* Was Box sx={{ mb: 4 }} */}
      <h3 className="mb-4 font-medium px-1 text-lg">Primary Metrics</h3> {/* Was Typography */}
      <div className="flex flex-wrap -mx-1"> {/* Was Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }} */}
        <div className="w-1/2 sm:w-1/4 p-1"> {/* Was Box sx={{ width: { xs: '50%', sm: '25%' }, p: 1 }} */}
          <KPICard
            title="NETWORK HASHRATE"
            value={mockData.networkHashrate}
            unit="PH/s"
            subtitle="TOTAL NETWORK"
            loading={loading}
            info="Total hashrate of all connected miners in the network"
            icon={<Globe className="h-5 w-5" />} {/* Replaced PublicIcon */}
          />
        </div>
        <div className="w-1/2 sm:w-1/4 p-1">
          <KPICard
            title="DIFFICULTY TARGET"
            value={mockData.difficultyTarget}
            subtitle="CURRENT TARGET"
            loading={loading}
            info="Current target difficulty for bead creation in the Braidpool network"
            icon={<AlertTriangle className="h-5 w-5" />} {/* Replaced PriorityHighIcon */}
            change={-2.4}
          />
        </div>
        <div className="w-1/2 sm:w-1/4 p-1">
          <KPICard
            title="BEAD RATE"
            value={mockData.beadRate}
            unit="bps"
            subtitle="BEADS PER SECOND"
            loading={loading}
            info="Current rate of bead creation in the Braidpool network"
            icon={<Layers className="h-5 w-5" />} {/* Replaced BlurOnIcon */}
            change={1.7}
          />
        </div>
        <div className="w-1/2 sm:w-1/4 p-1">
          <KPICard
            title="USD / Day"
            value={mockData.estimatedEarnings}
            subtitle="ESTIMATED EARNINGS"
            loading={loading}
            info="Estimated daily earnings based on your share contribution"
            icon={<Wallet className="h-5 w-5" />} {/* Replaced AccountBalanceWalletIcon */}
          />
        </div>
      </div>
    </div>
  );
};

export const SecondaryMetrics: React.FC<DashboardMetricsProps> = ({
  loading = false,
}) => {
  return (
    <div className="mb-8"> {/* Was Box sx={{ mb: 4 }} */}
      <h3 className="mb-4 font-medium px-1 text-lg">Secondary Metrics</h3> {/* Was Typography */}
      <div className="flex flex-wrap -mx-1"> {/* Was Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }} */}
        <div className="w-1/2 sm:w-1/4 p-1"> {/* Was Box sx={{ width: { xs: '50%', sm: '25%' }, p: 1 }} */}
          <KPICard
            title="Nb/Nc RATIO"
            value={mockData.nbNcRatio}
            subtitle="BEADS-TO-COHORTS"
            loading={loading}
            info="Critical consensus metric: ratio of total beads to total cohorts"
            icon={<Network className="h-5 w-5" />} {/* Replaced DeviceHubIcon */}
            change={0.12}
          />
        </div>
        <div className="w-1/2 sm:w-1/4 p-1">
          <KPICard
            title="SHARE COUNT"
            value={mockData.shareCount}
            subtitle="YOUR CONTRIBUTION"
            loading={loading}
            info="Number of shares you have contributed to the pool"
            icon={<Paperclip className="h-5 w-5" />} {/* Replaced AttachmentIcon */}
            change={3.4}
          />
        </div>
        <div className="w-1/2 sm:w-1/4 p-1">
          <KPICard
            title="TIPS COUNT"
            value={mockData.tipsCount}
            subtitle="CURRENT TIPS"
            loading={loading}
            info="Current number of tip beads in the braid structure"
            icon={<Brain className="h-5 w-5" />} {/* Replaced MemoryIcon */}
          />
        </div>
        <div className="w-1/2 sm:w-1/4 p-1">
          <KPICard
            title="SHARE VALUE"
            value={mockData.relativeShareValue}
            unit="%"
            subtitle="POOL CONTRIBUTION"
            loading={loading}
            info={`Your percentage of the pool's total rewards`}
            icon={<Percent className="h-5 w-5" />} {/* Replaced PercentIcon */}
          />
        </div>
      </div>
    </div>
  );
};

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  loading = false,
}) => {
  return (
    <div> {/* Was Box */}
      <PrimaryMetrics loading={loading} />
      <SecondaryMetrics loading={loading} />
    </div>
  );
};

export default DashboardMetrics;
