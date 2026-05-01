import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as productService from '../services/product.service';
import { useCart } from '../context/CartContext';
import { Search, ChevronRight, Truck, ShieldCheck, Headphones, MapPin, ShoppingCart, Info } from 'lucide-react';
import Hero from '../components/layout/Hero';

const Home = () => {
    const [productsByCategory, setProductsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    useEffect(() => {
        const controller = new AbortController();
        const fetchProducts = async () => {
            try {
                const data = await productService.getProducts({}, controller.signal);
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
                if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
                    console.error('Error fetching products:', error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
        return () => controller.abort();
    }, []);

    return (
        <div className="home">
            {/* Hero Section */}
            <Hero
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
            />


            {/* Products by Category Sections */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>Loading products...</div>
            ) : (
                Object.entries(productsByCategory).map(([category, products]) => (
                    <section key={category} style={{ padding: '60px 0', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--background)' }}>
                        <div className="container">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '2rem', color: 'var(--foreground)' }}>{category}</h2>
                                <Link to={`/products?category=${encodeURIComponent(category)}`} style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
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
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <Link to={`/products/${product._id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.9rem' }}>
                                                        <Info size={16} /> View Details
                                                    </Link>
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="btn btn-primary"
                                                        style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                                                    >
                                                        <ShoppingCart size={16} /> Add to Cart
                                                    </button>
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
            <section style={{ padding: '40px 0' }}>
                <div className="container">
                    <div className="md-flex-col" style={{
                        backgroundColor: 'var(--brand-blue)',
                        color: 'white',
                        borderRadius: '20px',
                        padding: '40px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: '30px'
                    }}>
                        <div style={{ maxWidth: '800px' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }} className="hero-title-mobile">Grow your business with BazaarIndia</h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>Register as a seller today and reach millions of potential buyers across the country.</p>
                            <Link to="/register" className="btn btn-primary md-w-full" style={{ backgroundColor: 'var(--brand-orange)', padding: '12px 30px', fontSize: '1rem', justifyContent: 'center' }}>
                                Start Selling Now <ChevronRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
