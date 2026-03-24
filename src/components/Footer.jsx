import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--card)',
            color: 'var(--card-foreground)',
            borderTop: '1px solid var(--border)',
            padding: '60px 0 20px 0',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '40px',
                    justifyContent: 'space-between',
                    marginBottom: '40px'
                }}>
                    {/* Company Info */}
                    <div style={{ flex: '1 1 250px' }}>
                        <h2 style={{ color: 'var(--brand-blue)', fontSize: '1.8rem', marginBottom: '15px', fontWeight: 'bold' }}>
                            Bharat Mart
                        </h2>
                        <p style={{ color: 'var(--secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                            India's Largest B2B Marketplace. Connecting buyers with genuine sellers and manufacturers across the nation.
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="#" style={{ color: 'var(--secondary)', transition: 'color 0.2s' }}>
                                <Facebook size={20} />
                            </a>
                            <a href="#" style={{ color: 'var(--secondary)', transition: 'color 0.2s' }}>
                                <Twitter size={20} />
                            </a>
                            <a href="#" style={{ color: 'var(--secondary)', transition: 'color 0.2s' }}>
                                <Instagram size={20} />
                            </a>
                            <a href="#" style={{ color: 'var(--secondary)', transition: 'color 0.2s' }}>
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div style={{ flex: '1 1 150px' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: '600' }}>Quick Links</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><Link to="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>About Us</Link></li>
                            <li><Link to="/products" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>All Products</Link></li>
                            <li><Link to="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Contact Support</Link></li>
                            <li><Link to="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Privacy Policy</Link></li>
                            <li><Link to="/" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Terms & Conditions</Link></li>
                        </ul>
                    </div>



                    {/* Contact Info */}
                    <div style={{ flex: '1 1 200px' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: '600' }}>Contact Us</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--secondary)' }}>
                                <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                                <span>23/B, new friends colony behind DPS school , Jankipuram Extension , Lucknow up</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary)' }}>
                                <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <span>+91 7668392730</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary)' }}>
                                <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <span>support@bharatmart.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '20px',
                    textAlign: 'center',
                    color: 'var(--secondary)',
                    fontSize: '0.9rem'
                }}>
                    <p>&copy; {new Date().getFullYear()} HS Online. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
