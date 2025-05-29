import React, { ReactNode } from 'react';

interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  accentColor?: string; // Default was '#1976d2'
  headerExtra?: ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  accentColor = '#1976d2', // Default from MUI version
  headerExtra,
}) => {
  const cardStyle = accentColor ? { borderLeft: `4px solid ${accentColor}` } : {};

  return (
    <div
      className="bg-card text-foreground rounded-lg border border-border shadow-md h-full overflow-hidden"
      style={cardStyle} // Apply accent color as left border
    >
      {(title || subtitle || headerExtra) && (
        <div className="px-4 py-3 border-b border-border flex justify-between items-center">
          <div>
            {title && (
              <h3 className="text-lg font-medium text-foreground">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {headerExtra && <div>{headerExtra}</div>}
        </div>
      )}
      <div className="p-4">{children}</div> {/* Added padding for content area */}
    </div>
  );
};

export default Card;
