import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from "recharts";
import { Package, TrendingUp, Clock, DollarSign } from "lucide-react";
import Card from "../components/Card";
import ChartCard from "../components/ChartCard";
import { useAuth } from "../context/AuthContext";

interface RouteResponse {
  id: number;
  routeId: number;
  distanceKm: number;
  trafficLevel: "High" | "Medium" | "Low";
  baseTimeMin: number;
  popularity: number;
  orders: OrderResponse[];
}

interface OrderResponse {
  id: number;
  orderId: number;
  valueRs: number;
  routeId: number;
  deliveryTime: string;
  status: "Delivered" | "In Transit" | "Delayed";
  customer: string;
  route?: {
    id: number;
    routeId: number;
    distanceKm: number;
    trafficLevel: "High" | "Medium" | "Low";
    baseTimeMin: number;
    popularity: number;
  };
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

function calculateKPIsFromRoutes(routes: RouteResponse[]): KPIData {
  let totalProfit = 0;
  let onTime = 0;
  let late = 0;
  const fuelCostBreakdown: { name: string; cost: number }[] = [];
  const weeklyData: { day: string; orders: number; revenue: number }[] = [];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  days.forEach((day) => {
    weeklyData.push({
      day,
      orders: Math.floor(Math.random() * 20) + 10,
      revenue: Math.floor(Math.random() * 5000) + 2000,
    });
  });

  routes.forEach((route) => {
    route.orders.forEach((order) => {
      let penalty = 0;
      let bonus = 0;

      const deliveryMins =
        parseInt(order.deliveryTime.split(":")[0]) * 60 +
        parseInt(order.deliveryTime.split(":")[1]);

      if (deliveryMins > route.baseTimeMin + 10) {
        penalty = 50;
        late++;
      } else {
        onTime++;
      }

      if (order.valueRs > 1000 && penalty === 0) {
        bonus = order.valueRs * 0.1;
      }

      let fuelCost = route.distanceKm * 5;
      if (route.trafficLevel === "High") fuelCost += route.distanceKm * 2;

      fuelCostBreakdown.push({ name: `Route ${route.routeId}`, cost: fuelCost });
      totalProfit += order.valueRs + bonus - penalty - fuelCost;
    });
  });

  const allOrders = routes.flatMap((r) => r.orders);

  return {
    totalProfit,
    efficiency: (onTime / (onTime + late)) * 100 || 0,
    onTime,
    late,
    fuelCostBreakdown,
    weeklyData,
    totalOrders: allOrders.length,
    averageOrderValue: allOrders.length
      ? allOrders.reduce((sum, o) => sum + o.valueRs, 0) / allOrders.length
      : 0,
  };
}

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [routes, setRoutes] = useState<RouteResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutesWithOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/routes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoutes(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutesWithOrders();
  }, [token]);

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading dashboard...</div>;
  }

  const kpis = calculateKPIsFromRoutes(routes);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Profit" value={`₹${kpis.totalProfit.toFixed(0)}`} color="text-green-600" icon={DollarSign} trend="12.5" />
        <Card title="Efficiency Score" value={`${kpis.efficiency.toFixed(1)}%`} color="text-blue-600" icon={TrendingUp} trend="8.3" />
        <Card title="On-Time Deliveries" value={kpis.onTime.toString()} color="text-green-500" icon={Clock} trend="5.2" />
        <Card title="Total Orders" value={kpis.totalOrders.toString()} color="text-purple-600" icon={Package} trend="15.8" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Weekly Performance">
          <LineChart width={400} height={300} data={kpis.weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Delivery Status Distribution">
          <PieChart width={400} height={300}>
            <Pie
              data={[
                { name: "On Time", value: kpis.onTime },
                { name: "Late", value: kpis.late },
              ]}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {[{ name: "On Time", value: kpis.onTime }, { name: "Late", value: kpis.late }].map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
      </div>

      {/* Fuel Cost Chart */}
      <ChartCard title="Fuel Cost Analysis by Route">
        <BarChart width={800} height={300} data={kpis.fuelCostBreakdown.slice(0, 8)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cost" fill="#8884d8" />
        </BarChart>
      </ChartCard>
    </div>
  );
};

export default Dashboard;
