import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Calendar, Tag, User, MapPin } from 'lucide-react';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // Fetch buyer or seller orders based on role
                const endpoint = (user.role === 'seller' || user.role === 'admin') 
                    ? 'http://localhost:5000/api/payment/seller-orders'
                    : 'http://localhost:5000/api/payment/my-orders';
                
                const { data } = await axios.get(endpoint, config);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchOrders();
    }, [user]);

    if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '40px 1rem' }}>
            <h1 style={{ marginBottom: '30px' }}>{user.role === 'seller' ? 'Manage Sales' : 'My Orders'}</h1>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'var(--accent)', borderRadius: '15px' }}>
                    <Package size={50} color="var(--secondary)" style={{ marginBottom: '15px' }} />
                    <p>No orders found.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map((order) => (
                        <div key={order._id} className="card" style={{ padding: '25px', display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '30px', alignItems: 'center' }}>
                            <img 
                                src={order.product?.images[0] || 'https://via.placeholder.com/120'} 
                                alt={order.product?.name} 
                                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
                            />
                            
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span style={{ 
                                        backgroundColor: order.status === 'Paid' ? '#dcfce7' : '#fee2e2', 
                                        color: order.status === 'Paid' ? '#166534' : '#991b1b',
                                        padding: '2px 10px', 
                                        borderRadius: '12px', 
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>{order.status}</span>
                                    <span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>Order ID: {order.razorpayOrderId}</span>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{order.product?.name}</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', color: 'var(--secondary)', fontSize: '0.9rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Package size={14} /> Qty: {order.quantity}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Tag size={14} />
                                        {user.role === 'seller' ? `Net Earned: ₹${(order.amount * 0.90).toFixed(2)} (Gross: ₹${order.amount})` : `₹${order.amount}`}
                                    </span>
                                </div>
                            </div>

                            <div style={{ paddingLeft: '20px', borderLeft: '1px solid var(--border)' }}>
                                {user.role === 'seller' ? (
                                    <>
                                        <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '8px' }}>Buyer Details</h4>
                                        <p style={{ fontWeight: 600, marginBottom: '5px' }}>{order.buyer?.name}</p>
                                        <p style={{ fontSize: '0.85rem' }}>{order.buyer?.email}</p>
                                        <p style={{ fontSize: '0.85rem' }}>{order.buyer?.phoneNumber}</p>
                                    </>
                                ) : (
                                    <>
                                        <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '8px' }}>Seller Details</h4>
                                        <p style={{ fontWeight: 600, marginBottom: '5px' }}>{order.seller?.companyName}</p>
                                        <button className="btn btn-outline" style={{ padding: '5px 15px', fontSize: '0.8rem', marginTop: '10px' }}>Contact Seller</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
