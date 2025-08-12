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