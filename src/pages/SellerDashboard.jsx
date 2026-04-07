import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as productService from '../services/product.service';
import * as rfqService from '../services/rfq.service';
import * as paymentService from '../services/payment.service';
import * as statsService from '../services/stats.service';
import { useAuth } from '../context/AuthContext';
import { 
    Plus, Package, MessageSquare, Trash2, Edit, Loader2, 
    LayoutDashboard, ShoppingBag, Send, Settings, User, 
    Bell, ChevronRight, CheckCircle, Clock, ExternalLink,
    PieChart as LucidePieChart, Briefcase, IndianRupee, TrendingUp, Inbox, BarChart3, Camera
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import PayoutsAndBank from '../components/seller/PayoutsAndBank';

// Market Snapshot images removed in favor of dynamic stats
const SellerDashboard = () => {
    const navigate = useNavigate();
    const { user, updateProfile, uploadLogo } = useAuth();
    const [products, setProducts] = useState([]);
    const [rfqs, setRfqs] = useState([]);
    const [orders, setOrders] = useState([]);
    const [marketStats, setMarketStats] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('dashboard'); // 'dashboard', 'products', 'rfqs', 'settings', 'orders'
    const [replies, setReplies] = useState({});
    
    // Settings state
    const [settingsData, setSettingsData] = useState({
        companyName: user?.companyName || '',
        phoneNumber: user?.phoneNumber || '',
        name: user?.name || '',
        bankName: user?.bankName || '',
        accountNumber: user?.accountNumber || '',
        ifscCode: user?.ifscCode || '',
        accountHolderName: user?.accountHolderName || '',
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ 
        name: '', description: '', category: '', price: '', 
        minOrderQuantity: 1, packagingType: 'Standard', brand: 'Generic', 
        deliveryTime: '3-4 Days', origin: 'Made in India',
        specifications: [{ key: '', value: '' }],
        countInStock: 10
    });
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }
        setImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const controller = new AbortController();
        if (user) {
            fetchProducts(controller.signal);
            fetchRFQs(controller.signal);
            fetchOrders(controller.signal);
            fetchStats(controller.signal);
        }
        return () => controller.abort();
    }, [user]);

    const handleSpecChange = (index, field, value) => {
        const updatedSpecs = [...newProduct.specifications];
        updatedSpecs[index][field] = value;
        setNewProduct({ ...newProduct, specifications: updatedSpecs });
    };
    
    const addSpecification = () => {
        setNewProduct({ 
            ...newProduct, 
            specifications: [...newProduct.specifications, { key: '', value: '' }] 
        });
    };
    
    const removeSpecification = (index) => {
        const updatedSpecs = newProduct.specifications.filter((_, i) => i !== index);
        setNewProduct({ ...newProduct, specifications: updatedSpecs });
    };

    const handleEditClick = (product) => {
        setEditMode(true);
        setEditingProductId(product._id);
        setNewProduct({
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            minOrderQuantity: product.minOrderQuantity,
            packagingType: product.packagingType || 'Standard',
            brand: product.brand || 'Generic',
            deliveryTime: product.deliveryTime || '3-4 Days',
            origin: product.origin || 'Made in India',
            specifications: product.specifications && product.specifications.length > 0 ? [...product.specifications] : [{ key: '', value: '' }],
            countInStock: product.countInStock || 0
        });
        setImages(product.images || []); // Keep track of existing images if needed
        setShowAddModal(true);
    };

    const fetchProducts = async (signal) => {
        try {
            const data = await productService.getProducts({}, signal);
            
            // Calculate market stats from all products
            const categoryCounts = {};
            data.forEach(p => {
                const cat = p.category || 'Other';
                categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            });
            
            const statsArray = Object.keys(categoryCounts).map((cat, index) => ({
                id: index,
                name: cat,
                count: categoryCounts[cat]
            })).sort((a, b) => b.count - a.count).slice(0, 5); // top 5 categories
            
            setMarketStats(statsArray);

            const sellerProducts = data.filter(p => p.seller && p.seller._id === user._id);
            setProducts(sellerProducts);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Failed to fetch products:', error);
            }
        }
    };

    const fetchRFQs = async (signal) => {
        try {
            const data = await rfqService.getRFQs({}, signal);
            setRfqs(data);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Failed to fetch RFQs:', error);
            }
        } finally { setLoading(false); }
    };

    const fetchOrders = async (signal) => {
        try {
            const data = await paymentService.getSellerOrders(signal);
            setOrders(data);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Failed to fetch orders:', error);
            }
        }
    };

    const fetchStats = async (signal) => {
        try {
            const data = await statsService.getSellerStats(signal);
            setStats(data);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Failed to fetch stats:', error);
            }
        }
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData();
        Object.keys(newProduct).forEach(key => {
            if (key === 'specifications') {
                formData.append(key, JSON.stringify(newProduct[key]));
            } else {
                formData.append(key, newProduct[key]);
            }
        });
        
        if (!editMode && images.length > 5) {
            alert('Maximum 5 images allowed');
            setUploading(false);
            return;
        }

        // Only append new files if they are File objects
        for (let i = 0; i < images.length; i++) {
            if (images[i] instanceof File) {
                formData.append('images', images[i]);
            }
        }

        try {
            if (editMode) {
                await productService.updateProduct(editingProductId, formData);
                alert('Product updated successfully!');
            } else {
                await productService.createProduct(formData);
                alert('Product created successfully!');
            }
            setShowAddModal(false);
            setEditMode(false);
            setEditingProductId(null);
            fetchProducts();
            setNewProduct({ name: '', description: '', category: '', price: '', minOrderQuantity: 1, packagingType: 'Standard', brand: 'Generic', deliveryTime: '3-4 Days', origin: 'Made in India', specifications: [{ key: '', value: '' }], countInStock: 10 });
            setImages([]);
        } catch (error) {
            console.error('Submit product error:', error.response?.data || error.message);
            alert('Failed to submit product: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(settingsData);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                fetchProducts();
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    const handleLogoStatusChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('logo', file);

        try {
            setUploading(true);
            await uploadLogo(formData);
            alert('Logo uploaded successfully!');
        } catch (error) {
            console.error('Logo upload failed:', error);
            alert('Failed to upload logo');
        } finally {
            setUploading(false);
        }
    };

    if (!user || user.role !== 'seller') return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Access Denied.</div>;

        const StatCard = ({ title, value, icon: Icon, color, bgColor, trend }) => (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '200px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                <Icon size={80} color={color} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', background: bgColor || `${color}15`, color: color }}>
                    <Icon size={24} />
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 500 }}>{title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--foreground)' }}>{value}</h2>
                {trend && <span style={{ fontSize: '0.8rem', color: 'var(--success)', marginBottom: '5px', display: 'flex', alignItems: 'center' }}><TrendingUp size={14} /> {trend}</span>}
            </div>
        </div>
    );

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <div 
            onClick={() => setView(id)}
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 16px', 
                borderRadius: '12px', 
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: view === id ? 'var(--primary)' : 'transparent',
                color: view === id ? 'var(--primary-foreground)' : 'var(--secondary)',
                marginBottom: '5px'
            }}
            className={view !== id ? 'sidebar-item-hover' : ''}
        >
            <Icon size={20} />
            <span style={{ fontWeight: 500 }}>{label}</span>
            {id === 'rfqs' && rfqs.filter(r => r.status === 'pending').length > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--error)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px' }}>
                    {rfqs.filter(r => r.status === 'pending').length}
                </span>
            )}
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', backgroundColor: 'var(--background)', paddingTop: '20px' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', padding: '0 20px', borderRight: '1px solid var(--border)', position: 'sticky', top: '84px', height: 'calc(100vh - 104px)' }}>
                <div style={{ marginBottom: '30px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {user.logoURL && (
                        <img src={user.logoURL} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }} alt="" />
                    )}
                    <div>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--foreground)' }}>Seller Portal</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{user.companyName || 'Business Owner'}</p>
                    </div>
                </div>
                
                <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard Overview" />
                <SidebarItem id="products" icon={ShoppingBag} label="My Products" />
                <SidebarItem id="rfqs" icon={Send} label="Inquiries (RFQ)" />
                <SidebarItem id="orders" icon={Inbox} label="Orders" />
                <SidebarItem id="payouts" icon={IndianRupee} label="Payouts & Bank" />
                <SidebarItem id="settings" icon={Settings} label="Store Settings" />
                
                <div style={{ marginTop: 'auto', padding: '20px', backgroundColor: 'var(--accent)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {user.logoURL ? (
                                <img src={user.logoURL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            ) : (
                                <User size={20} />
                            )}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--foreground)' }}>{user.name.split(' ')[0]}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Verified Seller</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate(`/products?seller=${user._id}`)}
                        className="btn btn-outline" 
                        style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center' }}
                    >
                        View Public Profile
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '0 40px 40px 40px', overflowY: 'auto' }}>
                {view === 'dashboard' && (
                    <div className="fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {user.logoURL && (
                                <img src={user.logoURL} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border)' }} alt="" />
                            )}
                            <div>
                                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '5px', color: 'var(--foreground)' }}>Welcome back, {user.name.split(' ')[0]}!</h1>
                                <p style={{ color: 'var(--secondary)' }}>Here's what's happening with your store today.</p>
                            </div>
                        </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn btn-outline" style={{ padding: '0.6rem' }}><Bell size={20} /></button>
                                <button onClick={() => { setEditMode(false); setShowAddModal(true); setNewProduct({ name: '', description: '', category: '', price: '', minOrderQuantity: 1, packagingType: 'Standard', brand: 'Generic', deliveryTime: '3-4 Days', origin: 'Made in India', specifications: [{ key: '', value: '' }], countInStock: 10 }); setImages([]); }} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                                    <Plus size={20} /> New Product
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            <StatCard 
                                title="Total Products" 
                                value={stats?.totalProducts || products.length} 
                                icon={Package} 
                                color="var(--primary)" 
                            />
                            <StatCard 
                                title="Total Orders" 
                                value={stats?.totalOrders || 0} 
                                icon={ShoppingBag} 
                                color="var(--success)" 
                            />
                            <StatCard 
                                title="Total Earnings" 
                                value={`₹${stats?.netEarnings?.toFixed(2) || '0.00'}`} 
                                icon={IndianRupee} 
                                color="var(--brand-blue)" 
                                trend="Post 10% Fee"
                            />
                            <StatCard 
                                title="Revenue" 
                                value={`₹${stats?.totalRevenue?.toFixed(2) || '0.00'}`} 
                                icon={TrendingUp} 
                                color="var(--warning)" 
                                trend="Gross Sales"
                            />
                        </div>

                        {/* Charts Section */}
                        {stats && stats.salesByMonth && stats.salesByMonth.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', marginBottom: '40px' }}>
                                <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ marginBottom: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <BarChart3 size={20} color="var(--primary)" /> Sales Trend (Last 6 Months)
                                    </h3>
                                    <div style={{ flex: 1, width: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={stats.salesByMonth.map(item => ({
                                                    name: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][item._id.month],
                                                    sales: item.totalSales,
                                                    orders: item.orderCount
                                                }))}
                                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                            >
                                                <defs>
                                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--secondary)', fontSize: 12}} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--secondary)', fontSize: 12}} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                                                    itemStyle={{ color: 'var(--primary)' }}
                                                />
                                                <Area type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ marginBottom: '20px', fontWeight: 700 }}>Top Performing Products</h3>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
                                        {stats.topProducts && stats.topProducts.map((p, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', backgroundColor: 'var(--accent)' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                                    {i + 1}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {p.productDetails.name}
                                                    </p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>
                                                        {p.totalQuantity} Units Sold
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--success)' }}>₹{p.totalRevenue}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {(!stats.topProducts || stats.topProducts.length === 0) && (
                                            <p style={{ textAlign: 'center', color: 'var(--secondary)', padding: '40px' }}>No sales data yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Product Featured Section - Market Stats */}
                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--foreground)' }}>Market Snapshot</h2>
                                <button className="btn btn-outline" style={{ fontSize: '0.9rem', border: 'none', color: 'var(--primary)' }}>Explore Opportunities <ChevronRight size={16} /></button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                {marketStats.length > 0 ? marketStats.map((cat) => (
                                    <div key={cat.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--primary)', textAlign: 'center' }}>{cat.name}</h3>
                                        <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--foreground)' }}>{cat.count}</p>
                                        <div style={{ marginTop: '5px', fontSize: '0.85rem', color: 'var(--secondary)' }}>Active Items</div>
                                    </div>
                                )) : (
                                    <p style={{ color: 'var(--secondary)' }}>Loading market insights...</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity Mini Tables */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <h3 style={{ fontWeight: 700 }}>Recently Added Products</h3>
                                    <button onClick={() => setView('products')} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>View All</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {products.slice(0, 4).map(product => (
                                        <div key={product._id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                            <img src={product.images[0]} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} alt="" />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--foreground)' }}>{product.name}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>₹{product.price} • {product.category}</p>
                                            </div>
                                            <div style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', backgroundColor: product.isApproved ? 'var(--success-bg)' : 'var(--warning-bg)', color: product.isApproved ? 'var(--success)' : 'var(--warning)' }}>
                                                {product.isApproved ? 'Live' : 'Pending'}
                                            </div>
                                        </div>
                                    ))}
                                    {products.length === 0 && <p style={{ textAlign: 'center', color: 'var(--secondary)', padding: '20px' }}>No products yet.</p>}
                                </div>
                            </div>

                            <div className="card">
                                <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Critical Action Required</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {rfqs.filter(r => r.status === 'pending').slice(0, 3).map(rfq => (
                                        <div key={rfq._id} style={{ padding: '15px', borderRadius: '12px', background: 'var(--card)', border: '1px solid var(--border)' }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '5px' }}>New Inquiry: {rfq.product?.name}</p>
                                            <p style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'var(--foreground)' }}>From {rfq.customer?.name}</p>
                                            <button onClick={() => setView('rfqs')} className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center' }}>Respond Now</button>
                                        </div>
                                    ))}
                                    {rfqs.filter(r => r.status === 'pending').length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <div style={{ color: 'var(--success)', marginBottom: '10px' }}><CheckCircle size={40} style={{ margin: '0 auto' }} /></div>
                                            <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>You're all caught up!</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>No pending inquiries to respond to.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'products' && (
                    <div className="fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div>
                                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Product Catalog</h1>
                                <p style={{ color: 'var(--secondary)' }}>Manage and monitor your listed items.</p>
                            </div>
                            <button onClick={() => { setEditMode(false); setShowAddModal(true); setNewProduct({ name: '', description: '', category: '', price: '', minOrderQuantity: 1, packagingType: 'Standard', brand: 'Generic', deliveryTime: '3-4 Days', origin: 'Made in India', specifications: [{ key: '', value: '' }], countInStock: 10 }); setImages([]); }} className="btn btn-primary">
                                <Plus size={18} /> Add New Product
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {products.map(product => (
                                <div key={product._id} className="card product-card" style={{ display: 'flex', gap: '15px', position: 'relative' }}>
                                    <div style={{ width: '100px', height: '100px', flexShrink: 0 }}>
                                        <img src={product.images[0]} style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} alt="" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '8px' }}>{product.category}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <p style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{product.price}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Min Order: {product.minOrderQuantity}</p>
                                        </div>
                                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: (product.countInStock || 0) > 0 ? 'var(--success-bg)' : 'var(--error-bg)', color: (product.countInStock || 0) > 0 ? 'var(--success)' : 'var(--error)' }}>
                                            {(product.countInStock || 0) > 0 ? `In Stock: ${product.countInStock}` : 'Out of Stock'}
                                        </span>
                                        <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: product.isApproved ? 'var(--success)' : 'var(--warning)' }}></span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: product.isApproved ? 'var(--success)' : 'var(--warning)' }}>
                                            {product.isApproved ? 'Live' : 'Pending Review'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px' }}>
                                    <button onClick={() => handleEditClick(product)} className="btn btn-outline" style={{ padding: '6px', color: 'var(--primary)', border: 'none' }}><Edit size={16} /></button>
                                    <button onClick={() => handleDeleteProduct(product._id)} className="btn btn-outline" style={{ padding: '6px', color: 'var(--error)', border: 'none' }}><Trash2 size={16} /></button>
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'rfqs' && (
                    <div className="fade-in">
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '30px' }}>Customer Inquiries</h1>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
                            {rfqs.map(rfq => (
                                <div key={rfq._id} className="card" style={{ borderLeft: rfq.status === 'pending' ? '4px solid var(--warning)' : '4px solid var(--success)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>{rfq.product?.name}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>From: {rfq.customer?.name}</p>
                                        </div>
                                        <span style={{ 
                                            padding: '4px 12px', 
                                            borderRadius: '20px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 600,
                                            backgroundColor: rfq.status === 'pending' ? 'var(--warning-bg)' : 'var(--success-bg)',
                                            color: rfq.status === 'pending' ? 'var(--warning)' : 'var(--success)'
                                        }}>
                                            {rfq.status.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <div style={{ margin: '15px 0', padding: '15px', backgroundColor: 'var(--accent)', borderRadius: '12px' }}>
                                        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '8px' }}>"{rfq.description}"</p>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Required Quantity: {rfq.quantity}</p>
                                    </div>

                                    {rfq.status === 'responded' && rfq.sellerReply && (
                                        <div style={{ margin: '0 0 20px 0', padding: '15px', backgroundColor: 'var(--accent)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                            <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>YOUR REPLY:</p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>{rfq.sellerReply}</p>
                                        </div>
                                    )}

                                    {rfq.status === 'pending' && (
                                        <div style={{ marginBottom: '15px' }}>
                                            <textarea 
                                                className="input" 
                                                placeholder="Write your professional response..."
                                                style={{ minHeight: '100px', resize: 'vertical' }}
                                                value={replies[rfq._id] || ''}
                                                onChange={(e) => setReplies({ ...replies, [rfq._id]: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {rfq.status === 'pending' && (
                                            <button 
                                                className="btn btn-primary"
                                                onClick={async () => {
                                                    try {
                                                        const replyText = replies[rfq._id];
                                                        if (!replyText || replyText.trim() === '') {
                                                            alert('Please enter a reply before responding.');
                                                            return;
                                                        }
                                                        await rfqService.updateRFQStatus(rfq._id, { status: 'responded', reply: replyText });
                                                        fetchRFQs();
                                                        alert('Reply sent successfully!');
                                                    } catch (error) {
                                                        alert('Failed to update status');
                                                    }
                                                }}
                                                style={{ flex: 1, justifyContent: 'center' }}
                                            >
                                                Send Response
                                            </button>
                                        )}
                                        <button 
                                            className="btn btn-outline" 
                                            onClick={() => window.location.href = `mailto:${rfq.customer?.email}`}
                                            style={{ flex: 1, justifyContent: 'center' }}
                                        >
                                            <MessageSquare size={16} /> Direct Email
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {rfqs.length === 0 && <p style={{ color: 'var(--secondary)' }}>No inquiries received yet.</p>}
                        </div>
                    </div>
                )}

                {view === 'orders' && (
                    <div className="fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div>
                                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Orders</h1>
                                <p style={{ color: 'var(--secondary)' }}>Manage your customer orders.</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ backgroundColor: 'var(--accent)', fontWeight: 'bold' }}>
                                    <tr>
                                        <th style={{ padding: '15px' }}>Order ID</th>
                                        <th style={{ padding: '15px' }}>Product</th>
                                        <th style={{ padding: '15px' }}>Buyer</th>
                                        <th style={{ padding: '15px' }}>Total Amount</th>
                                        <th style={{ padding: '15px' }}>Platform Fee (10%)</th>
                                        <th style={{ padding: '15px' }}>Net Earnings</th>
                                        <th style={{ padding: '15px' }}>Date</th>
                                        <th style={{ padding: '15px' }}>Status</th>
                                        <th style={{ padding: '15px' }}>Payout</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '15px', fontSize: '0.85rem' }}>{order._id}</td>
                                            <td style={{ padding: '15px' }}>
                                                {order.product ? (
                                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                        <img src={order.product.images[0]} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} alt="" />
                                                        <div>
                                                            <div style={{ fontWeight: '600' }}>{order.product.name}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Qty: {order.quantity}</div>
                                                        </div>
                                                    </div>
                                                ) : 'Deleted'}
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                {order.buyer ? (
                                                    <>
                                                        <div style={{ color: 'var(--foreground)' }}>{order.buyer.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{order.buyer.email}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{order.buyer.phoneNumber}</div>
                                                    </>
                                                ) : 'Unknown User'}
                                            </td>
                                            <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--foreground)' }}>₹{order.amount}</td>
                                            <td style={{ padding: '15px', color: 'var(--error)' }}>-₹{(order.amount * 0.10).toFixed(2)}</td>
                                            <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--success)' }}>₹{(order.amount * 0.90).toFixed(2)}</td>
                                            <td style={{ padding: '15px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{ 
                                                    padding: '4px 10px', 
                                                    borderRadius: '20px', 
                                                    fontSize: '0.75rem', 
                                                    fontWeight: 600,
                                                    backgroundColor: order.status === 'Paid' ? 'var(--success-bg)' : (order.status === 'Pending' ? 'var(--warning-bg)' : 'var(--error-bg)'),
                                                    color: order.status === 'Paid' ? 'var(--success)' : (order.status === 'Pending' ? 'var(--warning)' : 'var(--error)')
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                {order.isTransferredToSeller ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
                                                        <CheckCircle size={14} /> Transferred
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--secondary)', fontSize: '0.8rem' }}>
                                                        <Clock size={14} /> {order.status === 'Paid' ? 'Processing' : 'Pending'}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--secondary)' }}>
                                                No orders received yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {view === 'payouts' && (
                    <PayoutsAndBank stats={stats} orders={orders} />
                )}

                {view === 'settings' && (
                    <div className="fade-in">
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '30px' }}>Store Settings</h1>
                        <div className="card" style={{ maxWidth: '600px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ position: 'relative' }}>
                                    {user.logoURL ? (
                                        <img src={user.logoURL} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} alt="Logo" />
                                    ) : (
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                                            {user.name.charAt(0)}
                                        </div>
                                    )}
                                    <label htmlFor="logo-upload" style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '50%', cursor: 'pointer', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Camera size={14} />
                                    </label>
                                    <input id="logo-upload" type="file" style={{ display: 'none' }} accept="image/*" onChange={handleLogoStatusChange} disabled={uploading} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{user.companyName || user.name}</h3>
                                    <p style={{ color: 'var(--secondary)' }}>Member since {new Date(user.createdAt).getFullYear() || '2024'}</p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Business Name</label>
                                    <input 
                                        className="input" 
                                        value={settingsData.companyName} 
                                        onChange={(e) => setSettingsData({...settingsData, companyName: e.target.value})} 
                                        placeholder="Add your business name" 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Official Phone Number</label>
                                    <input 
                                        className="input" 
                                        value={settingsData.phoneNumber} 
                                        onChange={(e) => setSettingsData({...settingsData, phoneNumber: e.target.value})} 
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Update Business Profile</button>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            
            {/* Add Product Modal (Keep existing logic but improve UI) */}
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' }}>
                    <div className="card fade-in" style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{editMode ? 'Edit Product' : 'List New Product'}</h2>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', color: 'var(--secondary)' }}><Trash2 size={24} style={{ transform: 'rotate(45deg)' }} /></button>
                        </div>
                        
                        <form onSubmit={handleSubmitProduct}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Product Title</label>
                                    <input type="text" className="input" placeholder="e.g. Industrial Steel Tubes" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required />
                                </div>
                                
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Category</label>
                                    <select className="input" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} required>
                                        <option value="" disabled>Select Category</option>
                                        <option value="Industrial Machinery">Industrial Machinery</option>
                                        <option value="Health & Medical">Health & Medical</option>
                                        <option value="Building Construction">Building Construction</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Packaging Material">Packaging Material</option>
                                        <option value="Textiles">Textiles</option>
                                        <option value="Agriculture">Agriculture</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Price (INR)</label>
                                    <input type="number" className="input" placeholder="500" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required />
                                    {newProduct.price > 0 && (
                                        <div style={{ marginTop: '8px', fontSize: '0.8rem', padding: '8px', backgroundColor: 'var(--accent)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary)', marginBottom: '4px' }}>
                                                <span>Platform Fee (10%):</span>
                                                <span style={{ color: 'var(--error)' }}>-₹{(newProduct.price * 0.10).toFixed(2)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--foreground)' }}>
                                                <span>You Earn:</span>
                                                <span style={{ color: 'var(--success)' }}>₹{(newProduct.price * 0.90).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Min Order Qty</label>
                                    <input type="number" className="input" value={newProduct.minOrderQuantity} onChange={(e) => setNewProduct({...newProduct, minOrderQuantity: e.target.value})} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Delivery Time</label>
                                    <input type="text" className="input" placeholder="e.g. 2-3 Days" value={newProduct.deliveryTime} onChange={(e) => setNewProduct({...newProduct, deliveryTime: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Stock Availability</label>
                                    <input type="number" className="input" placeholder="e.g. 50" value={newProduct.countInStock} onChange={(e) => setNewProduct({...newProduct, countInStock: e.target.value})} required />
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Technical Specifications</label>
                                    <button 
                                        type="button" 
                                        onClick={addSpecification}
                                        style={{ fontSize: '0.8rem', color: 'var(--brand-blue)', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                                    >
                                        <Plus size={14} /> Add Specification
                                    </button>
                                </div>
                                {newProduct.specifications.map((spec, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <input 
                                            type="text" 
                                            className="input" 
                                            placeholder="Label (e.g. Material)" 
                                            value={spec.key} 
                                            style={{ flex: 1 }}
                                            onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                            required
                                        />
                                        <input 
                                            type="text" 
                                            className="input" 
                                            placeholder="Value (e.g. Aluminium)" 
                                            value={spec.value} 
                                            style={{ flex: 1 }}
                                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                            required
                                        />
                                        {newProduct.specifications.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeSpecification(index)}
                                                style={{ padding: '8px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Description</label>
                                <textarea className="input" style={{ height: '100px' }} value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} required placeholder="Describe your product features, quality, and usage..." />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Product Images ({images.length}/5)</label>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                    {images.map((img, index) => (
                                        <div key={index} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                            <img 
                                                src={typeof img === 'string' ? img : URL.createObjectURL(img)} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                alt={`Preview ${index}`} 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => removeImage(index)}
                                                style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'var(--error)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1 }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {images.length < 5 && (
                                        <label style={{ 
                                            width: '100px', 
                                            height: '100px', 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            backgroundColor: 'var(--accent)', 
                                            border: '2px dashed var(--border)', 
                                            borderRadius: '12px', 
                                            cursor: 'pointer',
                                            color: 'var(--secondary)',
                                            transition: 'all 0.2s',
                                            gap: '4px'
                                        }}>
                                            <Plus size={24} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>Add Image</span>
                                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Upload high-quality images to attract more buyers. Max 5 allowed.</p>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', height: '48px' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', height: '48px' }} disabled={uploading}>
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : (editMode ? 'Update Product' : 'List Product Now')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;
