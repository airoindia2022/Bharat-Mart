import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, ChevronRight, Truck, ShieldCheck, Headphones, MapPin, MessageSquare, Info } from 'lucide-react';

const Home = () => {
    const [productsByCategory, setProductsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchTerm)}`);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                const grouped = {};
                data.forEach(product => {
                    const cat = product.category || 'Other';
                    if (!grouped[cat]) {
                        grouped[cat] = [];
                    }
                    if (grouped[cat].length < 4) {
                        grouped[cat].push(product);
                    }
                });
                setProductsByCategory(grouped);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

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
                    
                    <form onSubmit={handleSearch} style={{ 
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                flex: 1, 
                                border: 'none', 
                                padding: '15px 25px', 
                                outline: 'none',
                                color: '#333',
                                fontSize: '1rem'
                            }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: '25px', padding: '0 30px' }}>
                            <Search size={20} />
                            Search
                        </button>
                    </form>
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

            {/* Products by Category Sections */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>Loading products...</div>
            ) : (
                Object.entries(productsByCategory).map(([category, products]) => (
                    <section key={category} style={{ padding: '60px 0', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
                        <div className="container">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '2rem', color: 'var(--foreground)' }}>{category}</h2>
                                <Link to={`/products?category=${category}`} style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                                    View All <ChevronRight size={16} />
                                </Link>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                                {products.map(product => (
                                    <div key={product._id} className="card product-card fade-in" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                        <img 
                                            src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'} 
                                            alt={product.name} 
                                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                        />
                                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>{product.category}</span>
                                            <h3 style={{ margin: '10px 0', fontSize: '1.25rem', color: 'var(--card-foreground)' }}>{product.name}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                                                <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>{product.seller?.companyName}</p>
                                                {product.isApproved && <ShieldCheck size={14} color="var(--brand-green)" title="Verified Supplier" />}
                                            </div>
                                            <p style={{ color: 'var(--secondary)', fontSize: '0.8rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MapPin size={12} /> {product.seller?.address || 'India'}
                                            </p>
                                            
                                            <div style={{ marginTop: 'auto' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--brand-green)' }}>₹{product.price} / unit</span>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Min. Order: {product.minOrderQuantity}</span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <Link to={`/products/${product._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                                                        <MessageSquare size={16} /> Contact Supplier
                                                    </Link>
                                                    <Link to={`/products/${product._id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.9rem' }}>
                                                        <Info size={16} /> View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))
            )}

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
