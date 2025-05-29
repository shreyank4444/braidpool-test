import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Info, Loader2 } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  subtitle?: string;
  loading?: boolean;
  info?: string;
  icon?: React.ReactNode; // Kept as per instruction
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  change,
  subtitle,
  loading = false,
  info,
  // icon, // icon prop is not used in the new structure
}) => {
  const renderTrend = () => {
    if (change === undefined) return null;
    const isPositive = change >= 0;
    // Using text-green-600 and text-red-600 as direct Tailwind classes
    const trendColorClass = isPositive ? 'text-green-600' : 'text-red-600';
    const Icon = isPositive ? TrendingUp : TrendingDown;

    return (
      <div className={`flex items-center mt-0.5 ${trendColorClass}`}>
        <Icon className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">
          {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-card text-foreground p-4 flex flex-col h-full min-h-[120px] shadow-sm rounded-lg border border-border relative">
      {/* Subtitle first (if provided) */}
      {subtitle && (
        <p className="text-xs text-muted-foreground uppercase text-center mb-1">{subtitle}</p>
      )}

      {/* Value section with large font */}
      <div className="flex flex-col justify-center items-center mb-1 flex-grow">
        {loading ? (
          <Loader2 className="h-8 w-8 text-primary animate-spin my-1" />
        ) : (
          <div className="flex items-end justify-center">
            <p className="text-3xl font-bold text-center text-foreground leading-none">{value}</p>
            {unit && (
              <span className="text-sm text-muted-foreground ml-1 mb-0.5 self-end">{unit}</span>
            )}
          </div>
        )}
      </div>

      {/* Title below the value */}
      <p className="text-center text-xs font-normal text-muted-foreground mt-1">{title}</p>

      {/* Trend indicator at bottom */}
      <div className="flex justify-center items-center mt-auto pt-1 h-6">
        {renderTrend()}
      </div>

      {/* Info icon if needed */}
      {info && (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 absolute top-2 right-2 text-muted-foreground cursor-help opacity-70 hover:opacity-100" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{info}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default KPICard;
