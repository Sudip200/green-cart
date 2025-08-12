import React, {  } from "react";
import { 
  type LucideIcon
} from "lucide-react";




interface CardProps {
  title: string;
  value: string | number;
  color?: string;
  icon?: LucideIcon;
  trend?: string;
}










const Card: React.FC<CardProps> = ({ title, value, color, icon: Icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className={`text-2xl font-bold ${color || "text-gray-900 dark:text-white"}`}>{value}</p>
        {trend && (
          <p className="text-xs text-green-500 mt-1">
            +{trend}% from last week
          </p>
        )}
      </div>
      {Icon && (
        <div className={`p-3 rounded-full ${color?.includes('green') ? 'bg-green-100 dark:bg-green-900/30' : 
          color?.includes('blue') ? 'bg-blue-100 dark:bg-blue-900/30' : 
          color?.includes('red') ? 'bg-red-100 dark:bg-red-900/30' : 
          'bg-gray-100 dark:bg-gray-700'}`}>
          <Icon className={`w-6 h-6 ${color || "text-gray-600"}`} />
        </div>
      )}
    </div>
  </div>
);

export default Card;