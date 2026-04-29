import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const positionClasses = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowClasses = {
  top:    'top-full left-1/2 -translate-x-1/2 border-t-bg-elevated',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-bg-elevated',
  left:   'left-full top-1/2 -translate-y-1/2 border-l-bg-elevated',
  right:  'right-full top-1/2 -translate-y-1/2 border-r-bg-elevated',
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className,
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), 300);
  };
  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.12 }}
            className={clsx(
              'absolute z-50 pointer-events-none',
              positionClasses[position]
            )}
          >
            <div
              className={clsx(
                'glass-elevated rounded-md px-2.5 py-1.5',
                'text-xs text-white/80 font-medium',
                'whitespace-nowrap border border-white/10',
                'shadow-[0_4px_16px_rgba(0,0,0,0.4)]',
                className
              )}
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
