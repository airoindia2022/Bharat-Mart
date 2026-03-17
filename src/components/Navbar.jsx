import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogIn, User, Search, ShoppingBag } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{ 
            height: '70px', 
            borderBottom: '1px solid var(--border)', 
            backgroundColor: 'var(--background)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
            }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--brand-blue)' }}>
                    BHARAT <span style={{ color: 'var(--brand-orange)' }}>MART</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link to="/products" className="btn btn-outline" style={{ border: 'none' }}>Products</Link>
                    
                    {user ? (
                        <>
                            {user.role === 'customer' && <Link to="/customer-dashboard">RFQs</Link>}
                            {user.role === 'seller' && <Link to="/seller-dashboard">Seller Center</Link>}
                            {user.role === 'admin' && <Link to="/admin-dashboard">Admin Panel</Link>}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} />
                                <span>{user.name}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            <LogIn size={18} />
                            Login
                        </Link>
                    )}

                    <button onClick={toggleTheme} className="btn btn-outline" style={{ borderRadius: '50%', padding: '0.5rem' }}>
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
