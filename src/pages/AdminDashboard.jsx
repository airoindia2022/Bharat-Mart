import React, { useState, useEffect } from 'react';
import * as authService from '../services/auth.service';
import * as productService from '../services/product.service';
import * as paymentService from '../services/payment.service';
import * as statsService from '../services/stats.service';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/admin/Sidebar';
import Overview from '../components/admin/Overview';
import ProductManagement from '../components/admin/ProductManagement';
import UserManagement from '../components/admin/UserManagement';
import OrderManagement from '../components/admin/OrderManagement';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('overview');

    useEffect(() => {
        const controller = new AbortController();
        if (user && user.role === 'admin') {
            fetchData(controller.signal);
        }
        return () => controller.abort();
    }, [user]);

    const fetchData = async (signal) => {
        try {
            setLoading(true);
            const [prodRes, userRes, orderRes, statsRes] = await Promise.all([
                productService.getProducts({}, signal),
                authService.getUsers(signal),
                paymentService.getAllOrders(signal),
                statsService.getAdminStats(signal)
            ]);
            setProducts(prodRes);
            setUsers(userRes);
            setOrders(orderRes);
            setStats(statsRes);
        } catch (error) {
            if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
                console.error('Fetch error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await productService.approveProduct(id);
            fetchData();
        } catch (error) {
            console.error('Approval error:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Delete this product permanently?')) {
            try {
                await productService.deleteProduct(id);
                fetchData();
            } catch (error) {
                console.error('Deletion error:', error);
            }
        }
    };

    const handleSettleOrder = async (id) => {
        if (window.confirm('Mark this payment as settled manually? This indicates funds have been transferred to the seller outside of auto-transfers.')) {
            try {
                await paymentService.settleOrderManual(id);
                fetchData();
                alert('Order marked as settled!');
            } catch (error) {
                console.error('Settlement error:', error);
                alert('Failed to settle order.');
            }
        }
    };

    const handleRefundOrder = async (id) => {
        if (window.confirm('Refund this payment? Funds will be returned to the buyer via Razorpay, and product stock will be restored.')) {
            try {
                await paymentService.refundOrderManual(id);
                fetchData();
                alert('Order refunded successfully!');
            } catch (error) {
                console.error('Refund error:', error);
                alert('Failed to refund order.');
            }
        }
    };

    const { logout } = useAuth();

    if (!user || user.role !== 'admin') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', background: 'var(--background)' }}>
          <div style={{ padding: '1.5rem', background: 'var(--error-bg)', color: 'var(--error)', borderRadius: '12px', fontWeight: 600 }}>
            Access Denied: Administrative privileges required.
          </div>
          <a href="/login" className="btn btn-outline">Return to Login</a>
        </div>
      );
    }

    const renderContent = () => {
      if (loading) {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div className="loader" style={{ width: '48px', height: '48px', border: '5px solid var(--accent)', borderBottomColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        );
      }

      switch (view) {
        case 'overview':
          return <Overview stats={stats} />;
        case 'products':
          return <ProductManagement products={products} onApprove={handleApprove} onDelete={handleDeleteProduct} />;
        case 'users':
          return <UserManagement users={users} />;
        case 'orders':
          return <OrderManagement orders={orders} onSettle={handleSettleOrder} onRefund={handleRefundOrder} />;
        default:
          return <Overview stats={stats} />;
      }
    };

    return (
        <div className="admin-dashboard">
            <Sidebar activeTab={view} setActiveTab={setView} user={user} onLogout={logout} />
            
            <main className="admin-main">
                <header className="admin-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1>{view.charAt(0).toUpperCase() + view.slice(1)} Dashboard</h1>
                            <p>Manage your marketplace platform and monitor system performance.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 500, padding: '0.5rem 1rem', background: 'var(--accent)', borderRadius: '12px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                                Platform Status: Healthy
                            </div>
                        </div>
                    </div>
                </header>

                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
