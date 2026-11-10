import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'dark' | 'light' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  withArrow?: boolean;
  href?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'dark',
  size = 'md',
  withArrow = true,
  href,
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-sans uppercase font-medium tracking-wider rounded-full transition-all duration-300 relative overflow-hidden group select-none cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-5 py-2.5 gap-2',
    md: 'text-xs md:text-sm px-7 py-3.5 gap-2.5',
    lg: 'text-sm md:text-base px-8 py-4 gap-3',
  };

  const variantClasses = {
    dark: 'bg-navy text-white hover:bg-accent hover:text-white border border-navy/20 shadow-sm',
    light: 'bg-white text-navy hover:bg-surface-pale hover:border-accent/50 border border-border-blue shadow-sm',
    accent: 'bg-accent text-white hover:bg-accent-strong border border-accent shadow-sm',
    outline: 'bg-transparent text-navy border border-border-blue hover:bg-surface-light hover:border-accent hover:text-accent',
  };

  const content = (
    <>
      <span className="relative z-10 font-semibold">{children}</span>
      {withArrow && (
        <span className="relative z-10 w-5 h-5 rounded-full bg-white/20 group-hover:bg-white text-current group-hover:text-accent-strong flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300" />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {content}
    </motion.button>
  );
};
