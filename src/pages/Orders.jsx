import React, { useState, useEffect } from 'react';
import * as paymentService from '../services/payment.service';
import { useAuth } from '../context/AuthContext';
import { Package, Calendar, Tag, User, MapPin } from 'lucide-react';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchOrders = async () => {
            try {
                // Fetch buyer or seller orders based on role
                const data = (user.role === 'seller' || user.role === 'admin') 
                    ? await paymentService.getSellerOrders(controller.signal)
                    : await paymentService.getMyOrders(controller.signal);
                
                setOrders(data);
            } catch (error) {
                if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
                    console.error('Error fetching orders:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchOrders();
        return () => controller.abort();
    }, [user]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await paymentService.updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert('Failed to update status');
        }
    };

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
                        <div key={order._id} className="card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div className="md-flex-col" style={{ display: 'flex', gap: '30px', alignItems: 'center', width: '100%' }}>
                                <img 
                                    src={order.product?.images[0] || 'https://via.placeholder.com/120'} 
                                    alt={order.product?.name} 
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px' }}
                                    className="md-w-full"
                                />
                            
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        {user.role === 'seller' && !['Cancelled', 'Refunded', 'Delivered'].includes(order.status) ? (
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                style={{
                                                    padding: '2px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    border: '1px solid var(--border)',
                                                    backgroundColor: ['Paid', 'Confirmed', 'Shipped', 'Out for Delivery'].includes(order.status) ? '#dcfce7' : '#fff7ed',
                                                    color: ['Paid', 'Confirmed', 'Shipped', 'Out for Delivery'].includes(order.status) ? '#166534' : '#c2410c',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="Paid">Paid</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        ) : (
                                            <span style={{ 
                                                backgroundColor: order.status === 'Paid' || order.status === 'Delivered' ? '#dcfce7' : (order.status === 'Pending' ? '#fef9c3' : '#fee2e2'), 
                                                color: order.status === 'Paid' || order.status === 'Delivered' ? '#166534' : (order.status === 'Pending' ? '#854d0e' : '#991b1b'),
                                                padding: '2px 10px', 
                                                borderRadius: '12px', 
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>{order.status}</span>
                                        )}
                                        <span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>Order ID: {order.razorpayOrderId}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{order.product?.name}</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Package size={14} /> Qty: {order.quantity}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Tag size={14} />
                                            {user.role === 'seller' ? `Net Earned: ₹${(order.amount * 0.90).toFixed(2)}` : `₹${order.amount}`}
                                        </span>
                                    </div>

                                    {/* Order Tracker */}
                                    <div className="order-tracker">
                                        {['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                                            const statuses = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
                                            const currentIndex = statuses.indexOf(order.status === 'Paid' ? 'Confirmed' : order.status);
                                            const stepIndex = statuses.indexOf(step);
                                            const isCompleted = stepIndex <= currentIndex;
                                            
                                            return (
                                                <div key={step} className={`tracker-step ${isCompleted ? 'completed' : ''}`}>
                                                    <div className="step-dot">
                                                        {isCompleted && <div className="dot-inner"></div>}
                                                    </div>
                                                    <span className="step-label">{step}</span>
                                                    {idx < 3 && <div className={`step-line ${isCompleted && stepIndex < currentIndex ? 'completed' : ''}`}></div>}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '20px', borderTop: '1px solid var(--border)', width: '100%' }}>
                                {user.role === 'seller' ? (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '8px' }}>Buyer Details</h4>
                                            <p style={{ fontWeight: 600, marginBottom: '5px' }}>{order.buyer?.name}</p>
                                            <p style={{ fontSize: '0.85rem' }}>{order.buyer?.email} | {order.buyer?.phoneNumber}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }} className="text-center-mobile">
                                             <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--brand-green)' }}>Gross: ₹{order.amount}</p>
                                             <p style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Net: ₹{(order.amount * 0.9).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '8px' }}>Seller Details</h4>
                                            <p style={{ fontWeight: 600, marginBottom: '5px' }}>{order.seller?.companyName}</p>
                                        </div>
                                        <button className="btn btn-outline" style={{ padding: '5px 15px', fontSize: '0.8rem' }}>Contact Seller</button>
                                    </div>
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
