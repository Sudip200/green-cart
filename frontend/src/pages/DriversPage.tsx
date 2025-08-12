import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, Clock, Users } from "lucide-react";
import Card from "../components/Card";
import Table from "../components/Table";
import { useAuth } from "../context/AuthContext";

interface Driver {
  id: number;
  name: string;
  shiftHours: number;
  pastWeekHours: string;
  status: "Active" | "Break" | "Offline";
  rating: number;
}

const DriversPage: React.FC = () => {
  const { token } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/drivers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDrivers(res.data);
      } catch (err) {
        console.error("Error fetching drivers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, [token]);

  const activeCount = drivers.filter((d) => d.status === "Active").length;
  const breakCount = drivers.filter((d) => d.status === "Break").length;
  const offlineCount = drivers.filter((d) => d.status === "Offline").length;

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading drivers...</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Active Drivers" value={activeCount} color="text-green-600" icon={Users} />
        <Card title="On Break" value={breakCount} color="text-yellow-600" icon={Clock} />
        <Card title="Offline" value={offlineCount} color="text-red-600" icon={AlertCircle} />
      </div>

      {/* Drivers Table */}
      <Table
        title="Driver Management"
        data={drivers}
        columns={["name", "shiftHours", "status", "rating", "pastWeekHours"]}
      />
    </div>
  );
};

export default DriversPage;
