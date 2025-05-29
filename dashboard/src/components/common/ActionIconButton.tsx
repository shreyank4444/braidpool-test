import React, { ReactElement, ButtonHTMLAttributes } from 'react';

interface ActionIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactElement; // icon prop is still declared but not specially handled in this version
}

const ActionIconButton: React.FC<ActionIconButtonProps> = ({ 
  icon,       // Destructured but only icon is used directly in JSX below
  className,  // Destructured to be passed to button
  onClick,    // Destructured to be passed to button
  disabled    // Example of another common prop from ButtonHTMLAttributes
  // ...props is NOT used to minimize variables
}) => {
  // All complex cn logic and base styles are removed for this test.
  // All other ButtonHTMLAttributes (like title, aria-label etc.) are ignored.
  return (
    <button
      type="button"
      className={className} // Directly use the className passed in props.
      onClick={onClick}
      disabled={disabled}
    >
      {icon} {/* Render the icon directly, without cloning or adding classes to it. */}
    </button>
  );
};

export default ActionIconButton;
