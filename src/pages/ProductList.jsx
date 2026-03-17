import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, ShoppingCart, Info } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (keyword = '') => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/products?keyword=${keyword}`);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(search);
    };

    return (
        <div className="container" style={{ padding: '40px 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem' }}>All Products</h1>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '400px', width: '100%' }}>
                    <input 
                        type="text" 
                        className="input" 
                        placeholder="Search products..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>Loading products...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                    {products.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>No products found.</div>
                    ) : (
                        products.map(product => (
                            <div key={product._id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <img 
                                    src={product.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'} 
                                    alt={product.name} 
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 600, textTransform: 'uppercase' }}>{product.category}</span>
                                    <h3 style={{ margin: '10px 0', fontSize: '1.25rem' }}>{product.name}</h3>
                                    <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>{product.seller?.companyName}</p>
                                    
                                    <div style={{ marginTop: 'auto' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--brand-green)' }}>₹{product.price} / unit</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Min. Order: {product.minOrderQuantity}</span>
                                        </div>
                                        <Link to={`/products/${product._id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                                            <Info size={18} /> View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList;
