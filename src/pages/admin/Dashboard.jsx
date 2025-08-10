import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdminLayout from "../../components/admin/AdminLayout";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for charts
  const userGrowthData = [
    { month: "Jan", users: 120, growth: 15 },
    { month: "Feb", users: 180, growth: 25 },
    { month: "Mar", users: 250, growth: 30 },
    { month: "Apr", users: 320, growth: 28 },
    { month: "May", users: 410, growth: 35 },
    { month: "Jun", users: 520, growth: 40 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 15000, bookings: 45 },
    { month: "Feb", revenue: 22000, bookings: 62 },
    { month: "Mar", revenue: 28000, bookings: 78 },
    { month: "Apr", revenue: 35000, bookings: 95 },
    { month: "May", revenue: 42000, bookings: 112 },
    { month: "Jun", revenue: 48000, bookings: 128 },
  ];

  const propertyData = [
    { type: "Apartments", count: 45, percentage: 45 },
    { type: "Houses", count: 28, percentage: 28 },
    { type: "Studios", count: 18, percentage: 18 },
    { type: "Shared", count: 9, percentage: 9 },
  ];

  const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

  const statsCards = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
    },
    {
      title: "Active Properties",
      value: "156",
      change: "+8.2%",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: "Monthly Revenue",
      value: "$48,250",
      change: "+15.3%",
      changeType: "positive",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
    },
    {
      title: "Pending Approvals",
      value: "23",
      change: "-5.1%",
      changeType: "negative",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user_registration",
      message: "New user registered: John Doe",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      type: "property_approval",
      message: "Property approved: Downtown Apartment",
      time: "15 minutes ago",
      status: "success",
    },
    {
      id: 3,
      type: "payment_received",
      message: "Payment received: $1,200",
      time: "1 hour ago",
      status: "success",
    },
    {
      id: 4,
      type: "support_ticket",
      message: "New support ticket: #1234",
      time: "2 hours ago",
      status: "warning",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "reports", label: "Reports", icon: "📋" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 lg:mt-2 text-sm lg:text-base text-gray-600">
              Welcome back! Here's what's happening with your platform today.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2 lg:space-x-3">
            <button className="px-3 lg:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm">
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button className="px-3 lg:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm">
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-xs lg:text-sm font-medium ${
                        card.changeType === "positive" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {card.change}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-500 ml-1 hidden sm:inline">from last month</span>
                  </div>
                </div>
                <div className="p-2 lg:p-3 bg-red-50 rounded-lg text-red-600">
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 lg:space-x-8 px-4 lg:px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 lg:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 lg:p-6">
            {activeTab === "overview" && (
              <div className="space-y-4 lg:space-y-6">
                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* User Growth Chart */}
                  <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                    <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
                      <AreaChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stroke="#ef4444"
                          fill="#fef2f2"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Revenue Chart */}
                  <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Revenue & Bookings</h3>
                    <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" fill="#ef4444" />
                        <Bar yAxisId="right" dataKey="bookings" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Property Distribution */}
                <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Property Distribution</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
                      <PieChart>
                        <Pie
                          data={propertyData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ type, percentage }) => `${type}: ${percentage}%`}
                          outerRadius={60}
                          className="lg:outerRadius={80}"
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {propertyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3">
                      {propertyData.map((property, index) => (
                        <div key={property.type} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 lg:w-4 lg:h-4 rounded-full mr-3"
                              style={{ backgroundColor: COLORS[index] }}
                            ></div>
                            <span className="font-medium text-gray-700 text-sm lg:text-base">{property.type}</span>
                          </div>
                          <span className="text-gray-600 text-sm lg:text-base">{property.count} properties</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-4 lg:space-y-6">
                <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Detailed Analytics</h3>
                  <ResponsiveContainer width="100%" height={300} className="lg:h-[400px]">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="growth"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-4 lg:space-y-6">
                <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                  <div className="space-y-3 lg:space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 lg:p-4 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div
                            className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full mr-3 flex-shrink-0 ${
                              activity.status === "success" ? "bg-green-500" : "bg-yellow-500"
                            }`}
                          ></div>
                          <span className="text-gray-700 text-sm lg:text-base truncate">{activity.message}</span>
                        </div>
                        <span className="text-xs lg:text-sm text-gray-500 ml-2 flex-shrink-0">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <button className="flex items-center justify-center p-3 lg:p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Manage Users
            </button>
            <button className="flex items-center justify-center p-3 lg:p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              View Properties
            </button>
            <button className="flex items-center justify-center p-3 lg:p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Reports
            </button>
            <button className="flex items-center justify-center p-3 lg:p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-sm">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 