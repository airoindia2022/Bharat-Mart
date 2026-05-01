import React, { useState } from 'react';
import { 
  Check, 
  Trash2, 
  AlertCircle,
  Clock,
  MoreVertical,
  ExternalLink,
  Table as TableIcon,
  Search,
  Filter
} from 'lucide-react';

const ProductManagement = ({ products, onApprove, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.seller?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && p.isApproved) || 
                         (statusFilter === 'pending' && !p.isApproved);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fade-in">
      <div className="seller-header-flex">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Pending & Live Products</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: '1 1 auto' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--secondary)' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="input" 
              style={{ width: '100%', maxWidth: '250px', paddingLeft: '2.75rem', height: '44px', borderRadius: '12px' }}
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
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Product Info</th>
              <th>Seller</th>
              <th>Category</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p._id}>
                <td>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img 
                      src={p.images[0]} 
                      className="product-img"
                      alt={p.name} 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                    />
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>{p.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>ID: {p._id.slice(-8)}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{p.seller?.companyName || 'N/A'}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{p.seller?.email || ''}</p>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{p.category}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem', borderRadius: '6px', background: p.isGlobal ? 'var(--primary-bg)' : 'var(--accent)', color: p.isGlobal ? 'var(--primary)' : 'var(--secondary)' }}>
                    {p.isGlobal ? 'Global' : 'Local'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${p.isApproved ? 'success' : 'warning'}`}>
                    {p.isApproved ? <Check size={12} /> : <Clock size={12} />}
                    {p.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!p.isApproved && (
                      <button 
                        onClick={() => onApprove(p._id)} 
                        className="btn btn-primary" 
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Check size={14} /> Approve
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(p._id)} 
                      className="btn btn-outline" 
                      style={{ padding: '0.375rem', color: 'var(--error)', borderColor: 'var(--error-bg)' }}
                    >
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
  );
};

export default ProductManagement;
