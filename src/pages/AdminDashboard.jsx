import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {ShieldCheck, User, Package, Check, X, Trash2, TrendingUp, IndianRupee, Users, ShoppingBag, PieChart as LucidePieChart, BarChart3 } from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, AreaChart, Area, PieChart, Pie
} from 'recharts';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('overview'); // Changed default to overview

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [prodRes, userRes, orderRes, statsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/products', config),
                axios.get('http://localhost:5000/api/users', config),
                axios.get('http://localhost:5000/api/payment/all-orders', config),
                axios.get('http://localhost:5000/api/stats/admin', config)
            ]);
            setProducts(prodRes.data);
            setUsers(userRes.data);
            setOrders(orderRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/products/${id}/approve`, {}, config);
            fetchData();
        } catch (error) {}
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Delete this product permanently?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/products/${id}`, config);
                fetchData();
            } catch (error) {}
        }
    };

    if (!user || user.role !== 'admin') return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Admin Access Only.</div>;

    return (
        <div className="container" style={{ padding: '40px 1rem' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '40px' }}>
                <ShieldCheck size={40} color="var(--primary)" />
                <h1 style={{ color: 'var(--foreground)' }}>System Administrator Control Panel</h1>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
                <button onClick={() => setView('overview')} className={`btn ${view === 'overview' ? 'btn-primary' : 'btn-outline'}`}>
                    <BarChart3 size={18} /> Overview
                </button>
                <button onClick={() => setView('products')} className={`btn ${view === 'products' ? 'btn-primary' : 'btn-outline'}`}>
                    <Package size={18} /> Manage Products
                </button>
                <button onClick={() => setView('users')} className={`btn ${view === 'users' ? 'btn-primary' : 'btn-outline'}`}>
                    <User size={18} /> Manage Users
                </button>
                <button onClick={() => setView('orders')} className={`btn ${view === 'orders' ? 'btn-primary' : 'btn-outline'}`}>
                    <ShoppingBag size={18} /> Manage Orders
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading administrative data...</div>
            ) : view === 'overview' ? (
                <div className="fade-in">
                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        <div className="card">
                             <div style={{ color: 'var(--primary)', marginBottom: '10px' }}><Users size={24} /></div>
                             <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Total Platform Users</p>
                             <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats?.totalUsers || 0}</h2>
                        </div>
                        <div className="card">
                             <div style={{ color: 'var(--brand-blue)', marginBottom: '10px' }}><ShieldCheck size={24} /></div>
                             <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Active Sellers</p>
                             <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats?.totalSellers || 0}</h2>
                        </div>
                        <div className="card">
                             <div style={{ color: 'var(--success)', marginBottom: '10px' }}><IndianRupee size={24} /></div>
                             <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Total Platform Revenue</p>
                             <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</h2>
                        </div>
                        <div className="card">
                             <div style={{ color: 'var(--warning)', marginBottom: '10px' }}><TrendingUp size={24} /></div>
                             <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>Admin Net Profit (10%)</p>
                             <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{stats?.totalProfit?.toFixed(2) || '0.00'}</h2>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginBottom: '20px', fontWeight: 700 }}>Platform Revenue Trend</h3>
                            <div style={{ flex: 1, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={stats?.salesByMonth?.map(item => ({
                                            name: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][item._id.month],
                                            sales: item.totalSales,
                                        })) || []}
                                    >
                                        <defs>
                                            <linearGradient id="colorAdminSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--secondary)', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--secondary)', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                        />
                                        <Area type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginBottom: '20px', fontWeight: 700 }}>Category Distribution</h3>
                            <div style={{ flex: 1, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats?.categoryStats?.map(c => ({ name: c._id, value: c.count })) || []}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {(stats?.categoryStats || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'][index % 6]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            ) : view === 'products' ? (
                <div>
                    <h2>Pending & Live Products ({products.length})</h2>
                    <div style={{ marginTop: '20px', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: 'var(--accent)', fontWeight: 'bold' }}>
                                <tr>
                                    <th style={{ padding: '15px' }}>Product</th>
                                    <th style={{ padding: '15px' }}>Seller</th>
                                    <th style={{ padding: '15px' }}>Category</th>
                                    <th style={{ padding: '15px' }}>Status</th>
                                    <th style={{ padding: '15px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <img src={p.images[0]} style={{ width: '40px', height: '40px', borderRadius: '4px' }} alt="" />
                                                {p.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px' }}>{p.seller?.companyName || 'N/A'}</td>
                                        <td style={{ padding: '15px' }}>{p.category}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ 
                                                fontSize: '0.8rem', 
                                                padding: '2px 8px', 
                                                borderRadius: '10px',
                                                backgroundColor: p.isApproved ? 'var(--success-bg)' : 'var(--error-bg)',
                                                color: p.isApproved ? 'var(--success)' : 'var(--error)'
                                            }}>
                                                {p.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {!p.isApproved && (
                                                    <button onClick={() => handleApprove(p._id)} className="btn btn-primary" style={{ padding: '5px 10px' }}>
                                                        <Check size={16} /> Approve
                                                    </button>
                                                )}
                                                <button onClick={() => handleDeleteProduct(p._id)} className="btn btn-outline" style={{ padding: '5px 10px', color: 'var(--error)' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : view === 'users' ? (
                <div>
                    <h2>Registered Platform Users ({users.length})</h2>
                    <div style={{ marginTop: '20px', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: 'var(--accent)', fontWeight: 'bold' }}>
                                <tr>
                                    <th style={{ padding: '15px' }}>User</th>
                                    <th style={{ padding: '15px' }}>Email</th>
                                    <th style={{ padding: '15px' }}>Role</th>
                                    <th style={{ padding: '15px' }}>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '15px' }}>{u.name}</td>
                                        <td style={{ padding: '15px' }}>{u.email}</td>
                                        <td style={{ padding: '15px', textTransform: 'capitalize' }}>{u.role}</td>
                                        <td style={{ padding: '15px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>
                    <h2>All Platform Orders ({orders.length})</h2>
                    <div style={{ marginTop: '20px', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: 'var(--accent)', fontWeight: 'bold' }}>
                                <tr>
                                    <th style={{ padding: '15px' }}>Order ID</th>
                                    <th style={{ padding: '15px' }}>Product</th>
                                    <th style={{ padding: '15px' }}>Buyer</th>
                                    <th style={{ padding: '15px' }}>Seller</th>
                                    <th style={{ padding: '15px' }}>Total Amount</th>
                                    <th style={{ padding: '15px' }}>Admin Margin (10%)</th>
                                    <th style={{ padding: '15px' }}>Seller Earning</th>
                                    <th style={{ padding: '15px' }}>Status</th>
                                    <th style={{ padding: '15px' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '15px', fontSize: '0.85rem' }}>{o._id}</td>
                                        <td style={{ padding: '15px' }}>
                                            {o.product ? (
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <img src={o.product.images[0]} style={{ width: '40px', height: '40px', borderRadius: '4px' }} alt="" />
                                                    {o.product.name} (x{o.quantity})
                                                </div>
                                            ) : (
                                                'Product Deleted'
                                            )}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            {o.buyer ? (
                                                <>
                                                    <div>{o.buyer.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{o.buyer.email}</div>
                                                </>
                                            ) : 'Unknown Buyer'}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            {o.seller ? (
                                                <>
                                                    <div>{o.seller.companyName || o.seller.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{o.seller.email}</div>
                                                </>
                                            ) : 'Unknown Seller'}
                                        </td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--foreground)' }}>₹{o.amount}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--success)' }}>₹{(o.amount * 0.10).toFixed(2)}</td>
                                        <td style={{ padding: '15px', color: 'var(--foreground)' }}>₹{(o.amount * 0.90).toFixed(2)}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ 
                                                fontSize: '0.8rem', 
                                                padding: '4px 8px', 
                                                borderRadius: '10px',
                                                backgroundColor: o.status === 'Paid' ? 'var(--success-bg)' : (o.status === 'Pending' ? 'var(--warning-bg)' : 'var(--error-bg)'),
                                                color: o.status === 'Paid' ? 'var(--success)' : (o.status === 'Pending' ? 'var(--warning)' : 'var(--error)')
                                            }}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
