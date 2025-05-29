import React from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming default shadcn/ui path

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

interface TopStatsBarProps {
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  loading = false,
}) => {
  return (
    <div className="bg-card text-foreground p-4 rounded-lg border border-border h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center mb-1">
        {icon && <div className="mr-2 text-primary">{icon}</div>}
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      {loading ? (
        <Skeleton className="h-10 w-4/5 rounded" />
      ) : (
        <p className="text-2xl font-bold text-foreground truncate">{value}</p>
      )}
    </div>
  );
};

const TopStatsBar: React.FC<TopStatsBarProps> = ({ loading = false }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-6 w-full">
        <div className="w-full sm:w-1/4">
          <StatCard
            title="Shares Submitted"
            value="208,450"
            loading={loading}
            // icon={<SomeIcon />} // Example if an icon was to be passed
          />
        </div>
        <div className="w-full sm:w-1/4">
          <StatCard title="Stale Shares" value="756" loading={loading} />
        </div>
        <div className="w-full sm:w-1/4">
          <StatCard title="Pool Hashrate" value="98.3 PH/s" loading={loading} />
        </div>
        <div className="w-full sm:w-1/4">
          <StatCard title="Recent Blocks Won" value="34" loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default TopStatsBar;
