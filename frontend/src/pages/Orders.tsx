import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Clock, TrendingUp, AlertCircle } from "lucide-react";
import Card from "../components/Card";
import Table from "../components/Table";
import { useAuth } from "../context/AuthContext";

interface Route {
  id: number;
  routeId: number;
  distanceKm: number;
  trafficLevel: string;
  baseTimeMin: number;
  popularity: number;
}

interface Order {
  id: number;
  orderId: number;
  valueRs: number;
  routeId: number;
  deliveryTime: string;
  status: "Delivered" | "In Transit" | "Delayed";
  customer: string;
  route?: Route;
}

const OrdersPage: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading orders...</div>;
  }

  const totalOrders = orders.length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const inTransit = orders.filter((o) => o.status === "In Transit").length;
  const delayed = orders.filter((o) => o.status === "Delayed").length;

  // Transform for table if you want flattened route info
  const tableData = orders.map((o) => ({
    orderId: o.orderId,
    customer: o.customer,
    valueRs: o.valueRs,
    routeId: o.routeId ?? o.route?.routeId ?? "",
    deliveryTime: o.deliveryTime,
    status: o.status,
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card title="Total Orders" value={totalOrders} color="text-blue-600" icon={Package} />
        <Card title="Delivered" value={delivered} color="text-green-600" icon={Clock} />
        <Card title="In Transit" value={inTransit} color="text-yellow-600" icon={TrendingUp} />
        <Card title="Delayed" value={delayed} color="text-red-600" icon={AlertCircle} />
      </div>

      {/* Orders Table */}
      <Table
        title="Order Management"
        data={tableData}
        columns={["orderId", "customer", "valueRs", "routeId", "deliveryTime", "status"]}
      />
    </div>
  );
};

export default OrdersPage;
