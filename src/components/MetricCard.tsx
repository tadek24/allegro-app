import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  trend?: string;
  isPositive?: boolean;
}

export default function MetricCard({ title, value, icon, trend, isPositive }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-brand-blue">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {title}
      </span>
      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 z-10">
        {value}
      </span>
      {trend && (
        <div className={`mt-2 text-xs font-medium ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {trend}
        </div>
      )}
    </div>
  );
}
