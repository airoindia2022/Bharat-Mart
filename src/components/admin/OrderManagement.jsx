import React, { useState } from 'react';
import { 
  IndianRupee, 
  ArrowRightLeft, 
  Clock, 
  CheckCircle2, 
  RotateCcw,
  AlertCircle,
  TrendingUp,
  Download,
  Filter,
  Search
} from 'lucide-react';

const OrderManagement = ({ orders, onSettle, onRefund }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         o.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         o.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         o.seller?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>All Platform Orders</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--secondary)' }} />
            <input 
              type="text" 
              placeholder="Search ID, product or user..." 
              className="input" 
              style={{ width: '250px', paddingLeft: '2.75rem', height: '44px', borderRadius: '12px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="input" 
            style={{ width: '150px', height: '44px', borderRadius: '12px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Refunded">Refunded</option>
          </select>
          <button className="btn btn-primary" style={{ borderRadius: '12px', height: '44px' }}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Order ID</th>
              <th style={{ width: '25%' }}>Product Detail</th>
              <th>Buyer/Seller</th>
              <th>Revenue (₹)</th>
              <th>Status</th>
              <th>Settlement</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o._id}>
                <td>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, p: '0.25rem 0.5rem', borderRadius: '4px', background: 'var(--accent)' }}>
                    #{o._id.slice(-6).toUpperCase()}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {o.product ? (
                      <>
                        <img 
                          src={o.product.images[0]} 
                          style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} 
                        />
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{o.product.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Qty: {o.quantity}</p>
                        </div>
                      </>
                    ) : (
                      'Product Deleted'
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{o.buyer?.name || 'Unknown'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{o.seller?.companyName || 'Unknown'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>₹{o.amount}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600 }}>Margin: ₹{(o.amount * 0.10).toFixed(2)}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${['Paid', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(o.status) ? 'success' : (o.status === 'Pending' ? 'warning' : 'error')}`}>
                    {['Paid', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(o.status) && <CheckCircle2 size={12} />}
                    {o.status === 'Pending' && <Clock size={12} />}
                    {(o.status === 'Refunded' || o.status === 'Cancelled') && <RotateCcw size={12} />}
                    {o.status}
                  </span>
                </td>
                <td>
                  {o.status === 'Refunded' ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600 }}>REFUNDED</span>
                  ) : o.isTransferredToSeller ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--success)', fontWeight: 700, fontSize: '0.75rem' }}>
                      <CheckCircle2 size={14} /> SETTLED
                    </div>
                  ) : ['Paid', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(o.status) ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => onSettle(o._id)} 
                        className="btn btn-primary" 
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                      >
                         Transfer
                      </button>
                      <button 
                        onClick={() => onRefund(o._id)} 
                        className="btn btn-outline" 
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', color: 'var(--error)', borderColor: 'var(--error-bg)' }}
                      >
                         Refund
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--secondary)', fontSize: '0.75rem' }}>Pending Pay</span>
                  )}
                </td>
                <td>
                  <span style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
