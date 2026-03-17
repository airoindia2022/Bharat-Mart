import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, MessageSquare, ShieldCheck, MapPin, Phone, Send } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rfqModal, setRfqModal] = useState(false);
    const [rfqData, setRfqData] = useState({ title: '', description: '', quantity: 1 });
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
                setRfqData({ ...rfqData, title: `Inquiry for ${data.name}`, quantity: data.minOrderQuantity });
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSendRFQ = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/rfq', {
                productId: product._id,
                ...rfqData
            }, config);
            setSuccessMsg('Request for Quotation sent successfully!');
            setTimeout(() => {
                setRfqModal(false);
                setSuccessMsg('');
            }, 3000);
        } catch (error) {
            alert('Failed to send RFQ');
        }
    };

    if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;
    if (!product) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Product not found.</div>;

    return (
        <div className="container" style={{ padding: '40px 1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
                {/* Images Section */}
                <div>
                    <img 
                        src={product.images[0] || 'https://via.placeholder.com/600x400?text=No+Image'} 
                        alt={product.name} 
                        style={{ width: '100%', borderRadius: '15px', position: 'sticky', top: '100px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        {product.images.map((img, i) => (
                            <img key={i} src={img} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} />
                        ))}
                    </div>
                </div>

                {/* Details Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ backgroundColor: 'var(--brand-blue)', color: 'white', padding: '2px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>{product.category}</span>
                        {product.isApproved && <span style={{ color: 'var(--brand-green)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                            <ShieldCheck size={14} /> Verified Supplier
                        </span>}
                    </div>
                    
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.name}</h1>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--brand-green)', marginBottom: '20px' }}>₹{product.price} <span style={{ fontSize: '1rem', color: 'var(--secondary)' }}>/ unit</span></h2>
                    
                    <div style={{ padding: '20px', backgroundColor: 'var(--accent)', borderRadius: '10px', marginBottom: '30px' }}>
                        <p><strong>Minimum Order Quantity:</strong> {product.minOrderQuantity} units</p>
                    </div>

                    <p style={{ fontSize: '1.1rem', marginBottom: '30px', lineHeight: 1.6 }}>{product.description}</p>

                    <button onClick={() => setRfqModal(true)} className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem', width: '100%', justifyContent: 'center' }}>
                        <MessageSquare size={20} /> Get Best Price / Send Inquiry
                    </button>

                    <div style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '30px' }}>
                        <h3>Supplier Information</h3>
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ShoppingBag size={18} color="var(--secondary)" />
                                <strong>{product.seller?.companyName}</strong>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MapPin size={18} color="var(--secondary)" />
                                <span>{product.seller?.address}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Phone size={18} color="var(--secondary)" />
                                <span>{product.seller?.phoneNumber}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RFQ Modal */}
            {rfqModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '500px', width: '90%', padding: '30px' }}>
                        <h2 style={{ marginBottom: '20px' }}>Send Inquiry to Seller</h2>
                        
                        {successMsg ? (
                            <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>{successMsg}</div>
                        ) : (
                            <form onSubmit={handleSendRFQ}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Inquiry Title</label>
                                    <input type="text" className="input" value={rfqData.title} onChange={(e) => setRfqData({...rfqData, title: e.target.value})} required />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Requirement Details</label>
                                    <textarea className="input" style={{ height: '100px', resize: 'none' }} placeholder="Describe your requirement in detail..." value={rfqData.description} onChange={(e) => setRfqData({...rfqData, description: e.target.value})} required />
                                </div>
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Quantity Required</label>
                                    <input type="number" className="input" min={product.minOrderQuantity} value={rfqData.quantity} onChange={(e) => setRfqData({...rfqData, quantity: e.target.value})} required />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="button" onClick={() => setRfqModal(false)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                        <Send size={18} /> Send Inquiry
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
