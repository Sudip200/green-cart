/*
  Warnings:

  - You are about to drop the `Driver` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_routeId_fkey";

-- DropTable
DROP TABLE "public"."Driver";

-- DropTable
DROP TABLE "public"."Order";

-- DropTable
DROP TABLE "public"."Route";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'User',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."drivers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shiftHours" INTEGER NOT NULL,
    "pastWeekHours" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."routes" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "trafficLevel" TEXT NOT NULL,
    "baseTimeMin" INTEGER NOT NULL,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "valueRs" DOUBLE PRECISION NOT NULL,
    "routeId" INTEGER NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "customer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "routes_routeId_key" ON "public"."routes"("routeId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderId_key" ON "public"."orders"("orderId");

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."routes"("routeId") ON DELETE CASCADE ON UPDATE CASCADE;
