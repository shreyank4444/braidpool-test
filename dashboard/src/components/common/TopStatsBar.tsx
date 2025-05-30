import React from 'react';
// Removed MUI imports: Box, Typography, Stack, Skeleton
// Removed colors import as it's no longer used
import { Skeleton as ShadcnSkeleton } from '~/components/ui/skeleton';
// Assuming icons would be from lucide-react if used, e.g., import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode; // For potential lucide-react icon
  loading?: boolean;
  // change?: string; // Example: "+5.2%" - not in original data but common for stat cards
  // changeColorClass?: string; // Example: "text-green-500" or "text-red-500"
}

interface TopStatsBarProps {
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  loading = false,
  // change,
  // changeColorClass,
}) => {
  return (
    <div className="bg-card p-4 rounded-lg border border-border shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-1 text-muted-foreground">
          {icon && <div className="mr-2 text-primary">{icon}</div>}
          {/* MUI subtitle2 was 0.875rem, text-xs is 0.75rem, text-sm is 0.875rem. Let's use text-sm */}
          <p className="text-sm">{title}</p>
        </div>
        {loading ? (
          <>
            <ShadcnSkeleton className="h-8 w-3/4 mt-1 mb-2" /> 
            {/* <ShadcnSkeleton className="h-4 w-1/2" /> Placeholder if there was a change/subtitle line */}
          </>
        ) : (
          <p className="text-2xl font-bold text-foreground truncate">
            {value}
          </p>
        )}
      </div>
      {/* {change && !loading && ( // Example of how 'change' could be rendered
        <p className={`text-sm mt-1 ${changeColorClass || ''}`}>{change}</p>
      )} */}
    </div>
  );
};

const TopStatsBar: React.FC<TopStatsBarProps> = ({ loading = false }) => {
  const stats = [
    { title: "Shares Submitted", value: "208,450" },
    { title: "Stale Shares", value: "756" },
    { title: "Pool Hashrate", value: "98.3 PH/s" },
    { title: "Recent Blocks Won", value: "34" },
  ];

  return (
    <div className="mb-6"> {/* Was Box sx={{ mb: 3 }} -> mb-6 (24px) or mb-8 (32px) */}
      {/* Replaced Stack with a responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            loading={loading}
            // icon={<SomeLucideIcon className="h-4 w-4" />} // Example if icons were used
          />
        ))}
      </div>
    </div>
  );
};

export default TopStatsBar;
