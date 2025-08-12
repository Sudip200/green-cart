import React, { type ReactNode } from "react";






interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}









const ChartCard: React.FC<ChartCardProps> = ({ title, children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
    {children}
  </div>
);
export default ChartCard;