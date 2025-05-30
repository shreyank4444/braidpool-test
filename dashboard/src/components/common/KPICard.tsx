import React from 'react';
import {
  Card as ShadcnUICard,
  CardContent,
} from '~/components/ui/card';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '~/components/ui/tooltip';
import { TrendingUp, TrendingDown, Info, Loader2 } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  subtitle?: string;
  loading?: boolean;
  info?: string;
  icon?: React.ReactNode; // This prop was in the original but not used in its JSX. Retaining for API compatibility.
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  change,
  subtitle,
  loading = false,
  info,
  icon, // Retained
  className = '',
}) => {
  const renderTrend = () => {
    if (change === undefined || change === null) return null;

    const isPositive = change >= 0;
    const colorClass = isPositive ? "text-braidpoolSuccess" : "text-braidpoolError"; // Using custom Tailwind colors
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
      <div className={`flex items-center mt-1 ${colorClass}`}>
        <TrendIcon className="h-4 w-4 mr-1" />
        <span className="text-sm">
          {Math.abs(change)}% {isPositive ? 'increase' : 'decrease'}
        </span>
      </div>
    );
  };

  return (
    <ShadcnUICard
      className={`p-4 flex flex-col h-full min-h-[90px] bg-card text-card-foreground shadow-sm rounded-lg border relative ${className}`}
    >
      {/* Info icon using shadcn/ui Tooltip */}
      {info && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help opacity-60 absolute top-2 right-2" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{info}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-muted-foreground uppercase text-center mb-1">
          {subtitle}
        </p>
      )}

      {/* Value section */}
      <div className="flex-grow flex flex-col items-center justify-center"> {/* Centering content vertically */}
        {loading ? (
          <Loader2 className="h-8 w-8 text-primary my-1 animate-spin" /> // Increased size for visibility
        ) : (
          <div className="flex justify-center items-end mb-1">
            <h3 className="text-2xl font-bold text-center">{value}</h3>
            {unit && (
              <span className="text-sm text-muted-foreground ml-1 mb-0.5">
                {unit}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Title below the value */}
      <p className="text-center text-xs text-muted-foreground font-normal mt-1">
        {title}
      </p>

      {/* Trend indicator at bottom */}
      <div className="flex justify-center mt-auto pt-1"> {/* pt-1 to give some space before trend */}
        {renderTrend()}
      </div>
    </ShadcnUICard>
  );
};

export default KPICard;
