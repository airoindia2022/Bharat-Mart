import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Truck, ShieldCheck, Headphones } from 'lucide-react';

const Home = () => {
    return (
        <div className="home">
            {/* Hero Section */}
            <header style={{ 
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>India's Largest B2B Marketplace</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>Connecting Buyers with Genuine Sellers & Manufacturers</p>
                    
                    <div style={{ 
                        display: 'flex', 
                        maxWidth: '800px', 
                        margin: '0 auto', 
                        backgroundColor: 'white',
                        transition: 'none',
                        borderRadius: '30px',
                        overflow: 'hidden',
                        padding: '5px'
                    }}>
                        <input 
                            type="text" 
                            placeholder="Search Products, Categories, Manufacturers..." 
                            style={{ 
                                flex: 1, 
                                border: 'none', 
                                padding: '15px 25px', 
                                outline: 'none',
                                color: '#333',
                                fontSize: '1rem'
                            }}
                        />
                        <button className="btn btn-primary" style={{ borderRadius: '25px', padding: '0 30px' }}>
                            <Search size={20} />
                            Search
                        </button>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section style={{ padding: '60px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
                            <ShieldCheck size={30} />
                        </div>
                        <h3>Verified Sellers</h3>
                        <p style={{ color: 'var(--secondary)', marginTop: '10px' }}>Trade with trust and confidence through our verified network.</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
                            <Truck size={30} />
                        </div>
                        <h3>Global Logistics</h3>
                        <p style={{ color: 'var(--secondary)', marginTop: '10px' }}>Efficient shipping and logistics support for your business.</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--primary)' }}>
                            <Headphones size={30} />
                        </div>
                        <h3>24/7 Support</h3>
                        <p style={{ color: 'var(--secondary)', marginTop: '10px' }}>Expert assistance whenever you need it for your transactions.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '80px 0' }}>
                <div className="container" style={{ 
                    backgroundColor: 'var(--brand-blue)', 
                    color: 'white', 
                    borderRadius: '20px', 
                    padding: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Grow your business with Bharat Mart</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>Register as a seller today and reach millions of potential buyers.</p>
                        <Link to="/register" className="btn btn-primary" style={{ backgroundColor: 'var(--brand-orange)', padding: '15px 40px', fontSize: '1.1rem' }}>
                            Start Selling Now <ChevronRight size={20} />
                        </Link>
                    </div>
                    <div style={{ display: 'none' }}>
                        {/* Add image or graphic here if desired */}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
