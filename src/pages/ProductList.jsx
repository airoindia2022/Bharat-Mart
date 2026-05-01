import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as productService from '../services/product.service';
import * as authService from '../services/auth.service';
import { useCart } from '../context/CartContext';
import { Search, Filter, ShoppingCart, Info, MapPin, ShieldCheck, ArrowLeft } from 'lucide-react';

const ProductList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [sellerInfo, setSellerInfo] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get('category');
        const keywordParam = queryParams.get('keyword');
        const sellerParam = queryParams.get('seller');

        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
        if (keywordParam) {
            setSearch(keywordParam);
        }

        if (sellerParam) {
            fetchSellerInfo(sellerParam, controller.signal);
        } else {
            setSellerInfo(null);
        }

        fetchProducts({ 
            keyword: keywordParam || '', 
            seller: sellerParam || '',
            category: categoryParam || ''
        }, controller.signal);
        return () => controller.abort();
    }, [location.search]);

    const fetchSellerInfo = async (sellerId, signal) => {
        try {
            const data = await authService.getPublicProfile(sellerId, signal);
            setSellerInfo(data);
        } catch (error) {
            if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
                console.error('Error fetching seller info:', error);
            }
        }
    };

    const fetchProducts = async (filters = {}, signal) => {
        setLoading(true);
        try {
            const data = await productService.getProducts(filters, signal);
            setProducts(data);
        } catch (error) {
            if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
                console.error('Error fetching products:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/products?keyword=${encodeURIComponent(search)}`);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const uniqueCategories = ['All Categories', ...new Set(products.map(p => p.category).filter(Boolean))];

    const filteredProducts = products.filter(product => {
        if (selectedCategory && selectedCategory !== 'All Categories') {
            if (product.category !== selectedCategory) return false;
        }
        if (minPrice && product.price < Number(minPrice)) return false;
        if (maxPrice && product.price > Number(maxPrice)) return false;
        if (verifiedOnly && !product.isApproved) return false;
        return true;
    });

    return (
        <div className="container" style={{ padding: '40px 1rem' }}>
            <div style={{ marginBottom: '40px' }}>
                <div className="md-flex-col" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                    <div className="md-w-full text-center-mobile">
                        {sellerInfo ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="md-flex-col">
                                <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '8px' }}><ArrowLeft size={18} /></button>
                                {sellerInfo.logoURL && <img src={sellerInfo.logoURL} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)' }} alt="" />}
                                <div>
                                    <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{sellerInfo.companyName || sellerInfo.name}</h1>
                                    <p style={{ color: 'var(--secondary)', margin: 0 }}>Verified Seller</p>
                                </div>
                            </div>
                        ) : (
                            <h1 style={{ fontSize: '2rem' }}>All Products</h1>
                        )}
                    </div>
                    <div className="md-w-full" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                        <form onSubmit={handleSearch} className="md-w-full" style={{ display: 'flex', gap: '10px', maxWidth: '400px', flex: 1 }}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button type="submit" className="btn btn-primary">Search</button>
                        </form>
                        <button
                            className="btn btn-outline md-w-full"
                            onClick={() => setShowFilters(!showFilters)}
                            style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}
                        >
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="card" style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-end', width: '100%' }}>
                        <div className="md-w-full" style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '200px' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Category</label>
                            <select
                                className="input"
                                style={{ cursor: 'pointer' }}
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {uniqueCategories.map(cat => (
                                     <option key={cat} value={cat}>{cat}</option>
                                 ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', width: '100%', flexWrap: 'wrap' }} className="md-gap-4">
                            <div className="md-w-full" style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Min Price (₹)</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                            </div>
                            <div className="md-w-full" style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Max Price (₹)</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="Any"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="md-w-full" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px' }}>
                            <input
                                type="checkbox"
                                id="verifiedOnly"
                                checked={verifiedOnly}
                                onChange={(e) => setVerifiedOnly(e.target.checked)}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="verifiedOnly" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                Verified Suppliers Only <ShieldCheck size={16} color="var(--brand-green)" />
                            </label>
                        </div>
                        <div className="md-w-full" style={{ marginLeft: 'auto', paddingBottom: '5px' }}>
                            <button
                                className="btn btn-outline md-w-full"
                                style={{ justifyContent: 'center' }}
                                onClick={() => {
                                    setSelectedCategory('All Categories');
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setVerifiedOnly(false);
                                    setSearch('');
                                    navigate('/products');
                                }}
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>Loading products...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                    {filteredProducts.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>No products found.</div>
                    ) : (
                        filteredProducts.map(product => (
                            <div key={product._id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                                    alt={product.name}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', fontWeight: 600, textTransform: 'uppercase' }}>{product.category}</span>
                                    <h3 style={{ margin: '10px 0', fontSize: '1.25rem' }}>{product.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                        {product.seller?.logoURL && (
                                            <img src={product.seller.logoURL} style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border)' }} alt="" />
                                        )}
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
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList;
