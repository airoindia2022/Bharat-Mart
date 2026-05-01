import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  LogOut,
  Settings,
  Bell
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout, isOpen }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'active' : ''}`}>
      <div className="admin-sidebar-header">
        <div 
          className="stat-icon" 
          style={{ background: 'var(--primary)', color: 'white', width: '40px', height: '40px' }}
        >
          <ShieldCheck size={24} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>BazaarIndia</h2>
      </div>

      <nav className="admin-sidebar-nav">
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)', padding: '0 1.25rem 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Menu
        </p>
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
        
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)', padding: '0 1.25rem 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System
          </p>
          <div className="admin-nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>
          <div className="admin-nav-item" style={{ color: 'var(--error)' }} onClick={onLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Administrator'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
