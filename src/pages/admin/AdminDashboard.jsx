import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { User, Home, Settings, LogOut, BarChart3, Users } from "lucide-react";

const dataUsers = [
  { name: 'Jan', users: 120 },
  { name: 'Feb', users: 200 },
  { name: 'Mar', users: 150 },
  { name: 'Apr', users: 278 },
  { name: 'May', users: 189 },
  { name: 'Jun', users: 239 },
  { name: 'Jul', users: 349 },
];
const dataProperties = [
  { name: 'Jan', properties: 30 },
  { name: 'Feb', properties: 45 },
  { name: 'Mar', properties: 60 },
  { name: 'Apr', properties: 80 },
  { name: 'May', properties: 65 },
  { name: 'Jun', properties: 90 },
  { name: 'Jul', properties: 120 },
];

const sidebarLinks = [
  { name: 'Dashboard', icon: BarChart3 },
  { name: 'Users', icon: Users },
  { name: 'Properties', icon: Home },
  { name: 'Settings', icon: Settings },
  { name: 'Logout', icon: LogOut },
];

const AdminDashboard = () => (
  <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-stone-100">
    {/* Sidebar */}
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4 shadow-lg">
      <div className="flex items-center mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-400 to-red-700 rounded-xl flex items-center justify-center shadow-lg mr-3">
          <span className="text-white font-bold text-xl">L</span>
        </div>
        <span className="text-xl font-bold text-gray-900">Lyvo+ Admin</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {sidebarLinks.map((link) => (
            <li key={link.name}>
              <a href="#" className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all">
                <link.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-10 text-xs text-gray-400 text-center">&copy; {new Date().getFullYear()} Lyvo</div>
    </aside>

    {/* Main Content */}
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Topbar */}
      <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome, Admin! Manage your platform here.</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Admin</span>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-orange-400 to-red-700 flex items-center justify-center text-white font-bold text-lg shadow">A</div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <Users className="w-8 h-8 text-red-500 mb-2" />
          <div className="text-2xl font-bold">1,245</div>
          <div className="text-gray-500 text-sm">Total Users</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <Home className="w-8 h-8 text-orange-500 mb-2" />
          <div className="text-2xl font-bold">320</div>
          <div className="text-gray-500 text-sm">Properties Listed</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <BarChart3 className="w-8 h-8 text-red-400 mb-2" />
          <div className="text-2xl font-bold">$12,400</div>
          <div className="text-gray-500 text-sm">Revenue</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 pb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dataUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Properties Listed</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataProperties}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="properties" fill="#fb923c" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;