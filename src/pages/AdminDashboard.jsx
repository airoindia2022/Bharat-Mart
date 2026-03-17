import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Package, Check, X, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('products');

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [prodRes, userRes] = await Promise.all([
                axios.get('http://localhost:5000/api/products', config),
                axios.get('http://localhost:5000/api/users', config)
            ]);
            setProducts(prodRes.data);
            setUsers(userRes.data);
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
                <ShieldCheck size={40} color="var(--brand-blue)" />
                <h1>System Administrator Control Panel</h1>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <button onClick={() => setView('products')} className={`btn ${view === 'products' ? 'btn-primary' : 'btn-outline'}`}>
                    <Package size={18} /> Manage Products
                </button>
                <button onClick={() => setView('users')} className={`btn ${view === 'users' ? 'btn-primary' : 'btn-outline'}`}>
                    <User size={18} /> Manage Users
                </button>
            </div>

            {loading ? (
                <div>Loading administrative data...</div>
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
                                                backgroundColor: p.isApproved ? '#dcfce7' : '#fee2e2',
                                                color: p.isApproved ? '#166534' : '#991b1b'
                                            }}>
                                                {p.isApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {!p.isApproved && (
                                                    <button onClick={() => handleApprove(p._id)} className="btn btn-primary" style={{ padding: '5px 10px', backgroundColor: 'var(--brand-green)' }}>
                                                        <Check size={16} /> Approve
                                                    </button>
                                                )}
                                                <button onClick={() => handleDeleteProduct(p._id)} className="btn btn-outline" style={{ padding: '5px 10px', color: '#dc2626' }}>
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
            ) : (
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
            )}
        </div>
    );
};

export default AdminDashboard;
