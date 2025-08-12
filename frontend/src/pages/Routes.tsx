import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, AlertCircle, TrendingUp } from "lucide-react";
import Card from "../components/Card";
import Table from "../components/Table";
import { useAuth } from "../context/AuthContext";

interface Route {
  id: number;
  routeId: number;
  distanceKm: number;
  trafficLevel: "High" | "Medium" | "Low";
  baseTimeMin: number;
  popularity: number;
  orders?: any[];
}

const RoutesPage: React.FC = () => {
  const { token } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/routes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoutes(res.data);
      } catch (err) {
        console.error("Error fetching routes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, [token]);

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading routes...</div>;
  }

  const totalRoutes = routes.length;
  const highTraffic = routes.filter((r) => r.trafficLevel === "High").length;
  const avgDistance = totalRoutes
    ? (routes.reduce((sum, r) => sum + r.distanceKm, 0) / totalRoutes).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Total Routes" value={totalRoutes} color="text-blue-600" icon={MapPin} />
        <Card title="High Traffic" value={highTraffic} color="text-red-600" icon={AlertCircle} />
        <Card title="Avg Distance" value={`${avgDistance} km`} color="text-green-600" icon={TrendingUp} />
      </div>

      {/* Routes Table */}
      <Table
        title="Route Management"
        data={routes}
        columns={["routeId", "distanceKm", "trafficLevel", "baseTimeMin", "popularity"]}
      />
    </div>
  );
};

export default RoutesPage;
