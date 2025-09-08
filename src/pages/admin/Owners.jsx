import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Eye } from 'lucide-react';

const AdminOwners = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('authToken');
        const base = import.meta.env.VITE_API_URL || 'http://localhost:4002/api';
        const res = await fetch(`${base}/user/users`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to fetch users');
        const ownersOnly = (data?.data || []).filter(u => u.role === 3).map(u => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          kycStatus: u.kycStatus || 'not_submitted',
          govtIdFrontUrl: u.govtIdFrontUrl || null,
          govtIdBackUrl: u.govtIdBackUrl || null,
          isVerified: !!u.isVerified,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        }));
        setItems(ownersOnly);
      } catch (e) {
        setError(e.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  const filtered = useMemo(() => items.filter(o =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [items, searchTerm]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Room Owners</h1>
            <p className="text-gray-600 mt-1">Manage all property owners</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{filtered.length} owners</span>
          </div>
        </div>

        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search owners..." className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
            </div>
          </div>
          {loading && <div className="mt-3 text-sm text-gray-600">Loading owners…</div>}
          {error && !loading && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </motion.div>

        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="hidden lg:block overflow-x-auto overflow-y-auto max-h-[60vh]">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left w-1/4">Owner</th>
                  <th className="px-6 py-3 text-left w-1/4">Email</th>
                  <th className="px-6 py-3 text-left w-24">KYC</th>
                  <th className="px-6 py-3 text-left w-32">Email Verified</th>
                  <th className="px-6 py-3 text-left w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 truncate">{o.name}</td>
                    <td className="px-6 py-3 truncate flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{o.email}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${o.kycStatus==='approved'?'bg-green-100 text-green-800':o.kycStatus==='rejected'?'bg-red-100 text-red-800':o.kycStatus==='pending'?'bg-yellow-100 text-yellow-800':'bg-gray-100 text-gray-800'}`}>{String(o.kycStatus).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-3">{o.isVerified? 'Yes':'No'}</td>
                    <td className="px-6 py-3">
                      <button onClick={()=>{setSelected(o);setDetailsOpen(true);}} className="inline-flex items-center px-2 py-1 text-xs border rounded-md hover:bg-gray-50"><Eye className="w-4 h-4 mr-1"/>Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:hidden p-4 space-y-3">
            {filtered.map((o)=> (
              <div key={o._id} className="border rounded-lg p-3">
                <div className="font-semibold">{o.name}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2"><Mail className="w-4 h-4" />{o.email}</div>
                <div className="mt-2"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${o.kycStatus==='approved'?'bg-green-100 text-green-800':o.kycStatus==='rejected'?'bg-red-100 text-red-800':o.kycStatus==='pending'?'bg-yellow-100 text-yellow-800':'bg-gray-100 text-gray-800'}`}>{String(o.kycStatus).toUpperCase()}</span></div>
                <button onClick={()=>{setSelected(o);setDetailsOpen(true);}} className="mt-2 inline-flex items-center px-2 py-1 text-xs border rounded-md">View</button>
              </div>
            ))}
          </div>
        </motion.div>

        {detailsOpen && selected && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="text-sm font-semibold text-gray-900">Owner Details</div>
                <button onClick={()=>setDetailsOpen(false)} className="px-2 py-1 text-gray-500 hover:text-gray-700 text-sm">Close</button>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="font-medium text-gray-900">{selected.name}</div>
                <div className="text-gray-700 flex items-center gap-2"><Mail className="w-4 h-4" /> {selected.email}</div>
                <div>KYC: <span className="font-medium">{String(selected.kycStatus).toUpperCase()}</span></div>
                {(selected.govtIdFrontUrl || selected.govtIdBackUrl) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {selected.govtIdFrontUrl && <img src={selected.govtIdFrontUrl} alt="Front" className="w-full h-40 object-cover rounded border" />}
                    {selected.govtIdBackUrl && <img src={selected.govtIdBackUrl} alt="Back" className="w-full h-40 object-cover rounded border" />}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOwners;


