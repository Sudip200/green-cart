import React, { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from "recharts";
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  MapPin, 
  Package, 
  Sun, 
  Moon, 
  LogOut,
  TrendingUp,
  Clock,
  DollarSign,
  AlertCircle,
  type LucideIcon
} from "lucide-react";

interface Driver {
  name: string;
  shift_hours: number;
  past_week_hours: string;
  status: 'Active' | 'Break' | 'Offline';
  rating: number;
}

interface Route {
  route_id: number;
  distance_km: number;
  traffic_level: 'High' | 'Medium' | 'Low';
  base_time_min: number;
  popularity: number;
}

interface Order {
  order_id: number;
  value_rs: number;
  route_id: number;
  delivery_time: string;
  status: 'Delivered' | 'In Transit' | 'Delayed';
  customer: string;
}

interface User {
  name: string;
  role: string;
}
interface KPIData {
  totalProfit: number;
  efficiency: number;
  onTime: number;
  late: number;
  fuelCostBreakdown: { name: string; cost: number }[];
  weeklyData: { day: string; orders: number; revenue: number }[];
  totalOrders: number;
  averageOrderValue: number;
}

interface CardProps {
  title: string;
  value: string | number;
  color?: string;
  icon?: LucideIcon;
  trend?: string;
}

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

interface TableProps {
  title: string;
  data: Record<string, any>[];
  columns?: string[];
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

interface HeaderProps {
  toggleSidebar: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}



interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
}


const Table: React.FC<TableProps> = ({ title, data, columns }) => {
  const tableColumns = columns || Object.keys(data[0] || {});
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {tableColumns.map((key) => (
                <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {key.replace('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                {tableColumns.map((key, i) => (
                  <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {key === 'status' ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row[key] === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        row[key] === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        row[key] === 'Break' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        row[key] === 'In Transit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        row[key] === 'Delayed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {row[key]}
                      </span>
                    ) : key === 'traffic_level' ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row[key] === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        row[key] === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {row[key]}
                      </span>
                    ) : key === 'value_rs' ? (
                      `₹${row[key]}`
                    ) : (
                      row[key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Table;