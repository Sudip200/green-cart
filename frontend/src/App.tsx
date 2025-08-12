import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
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
  type LucideIcon
} from "lucide-react";
import LoginPage from "./components/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DriversPage from "./pages/DriversPage";
import RoutesPage from "./pages/Routes";
import OrdersPage from "./pages/Orders";


interface Route {
  route_id: number;
  distance_km: number;
  traffic_level: 'High' | 'Medium' | 'Low';
  base_time_min: number;
  popularity: number;
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




interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
}



const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  
  const menuItems: MenuItem[] = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/drivers", label: "Drivers", icon: Users },
    { path: "/routes", label: "Routes", icon: MapPin },
    { path: "/orders", label: "Orders", icon: Package },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}
      <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-64`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">DeliveryHub</h1>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-sm">{darkMode ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => (
  <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
    <div className="flex items-center">
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Delivery Management Dashboard
      </h2>
    </div>
  </header>
);

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleSidebar = (): void => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = (): void => setDarkMode(!darkMode);

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        <div className="lg:ml-64 flex flex-col min-h-screen">
          <Header toggleSidebar={toggleSidebar} />
          
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;