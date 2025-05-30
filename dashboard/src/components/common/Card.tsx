import React, { ReactNode } from 'react';
import {
  Card as ShadcnUICard, // Aliasing the import to avoid conflict with the component name
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '~/components/ui/card';

interface CardProps { // Keeping original interface name
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  accentColor?: string;
  headerExtra?: ReactNode;
  className?: string;
}

/**
 * A reusable card component migrated to shadcn/ui Card and Tailwind CSS.
 * The component itself is named Card, matching its filename.
 */
const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  accentColor,
  headerExtra,
  className = '',
}) => {
  return (
    <div className={`relative h-full overflow-hidden ${className}`}>
      {accentColor && (
        <div
          style={{ backgroundColor: accentColor }}
          className="absolute top-0 left-0 h-full w-1 z-10" // w-1 is 4px. z-10 to be above card's potential bg
        />
      )}
      {/* Apply pl-2 to the card if accent is present, to visually shift content away from the accent line.
          w-1 (4px) + pl-2 (8px) = 12px total indent for content from very edge.
          The accent line is overlaid on top of the card's border/edge.
      */}
      <ShadcnUICard className={`h-full ${accentColor ? 'pl-2' : ''}`}>
        {(title || subtitle || headerExtra) && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b px-6 py-4">
            <div className="space-y-1">
              {title && (
                <CardTitle className="text-base font-semibold">
                  {title}
                </CardTitle>
              )}
              {subtitle && (
                <CardDescription className="text-xs text-muted-foreground"> {/* Added text-muted-foreground as per typical CardDescription styling */}
                  {subtitle}
                </CardDescription>
              )}
            </div>
            {headerExtra && <div>{headerExtra}</div>}
          </CardHeader>
        )}
        <CardContent className="p-0">
          {children}
        </CardContent>
      </ShadcnUICard>
    </div>
  );
};

export default Card;
