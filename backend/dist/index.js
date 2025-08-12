"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Auth Middleware
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "No token provided" });
    try {
        req.user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid token" });
    }
};
// Seed data (from frontend arrays)
const seedData = {
    drivers: [
        { name: "Amit", shiftHours: 6, pastWeekHours: "6|8|7|7|7|6|10", status: "Active", rating: 4.8 },
        { name: "Priya", shiftHours: 6, pastWeekHours: "10|9|6|6|6|7|7", status: "Active", rating: 4.9 },
        { name: "Rohit", shiftHours: 10, pastWeekHours: "10|6|10|7|10|9|7", status: "Break", rating: 4.7 },
        { name: "Neha", shiftHours: 9, pastWeekHours: "10|8|6|7|9|8|8", status: "Active", rating: 4.8 },
        { name: "Karan", shiftHours: 7, pastWeekHours: "7|8|6|6|9|6|8", status: "Offline", rating: 4.6 },
        { name: "Sneha", shiftHours: 8, pastWeekHours: "10|8|6|9|10|6|9", status: "Active", rating: 4.9 },
        { name: "Vikram", shiftHours: 6, pastWeekHours: "10|8|10|8|10|7|6", status: "Active", rating: 4.7 },
        { name: "Anjali", shiftHours: 6, pastWeekHours: "7|8|6|7|6|9|8", status: "Break", rating: 4.8 },
        { name: "Manoj", shiftHours: 9, pastWeekHours: "8|7|8|8|7|8|6", status: "Active", rating: 4.5 },
        { name: "Pooja", shiftHours: 10, pastWeekHours: "7|10|7|7|9|9|8", status: "Active", rating: 4.9 }
    ],
    routes: [
        { routeId: 1, distanceKm: 25, trafficLevel: "High", baseTimeMin: 125, popularity: 85 },
        { routeId: 2, distanceKm: 12, trafficLevel: "High", baseTimeMin: 48, popularity: 92 },
        { routeId: 3, distanceKm: 6, trafficLevel: "Low", baseTimeMin: 18, popularity: 78 },
        { routeId: 4, distanceKm: 15, trafficLevel: "Medium", baseTimeMin: 60, popularity: 88 },
        { routeId: 5, distanceKm: 7, trafficLevel: "Low", baseTimeMin: 35, popularity: 75 },
        { routeId: 6, distanceKm: 15, trafficLevel: "Low", baseTimeMin: 75, popularity: 82 },
        { routeId: 7, distanceKm: 20, trafficLevel: "Medium", baseTimeMin: 100, popularity: 90 },
        { routeId: 8, distanceKm: 19, trafficLevel: "Low", baseTimeMin: 76, popularity: 77 },
        { routeId: 9, distanceKm: 9, trafficLevel: "Low", baseTimeMin: 45, popularity: 85 },
        { routeId: 10, distanceKm: 22, trafficLevel: "High", baseTimeMin: 88, popularity: 79 }
    ],
    orders: [
        { orderId: 1, valueRs: 2594, routeId: 7, deliveryTime: "02:07", status: "Delivered", customer: "Raj Kumar" },
        { orderId: 2, valueRs: 1835, routeId: 6, deliveryTime: "01:19", status: "Delivered", customer: "Anjali Sharma" },
        { orderId: 3, valueRs: 766, routeId: 9, deliveryTime: "01:06", status: "Delivered", customer: "Vikram Singh" },
        { orderId: 4, valueRs: 572, routeId: 1, deliveryTime: "02:02", status: "Delayed", customer: "Priya Patel" },
        { orderId: 5, valueRs: 826, routeId: 3, deliveryTime: "00:35", status: "Delivered", customer: "Rohit Gupta" },
        { orderId: 6, valueRs: 2642, routeId: 2, deliveryTime: "01:02", status: "Delivered", customer: "Neha Agarwal" },
        { orderId: 7, valueRs: 1200, routeId: 4, deliveryTime: "01:15", status: "In Transit", customer: "Amit Joshi" },
        { orderId: 8, valueRs: 950, routeId: 5, deliveryTime: "00:45", status: "Delivered", customer: "Sneha Reddy" },
        { orderId: 9, valueRs: 1800, routeId: 8, deliveryTime: "01:30", status: "Delivered", customer: "Karan Mehta" },
        { orderId: 10, valueRs: 650, routeId: 10, deliveryTime: "02:15", status: "Delayed", customer: "Pooja Nair" }
    ]
};
// Seed function
async function seedDatabase() {
    try {
        console.log("🌱 Starting database seeding...");
        // Clear existing data
        await prisma.order.deleteMany({});
        await prisma.route.deleteMany({});
        await prisma.driver.deleteMany({});
        await prisma.user.deleteMany({});
        // Create admin user
        const hashedPassword = await bcrypt_1.default.hash("password", 10);
        await prisma.user.create({
            data: {
                username: "admin",
                password: hashedPassword,
                role: "Manager"
            }
        });
        // Seed drivers
        for (const driver of seedData.drivers) {
            await prisma.driver.create({
                data: {
                    name: driver.name,
                    shiftHours: driver.shiftHours,
                    pastWeekHours: driver.pastWeekHours,
                    status: driver.status,
                    rating: driver.rating
                }
            });
        }
        // Seed routes
        for (const route of seedData.routes) {
            await prisma.route.create({
                data: {
                    routeId: route.routeId,
                    distanceKm: route.distanceKm,
                    trafficLevel: route.trafficLevel,
                    baseTimeMin: route.baseTimeMin,
                    popularity: route.popularity
                }
            });
        }
        // Seed orders
        for (const order of seedData.orders) {
            await prisma.order.create({
                data: {
                    orderId: order.orderId,
                    valueRs: order.valueRs,
                    routeId: order.routeId,
                    deliveryTime: order.deliveryTime,
                    status: order.status,
                    customer: order.customer
                }
            });
        }
        console.log("✅ Database seeding completed successfully!");
    }
    catch (error) {
        console.error("❌ Error seeding database:", error);
        throw error;
    }
}
// Auth Routes
app.post("/api/register", async (req, res) => {
    try {
        const { username, password, role = "User" } = req.body;
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role
            }
        });
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const { password: _, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});
// Driver Routes
app.get("/api/drivers", auth, async (req, res) => {
    try {
        const drivers = await prisma.driver.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(drivers);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching drivers", error });
    }
});
app.post("/api/drivers", auth, async (req, res) => {
    try {
        const driver = await prisma.driver.create({ data: req.body });
        res.status(201).json(driver);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating driver", error });
    }
});
app.put("/api/drivers/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await prisma.driver.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(driver);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating driver", error });
    }
});
app.delete("/api/drivers/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.driver.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Driver deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting driver", error });
    }
});
// Route Routes
app.get("/api/routes", auth, async (req, res) => {
    try {
        const routes = await prisma.route.findMany({
            include: {
                orders: true
            },
            orderBy: { routeId: 'asc' }
        });
        res.json(routes);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching routes", error });
    }
});
app.post("/api/routes", auth, async (req, res) => {
    try {
        const route = await prisma.route.create({ data: req.body });
        res.status(201).json(route);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating route", error });
    }
});
app.put("/api/routes/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const route = await prisma.route.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(route);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating route", error });
    }
});
app.delete("/api/routes/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.route.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Route deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting route", error });
    }
});
// Order Routes
app.get("/api/orders", auth, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                route: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});
app.post("/api/orders", auth, async (req, res) => {
    try {
        const order = await prisma.order.create({ data: req.body });
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating order", error });
    }
});
app.put("/api/orders/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
});
app.delete("/api/orders/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.order.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Order deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting order", error });
    }
});
// Dashboard Analytics Routes
app.get("/api/dashboard/stats", auth, async (req, res) => {
    try {
        const totalDrivers = await prisma.driver.count();
        const activeDrivers = await prisma.driver.count({ where: { status: 'Active' } });
        const totalOrders = await prisma.order.count();
        const deliveredOrders = await prisma.order.count({ where: { status: 'Delivered' } });
        const totalRoutes = await prisma.route.count();
        // Calculate total revenue
        const orders = await prisma.order.findMany();
        const totalRevenue = orders.reduce((sum, order) => sum + order.valueRs, 0);
        // Calculate efficiency
        const efficiency = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;
        const stats = {
            totalDrivers,
            activeDrivers,
            totalOrders,
            deliveredOrders,
            totalRoutes,
            totalRevenue,
            efficiency: Math.round(efficiency * 10) / 10
        };
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats", error });
    }
});
app.get("/api/dashboard/kpis", auth, async (req, res) => {
    try {
        const routes = await prisma.route.findMany();
        const orders = await prisma.order.findMany({
            include: { route: true }
        });
        let totalProfit = 0;
        let onTime = 0;
        let late = 0;
        const fuelCostBreakdown = [];
        orders.forEach((order) => {
            if (!order.route)
                return;
            let penalty = 0;
            let bonus = 0;
            const deliveryMins = parseInt(order.deliveryTime.split(":")[0]) * 60 + parseInt(order.deliveryTime.split(":")[1]);
            if (deliveryMins > order.route.baseTimeMin + 10) {
                penalty = 50;
                late++;
            }
            else {
                onTime++;
            }
            if (order.valueRs > 1000 && penalty === 0) {
                bonus = order.valueRs * 0.1;
            }
            let fuelCost = order.route.distanceKm * 5;
            if (order.route.trafficLevel === "High") {
                fuelCost += order.route.distanceKm * 2;
            }
            fuelCostBreakdown.push({ name: `Route ${order.route.routeId}`, cost: fuelCost });
            totalProfit += order.valueRs + bonus - penalty - fuelCost;
        });
        // Generate weekly data (mock data for demo)
        const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
            day,
            orders: Math.floor(Math.random() * 20) + 10,
            revenue: Math.floor(Math.random() * 5000) + 2000
        }));
        const kpis = {
            totalProfit: Math.round(totalProfit),
            efficiency: (onTime / (onTime + late)) * 100,
            onTime,
            late,
            fuelCostBreakdown,
            weeklyData,
            totalOrders: orders.length,
            averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.valueRs, 0) / orders.length : 0
        };
        res.json(kpis);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching KPIs", error });
    }
});
// Health check
app.get("/", (req, res) => {
    res.json({
        message: "DeliveryHub Backend API is running!",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString()
    });
});
// Seed endpoint (for development)
app.post("/api/seed", async (req, res) => {
    try {
        await seedDatabase();
        res.json({ message: "Database seeded successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error seeding database", error });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Initialize database and start server
async function startServer() {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully");
        // Auto-seed on startup if no data exists
        const userCount = await prisma.user.count();
        if (userCount === 0) {
            console.log("🌱 No data found, auto-seeding database...");
            await seedDatabase();
        }
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📱 API endpoints available at http://localhost:${PORT}/api`);
            console.log(`🔐 Login credentials: admin / password`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down server...');
    await prisma.$disconnect();
    process.exit(0);
});
startServer();
exports.default = app;
