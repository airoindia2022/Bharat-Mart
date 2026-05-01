import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Calendar, 
  Shield, 
  UserCheck, 
  UserMinus,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';

const UserManagement = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="seller-header-flex">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Registered Platform Users</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: '1 1 auto' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--secondary)' }} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="input" 
              style={{ width: '100%', maxWidth: '250px', paddingLeft: '2.75rem', height: '44px', borderRadius: '12px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-outline" style={{ height: '44px', borderRadius: '12px' }}>
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User Info</th>
              <th>Role</th>
              <th>Account Status</th>
              <th>Date Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: 'var(--accent)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: 'var(--primary)'
                    }}>
                      {u.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>{u.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {u.role === 'admin' ? <Shield size={14} color="var(--primary)" /> : <Users size={14} color="var(--secondary)" />}
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize' }}>{u.role}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge success`}>
                     Enabled
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '0.875rem' }}>
                    <Calendar size={14} />
                    {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                      <UserMinus size={16} />
                    </button>
                    <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                      <MoreHorizontal size={16} />
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

export default UserManagement;
