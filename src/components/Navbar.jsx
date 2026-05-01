import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Sun, Moon, LogIn, User, ShoppingCart, Menu, X, Package, LayoutDashboard, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const NavLinks = () => (
        <>
            <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
            {user ? (
                <>
                    {user.role === 'customer' && (
                        <Link to="/orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>Orders</Link>
                    )}
                    {user.role === 'seller' && (
                        <Link to="/seller-dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Seller Center</Link>
                    )}
                    {user.role === 'admin' && (
                        <Link to="/admin-dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                    )}
                </>
            ) : (
                <Link to="/login" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                    <LogIn size={18} /> Login
                </Link>
            )}
        </>
    );

    return (
        <>
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
                        Bazaar <span style={{ color: 'var(--brand-orange)' }}>India</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="md-hidden" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <NavLinks />

                        <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <ShoppingCart size={22} />
                            {getCartCount() > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-12px',
                                    backgroundColor: 'var(--brand-orange)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    fontSize: '0.7rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        {user && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                                {user.logoURL ? (
                                    <img src={user.logoURL} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} alt="" />
                                ) : (
                                    <User size={18} />
                                )}
                                <span style={{ fontWeight: 600 }}>{user.name}</span>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: '0.5rem', padding: '0.4rem 0.8rem' }}>Logout</button>
                            </div>
                        )}

                        <button onClick={toggleTheme} className="btn btn-outline" style={{ borderRadius: '50%', padding: '0.5rem' }}>
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg-hidden" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <ShoppingCart size={22} />
                            {getCartCount() > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-12px',
                                    backgroundColor: 'var(--brand-orange)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    fontSize: '0.7rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                        <button onClick={toggleTheme} className="btn btn-outline" style={{ borderRadius: '50%', padding: '0.4rem' }}>
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button onClick={toggleMenu} className="btn btn-outline" style={{ padding: '0.4rem' }}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Sidebar */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
            <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Menu</span>
                    <button onClick={toggleMenu} className="btn btn-outline" style={{ borderRadius: '50%', padding: '0.4rem' }}>
                        <X size={20} />
                    </button>
                </div>

                {user && (
                    <div style={{ padding: '1rem', background: 'var(--accent)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {user.logoURL ? (
                            <img src={user.logoURL} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="" />
                        ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <User size={20} />
                            </div>
                        )}
                        <div>
                            <p style={{ fontWeight: 'bold', margin: 0 }}>{user.name}</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>{user.email}</p>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link to="/" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Products</Link>

                    {user ? (
                        <>
                            {user.role === 'customer' && (
                                <Link to="/orders" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                            )}
                            {user.role === 'seller' && (
                                <Link to="/seller-dashboard" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Seller Dashboard</Link>
                            )}
                            {user.role === 'admin' && (
                                <Link to="/admin-dashboard" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                            )}
                            <button onClick={handleLogout} className="mobile-menu-item" style={{ textAlign: 'left', background: 'none', width: '100%', color: 'var(--error)' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }} onClick={() => setIsMenuOpen(false)}>
                            Login / Register
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
