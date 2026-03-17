import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Package, MessageSquare, Trash2, Edit, Loader2 } from 'lucide-react';

const SellerDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [rfqs, setRfqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('products'); // 'products' or 'rfqs'
    const [replies, setReplies] = useState({});
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', category: '', price: '', minOrderQuantity: 1 });
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchProducts();
            fetchRFQs();
        }
    }, [user]);

    const fetchProducts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/products', config);
            const sellerProducts = data.filter(p => p.seller._id === user._id);
            setProducts(sellerProducts);
        } catch (error) {}
    };

    const fetchRFQs = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/rfq', config);
            setRfqs(data);
        } catch (error) {} finally { setLoading(false); }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData();
        Object.keys(newProduct).forEach(key => formData.append(key, newProduct[key]));
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/products', formData, config);
            setShowAddModal(false);
            fetchProducts();
            setNewProduct({ name: '', description: '', category: '', price: '', minOrderQuantity: 1 });
            setImages([]);
        } catch (error) {
            alert('Failed to add product');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/products/${id}`, config);
                fetchProducts();
            } catch (error) {}
        }
    };

    if (!user || user.role !== 'seller') return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Access Denied.</div>;

    return (
        <div className="container" style={{ padding: '40px 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Seller Dashboard</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setView('products')} className={`btn ${view === 'products' ? 'btn-primary' : 'btn-outline'}`}>
                        <Package size={18} /> My Products
                    </button>
                    <button onClick={() => setView('rfqs')} className={`btn ${view === 'rfqs' ? 'btn-primary' : 'btn-outline'}`}>
                        <MessageSquare size={18} /> Customer Inquiries
                    </button>
                </div>
            </div>

            {view === 'products' ? (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>Product Catalog ({products.length})</h2>
                        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ backgroundColor: 'var(--brand-green)' }}>
                            <Plus size={18} /> Add New Product
                        </button>
                    </div>

                    <div style={{ display: 'grid', gap: '15px' }}>
                        {products.map(product => (
                            <div key={product._id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <img src={product.images[0]} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} alt="" />
                                <div style={{ flex: 1 }}>
                                    <h3>{product.name}</h3>
                                    <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{product.category} | ₹{product.price} | Min: {product.minOrderQuantity}</p>
                                    <span style={{ fontSize: '0.75rem', color: product.isApproved ? 'var(--brand-green)' : 'var(--brand-orange)' }}>
                                        ● {product.isApproved ? 'Approved & Live' : 'Pending Approval'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => handleDeleteProduct(product._id)} className="btn btn-outline" style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h2>Received Inquiries ({rfqs.length})</h2>
                    <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                        {rfqs.map(rfq => (
                            <div key={rfq._id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <h3 style={{ color: 'var(--brand-blue)' }}>{rfq.product?.name}</h3>
                                    <span style={{ backgroundColor: '#f3f4f6', padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>{rfq.status}</span>
                                </div>
                                <p><strong>Customer:</strong> {rfq.customer?.name} ({rfq.customer?.email})</p>
                                <p><strong>Phone:</strong> {rfq.customer?.phoneNumber}</p>
                                <div style={{ margin: '15px 0', padding: '15px', backgroundColor: 'var(--accent)', borderRadius: '8px' }}>
                                    <strong>Requirement:</strong> {rfq.description}
                                    <p style={{ marginTop: '5px' }}><strong>Quantity:</strong> {rfq.quantity}</p>
                                </div>
                                {rfq.status === 'responded' && rfq.sellerReply && (
                                    <div style={{ margin: '0 0 15px 0', padding: '15px', backgroundColor: '#e6f4ea', borderRadius: '8px', borderLeft: '4px solid #34a853' }}>
                                        <p style={{ color: '#137333', margin: 0 }}><strong>Your Reply:</strong></p>
                                        <p style={{ color: '#1e8e3e', marginTop: '5px' }}>{rfq.sellerReply}</p>
                                    </div>
                                )}
                                {rfq.status !== 'responded' && (
                                    <textarea 
                                        className="input" 
                                        placeholder="Type your reply here to respond to the customer directly..."
                                        style={{ height: '80px', marginBottom: '15px', resize: 'vertical' }}
                                        value={replies[rfq._id] || ''}
                                        onChange={(e) => setReplies({ ...replies, [rfq._id]: e.target.value })}
                                        required
                                    />
                                )}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {rfq.status !== 'responded' && (
                                        <button 
                                            className="btn btn-primary"
                                            onClick={async () => {
                                                try {
                                                    const replyText = replies[rfq._id];
                                                    if (!replyText || replyText.trim() === '') {
                                                        alert('Please enter a reply before responding.');
                                                        return;
                                                    }
                                                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                                                    await axios.put(`http://localhost:5000/api/rfq/${rfq._id}`, { status: 'responded', reply: replyText }, config);
                                                    fetchRFQs();
                                                    alert('Marked as responded!');
                                                } catch (error) {
                                                    alert('Failed to updating status');
                                                }
                                            }}
                                        >
                                            Mark as Responded
                                        </button>
                                    )}
                                    <button className="btn btn-outline" style={{ border: 'none' }} onClick={() => window.location.href = `mailto:${rfq.customer?.email}?subject=Reply to RFQ: ${rfq.product?.name}`}>
                                        Email Customer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '20px' }}>List New Product</h2>
                        <form onSubmit={handleAddProduct}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Product Title</label>
                                <input type="text" className="input" placeholder="e.g. Industrial Steel Tubes" onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
                                    <input type="text" className="input" placeholder="Industrial Tools" onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Price (INR)</label>
                                    <input type="number" className="input" placeholder="500" onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required />
                                </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Minimum Order Quantity</label>
                                <input type="number" className="input" value={newProduct.minOrderQuantity} onChange={(e) => setNewProduct({...newProduct, minOrderQuantity: e.target.value})} required />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                                <textarea className="input" style={{ height: '80px' }} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} required />
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Product Images (Max 5)</label>
                                <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} required />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={uploading}>
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : 'List Product'}
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
