import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, 
    MessageSquare, 
    ShieldCheck, 
    MapPin, 
    Phone, 
    Send, 
    ChevronLeft, 
    Star, 
    Truck, 
    Clock, 
    CheckCircle2,
    X,
    Package,
    ArrowRight,
    Zap,
    Share2,
    Heart,
    Info,
    Check,
    Briefcase,
    Globe,
    Award,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rfqModal, setRfqModal] = useState(false);
    const [rfqData, setRfqData] = useState({ title: '', description: '', quantity: 1 });
    const [successMsg, setSuccessMsg] = useState('');
    const [activeImage, setActiveImage] = useState(0);
    const [wishlisted, setWishlisted] = useState(false);
    const [expandedSections, setExpandedSections] = useState({ description: true, specs: false });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
                setRfqData({ 
                    title: `Business Inquiry: ${data.name}`, 
                    description: '',
                    quantity: data.minOrderQuantity || 1 
                });
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleSendRFQ = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/rfq', {
                productId: product._id,
                ...rfqData
            }, config);
            setSuccessMsg('Inquiry Sent Successfully!');
            setTimeout(() => { setRfqModal(false); setSuccessMsg(''); }, 3000);
        } catch (error) {
            alert('Failed to send inquiry');
        }
    };

    const handlePayment = async () => {
        if (!user) { navigate('/login'); return; }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('http://localhost:5000/api/payment/create-order', {
                productId: product._id,
                amount: product.price * rfqData.quantity,
                quantity: rfqData.quantity,
                sellerId: product.seller._id
            }, config);

            const { order } = data;

            const options = {
                key: "rzp_test_SNzPfkHs3w4syf", 
                amount: order.amount,
                currency: order.currency,
                name: "Bharat Mart",
                description: `Purchase: ${product.name}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('http://localhost:5000/api/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, config);

                        if (verifyRes.data.success) {
                            setSuccessMsg('Payment Successful!');
                            setTimeout(() => setSuccessMsg(''), 5000);
                        }
                    } catch (err) {
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phoneNumber || ""
                },
                theme: { color: "#2563eb" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            alert('Payment Initiation Failed');
        }
    };

    if (loading) return (
        <div className="bm-premium-loader">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="loader-nucleus"
            />
            <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                Crafting Your Experience...
            </motion.p>
        </div>
    );

    if (!product) return <div className="p-20 text-center font-bold" style={{ color: 'var(--secondary)' }}>Product vanished into thin air.</div>;

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="bm-product-page">
            <AnimatePresence>
                {successMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="bm-notification-toast"
                    >
                        <CheckCircle2 color="#22c55e" size={24} />
                        <div>
                            <h4>Order Status</h4>
                            <p>{successMsg}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bm-max-container">
                {/* Immersive Breadcrumb */}
                <header className="bm-page-header">
                    <button onClick={() => navigate(-1)} className="bm-glass-btn">
                        <ChevronLeft size={18} /> Back
                    </button>
                    <nav className="bm-breadcrumbs">
                        <span>Bharat Mart</span>
                        <ChevronRightIcon />
                        <span>{product.category}</span>
                        <ChevronRightIcon />
                        <span className="current">{product.name}</span>
                    </nav>
                </header>

                <main className="bm-layout-grid">
                    {/* Visual Section */}
                    <div className="bm-visual-stack">
                        <motion.div 
                            layoutId="product-main-view"
                            className="bm-main-display"
                        >
                            <img 
                                src={product.images[activeImage] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'} 
                                alt={product.name} 
                            />
                            <div className="bm-badge-stack">
                                {product.isVerified && <span className="badge verified"><ShieldCheck size={14} /> Verified</span>}
                                {product.discount && <span className="badge offer">-{product.discount}%</span>}
                            </div>
                            <div className="bm-interaction-layers">
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setWishlisted(!wishlisted)}
                                    className={`action-circle ${wishlisted ? 'active' : ''}`}
                                >
                                    <Heart size={20} fill={wishlisted ? "#ef4444" : "none"} color={wishlisted ? "#ef4444" : "var(--foreground)"} />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.1 }} className="action-circle"><Share2 size={20} /></motion.button>
                            </div>
                        </motion.div>

                        <div className="bm-thumbnail-slider">
                            {product.images.map((img, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setActiveImage(i)}
                                    className={`bm-thumb-item ${activeImage === i ? 'focused' : ''}`}
                                >
                                    <img src={img} alt="" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bm-content-stack">
                        <div className="bm-product-identity">
                            <span className="bm-supra-text">{product.brand || 'Premium Selection'}</span>
                            <h1>{product.name}</h1>
                            <div className="bm-rating-snap">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= 4 ? "#fbbf24" : "none"} color={s <= 4 ? "#fbbf24" : "var(--border)"} />)}
                                </div>
                                <span>(4.8 / 5 Rating)</span>
                                <span className="sold-count">• {Math.floor(Math.random() * 500) + 100}+ Units Sold recently</span>
                            </div>
                        </div>

                        <div className="bm-pricing-engine">
                            <div className="price-tag">
                                <span className="currency">₹</span>
                                <span className="amount">{product.price.toLocaleString()}</span>
                                <span className="unit">/Piece</span>
                            </div>
                            <div className="tax-legend">
                                <p><Check size={14} color="#22c55e" /> Inclusive of GST & Duties</p>
                                <p><Check size={14} color="#22c55e" /> Free Express Delivery</p>
                            </div>
                        </div>

                        <div className="bm-order-configuration">
                            <div className="config-grid">
                                <div className="config-box">
                                    <label><Package size={14} /> Min Order</label>
                                    <p>{product.minOrderQuantity || 1} Units</p>
                                </div>
                                <div className="config-box">
                                    <label><Clock size={14} /> Shipping</label>
                                    <p>{product.deliveryTime || '24-48 Hours'}</p>
                                </div>
                                <div className="config-box">
                                    <label><Zap size={14} /> Availability</label>
                                    <p style={{ color: (product.countInStock || 0) > 0 ? '#10b981' : '#ef4444' }}>
                                        {(product.countInStock || 0) > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
                                    </p>
                                </div>
                            </div>

                            <div className="bm-cta-hub">
                                <motion.button 
                                    whileHover={{ scale: (product.countInStock || 0) < rfqData.quantity ? 1 : 1.02 }}
                                    whileTap={{ scale: (product.countInStock || 0) < rfqData.quantity ? 1 : 0.98 }}
                                    onClick={handlePayment} 
                                    className="bm-primary-cta"
                                    disabled={loading || (product.countInStock || 0) < rfqData.quantity}
                                    style={{ 
                                        opacity: (product.countInStock || 0) < rfqData.quantity ? 0.7 : 1,
                                        cursor: (product.countInStock || 0) < rfqData.quantity ? 'not-allowed' : 'pointer',
                                        background: (product.countInStock || 0) < rfqData.quantity ? '#6b7280' : 'var(--brand-blue)'
                                    }}
                                >
                                    <Zap size={20} /> {(product.countInStock || 0) < rfqData.quantity ? 'Out of Stock' : 'Buy It Now'}
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setRfqModal(true)} 
                                    className="bm-secondary-cta"
                                >
                                    <MessageSquare size={20} /> Bulk Inquiry
                                </motion.button>
                            </div>
                        </div>

                        <div className="bm-accordion-system">
                            <div className={`bm-accordion-item ${expandedSections.description ? 'open' : ''}`}>
                                <button onClick={() => toggleSection('description')}>
                                    <span>Product Story</span>
                                    {expandedSections.description ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                <motion.div 
                                    initial={false}
                                    animate={{ height: expandedSections.description ? 'auto' : 0, opacity: expandedSections.description ? 1 : 0 }}
                                    className="accordion-content"
                                >
                                    <p>{product.description || "Indulge in the finest quality product designed for excellence and durability. Bharat Mart ensures every unit meets global standards of craftsmanship."}</p>
                                </motion.div>
                            </div>

                            <div className={`bm-accordion-item ${expandedSections.specs ? 'open' : ''}`}>
                                <button onClick={() => toggleSection('specs')}>
                                    <span>Technical Specifications</span>
                                    {expandedSections.specs ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                <motion.div 
                                    initial={false}
                                    animate={{ height: expandedSections.specs ? 'auto' : 0, opacity: expandedSections.specs ? 1 : 0 }}
                                    className="accordion-content"
                                >
                                    <div className="specs-grid">
                                        {product.specifications && product.specifications.length > 0 ? (
                                            product.specifications.map((spec, i) => (
                                                <div key={i} className="spec-row">
                                                    <span>{spec.key}</span>
                                                    <span>{spec.value}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                <div className="spec-row"><span>Material</span><span>High-Grade Choice</span></div>
                                                <div className="spec-row"><span>Origin</span><span>{product.origin || 'Made in India'}</span></div>
                                                <div className="spec-row"><span>Packaging</span><span>{product.packagingType || 'Standard'}</span></div>
                                                <div className="spec-row"><span>Brand</span><span>{product.brand || 'Generic'}</span></div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Seller Profile Sidebar */}
                    <aside className="bm-sidebar-stack">
                        <section className="bm-seller-profile-card">
                            <div className="card-header">
                                <div className="seller-avatar">
                                    {product.seller?.companyName?.charAt(0) || 'B'}
                                </div>
                                <div className="seller-details">
                                    <h3>{product.seller?.companyName || 'Bharat Enterprises'}</h3>
                                    <p><MapPin size={12} /> {product.seller?.address || 'Mumbai, MH, India'}</p>
                                </div>
                            </div>

                            <div className="seller-achievements">
                                <div className="ach-box">
                                    <Award size={18} color="#3b82f6" />
                                    <span>5+ Years</span>
                                </div>
                                <div className="ach-box">
                                    <Briefcase size={18} color="#3b82f6" />
                                    <span>Verified Seller</span>
                                </div>
                                <div className="ach-box">
                                    <Globe size={18} color="#3b82f6" />
                                    <span>Global Export</span>
                                </div>
                            </div>

                            <div className="seller-contact-actions">
                                <a href={`tel:${product.seller?.phoneNumber}`} className="contact-link phone">
                                    <Phone size={16} /> <span>Call Seller</span>
                                </a>
                                <button onClick={() => setRfqModal(true)} className="contact-link chat">
                                    <MessageSquare size={16} /> <span>Chat Inquiry</span>
                                </button>
                            </div>
                        </section>

                        <div className="bm-trust-banner">
                            <ShieldCheck size={32} color="#10b981" />
                            <div>
                                <h5>Buyer Protection</h5>
                                <p>100% Secure transactions with Escrow protection on every purchase.</p>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>

            {/* Premium RFQ Modal */}
            <AnimatePresence>
                {rfqModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bm-modal-overlay"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bm-glass-modal"
                        >
                            <button onClick={() => setRfqModal(false)} className="close-btn"><X size={24} /></button>
                            <div className="modal-header">
                                <h2>Request for Quote</h2>
                                <p>Send your requirements directly to the manufacturer.</p>
                            </div>
                            
                            <form onSubmit={handleSendRFQ}>
                                <div className="form-group">
                                    <label>What are you looking for?</label>
                                    <input 
                                        type="text" 
                                        placeholder="Specific model or requirements..."
                                        value={rfqData.title} 
                                        onChange={e => setRfqData({...rfqData, title: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description (Optional)</label>
                                    <textarea 
                                        placeholder="Size, color, shipping details..."
                                        value={rfqData.description} 
                                        onChange={e => setRfqData({...rfqData, description: e.target.value})} 
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Required Quantity</label>
                                        <div className="qty-picker">
                                            <input 
                                                type="number" 
                                                min={product.minOrderQuantity} 
                                                value={rfqData.quantity} 
                                                onChange={e => setRfqData({...rfqData, quantity: e.target.value})} 
                                            />
                                            <span>Units</span>
                                        </div>
                                    </div>
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" 
                                    className="bm-submit-btn"
                                >
                                    Send Inquiry <Send size={18} />
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .bm-product-page {
                    background: var(--background);
                    color: var(--foreground);
                    font-family: 'Inter', -apple-system, sans-serif;
                    padding-bottom: 100px;
                    min-height: 100vh;
                }

                .bm-max-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 40px;
                }

                /* Header & Nav */
                .bm-page-header {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    padding: 40px 0;
                }

                .bm-glass-btn {
                    display: flex; align-items: center; gap: 8px;
                    padding: 10px 18px; border-radius: 100px;
                    background: var(--card); border: 1px solid var(--border);
                    font-weight: 600; color: var(--foreground); font-size: 0.9rem;
                    transition: 0.3s;
                }
                .bm-glass-btn:hover { background: var(--accent); border-color: var(--border); color: var(--foreground); }

                .bm-breadcrumbs {
                    display: flex; align-items: center; gap: 10px;
                    font-size: 0.85rem; color: var(--secondary); font-weight: 500;
                }
                .bm-breadcrumbs .current { color: var(--foreground); font-weight: 700; }

                /* Grid Layout */
                .bm-layout-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 340px;
                    gap: 60px;
                    align-items: start;
                }

                /* Visual Stack */
                .bm-visual-stack {
                    position: sticky;
                    top: 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .bm-main-display {
                    position: relative;
                    background: var(--card);
                    border-radius: 24px;
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    border: 1px solid var(--border);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
                }
                .bm-main-display img { width: 100%; height: 100%; object-fit: contain; padding: 40px; }

                .bm-badge-stack {
                    position: absolute; top: 20px; left: 20px;
                    display: flex; flex-direction: column; gap: 10px;
                }
                .badge {
                    padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 0.75rem;
                    text-transform: uppercase; letter-spacing: 0.5px;
                }
                .badge.verified { background: #ecfdf5; color: #059669; display: flex; align-items: center; gap: 6px; }
                .badge.offer { background: #fff1f2; color: #e11d48; }

                .bm-interaction-layers {
                    position: absolute; top: 20px; right: 20px;
                    display: flex; flex-direction: column; gap: 12px;
                }
                .action-circle {
                    width: 44px; height: 44px; border-radius: 50%;
                    background: var(--card); border: 1px solid var(--border);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    color: var(--secondary); transition: 0.3s;
                }
                .action-circle:hover { color: var(--foreground); background: var(--accent); }
                .action-circle.active { background: var(--card); color: #ef4444; border-color: #fee2e2; }

                .bm-thumbnail-slider {
                    display: flex; gap: 15px; overflow-x: auto; padding: 10px 0;
                    scrollbar-width: none;
                }
                .bm-thumb-item {
                    width: 80px; height: 80px; flex-shrink: 0;
                    border-radius: 16px; border: 2px solid transparent;
                    overflow: hidden; cursor: pointer; background: var(--card);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.02);
                }
                .bm-thumb-item.focused { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
                .bm-thumb-item img { width: 100%; height: 100%; object-fit: contain; padding: 5px; }

                /* Content Column */
                .bm-content-stack {
                    display: flex; flex-direction: column; gap: 40px;
                }

                .bm-supra-text {
                    font-size: 0.85rem; font-weight: 800; color: var(--primary);
                    text-transform: uppercase; letter-spacing: 2px;
                }

                .bm-product-identity h1 {
                    font-size: 2.8rem; font-weight: 800; margin: 15px 0;
                    line-height: 1.1; color: var(--foreground);
                }

                .bm-rating-snap { display: flex; align-items: center; gap: 15px; color: var(--secondary); font-size: 0.9rem; }
                .bm-rating-snap .stars { display: flex; gap: 2px; }

                .bm-pricing-engine {
                    background: var(--accent); padding: 35px; border-radius: 24px;
                }
                .price-tag { display: flex; align-items: baseline; gap: 8px; }
                .price-tag .currency { font-size: 1.5rem; font-weight: 600; color: var(--foreground); }
                .price-tag .amount { font-size: 3.5rem; font-weight: 900; color: var(--foreground); letter-spacing: -2px; }
                .price-tag .unit { font-size: 1.1rem; color: var(--secondary); font-weight: 500; }

                .tax-legend { margin-top: 20px; display: flex; gap: 25px; }
                .tax-legend p { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: var(--secondary); }

                .bm-order-configuration {
                    display: flex; flex-direction: column; gap: 30px;
                }
                .config-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; }
                .config-box {
                    padding: 20px; border-radius: 16px; border: 1.5px solid var(--border);
                    background: var(--card);
                }
                .config-box label { display: flex; align-items: center; gap: 6px; color: var(--secondary); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
                .config-box p { font-size: 1.1rem; font-weight: 700; color: var(--foreground); margin-top: 8px; }

                .bm-cta-hub { display: flex; gap: 20px; }
                .bm-primary-cta, .bm-secondary-cta {
                    flex: 1; height: 64px; border-radius: 16px; font-weight: 800;
                    font-size: 1.1rem; display: flex; align-items: center; justify-content: center;
                    gap: 12px; cursor: pointer; transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                }
                .bm-primary-cta { background: var(--foreground); color: var(--background); border: none; }
                .bm-primary-cta:hover { opacity: 0.9; transform: translateY(-4px); box-shadow: 0 10px 20px -10px rgba(0,0,0,0.3); }
                .bm-secondary-cta { background: var(--card); color: var(--foreground); border: 2px solid var(--border); }
                .bm-secondary-cta:hover { border-color: var(--primary); color: var(--primary); }

                /* Accordion */
                .bm-accordion-system { border-top: 1px solid var(--border); }
                .bm-accordion-item { border-bottom: 1px solid var(--border); }
                .bm-accordion-item button {
                    width: 100%; padding: 25px 0; background: none; display: flex;
                    justify-content: space-between; align-items: center;
                    font-size: 1.1rem; font-weight: 700; color: var(--foreground);
                }
                .accordion-content { overflow: hidden; }
                .accordion-content p { color: var(--secondary); line-height: 1.8; padding-bottom: 25px; }

                .specs-grid { display: flex; flex-direction: column; gap: 12px; padding-bottom: 25px; }
                .spec-row { display: flex; justify-content: space-between; font-size: 0.95rem; }
                .spec-row span:first-child { color: var(--secondary); font-weight: 500; }
                .spec-row span:last-child { color: var(--foreground); font-weight: 700; }

                /* Sidebar */
                .bm-seller-profile-card {
                    background: var(--card); border-radius: 24px; padding: 30px;
                    border: 1px solid var(--border); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
                    margin-bottom: 20px;
                }
                .card-header { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
                .seller-avatar {
                    width: 56px; height: 56px; border-radius: 16px;
                    background: linear-gradient(135deg, var(--primary), #2563eb);
                    color: #fff; display: flex; align-items: center; justify-content: center;
                    font-size: 1.5rem; font-weight: 800;
                }
                .seller-details h3 { font-size: 1.1rem; font-weight: 800; margin: 0; color: var(--foreground); }
                .seller-details p { font-size: 0.8rem; color: var(--secondary); margin-top: 4px; display: flex; align-items: center; gap: 4px; }

                .seller-achievements {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 25px;
                }
                .ach-box {
                    background: var(--accent); padding: 12px; border-radius: 12px;
                    display: flex; flex-direction: column; align-items: center; gap: 6px;
                    text-align: center;
                }
                .ach-box span { font-size: 0.7rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; }

                .seller-contact-actions { display: flex; flex-direction: column; gap: 12px; }
                .contact-link {
                    height: 48px; border-radius: 12px; display: flex; align-items: center;
                    justify-content: center; gap: 10px; font-weight: 700; font-size: 0.9rem;
                    transition: 0.3s;
                }
                .contact-link.phone { background: var(--primary); color: #fff; }
                .contact-link.chat { border: 2px solid var(--border); color: var(--foreground); background: var(--card); }

                .bm-trust-banner {
                    background: var(--accent); border: 1px solid var(--border);
                    padding: 20px; border-radius: 20px; display: flex; gap: 15px; align-items: flex-start;
                }
                .bm-trust-banner h5 { margin: 0; font-weight: 800; color: var(--foreground); font-size: 0.95rem; }
                .bm-trust-banner p { font-size: 0.8rem; color: var(--secondary); margin-top: 5px; line-height: 1.4; font-weight: 500; }

                /* Modal styling */
                .bm-modal-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(8px); display: flex; align-items: center;
                    justify-content: center; z-index: 1000; padding: 20px;
                }
                .bm-glass-modal {
                    background: var(--card); border-radius: 32px; width: 100%;
                    max-width: 540px; padding: 50px; position: relative;
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,0.25);
                    border: 1px solid var(--border);
                }
                .close-btn { position: absolute; top: 30px; right: 30px; border: none; background: var(--accent); width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--foreground); }

                .modal-header h2 { font-size: 2rem; font-weight: 900; color: var(--foreground); }
                .modal-header p { color: var(--secondary); margin-top: 10px; font-weight: 500; }

                .form-group { margin-top: 25px; }
                .form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--secondary); margin-bottom: 10px; }
                .form-group input, .form-group textarea {
                    width: 100%; padding: 16px; border-radius: 16px; border: 2px solid var(--border);
                    background: var(--accent); font-size: 1rem; color: var(--foreground); transition: 0.3s; outline: none;
                }
                .form-group input:focus { border-color: var(--primary); background: var(--card); }
                .form-group textarea { height: 120px; resize: none; }

                .qty-picker { display: flex; align-items: center; gap: 12px; }
                .qty-picker input { width: 100px; text-align: center; }
                .qty-picker span { font-weight: 700; color: var(--secondary); }

                .bm-submit-btn {
                    width: 100%; height: 60px; background: var(--primary); color: #fff;
                    border: none; border-radius: 16px; font-weight: 800; font-size: 1.1rem;
                    margin-top: 40px; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 12px;
                }

                /* Loader */
                .bm-premium-loader {
                    height: 100vh; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; gap: 20px;
                    background: var(--background);
                }
                .loader-nucleus {
                    width: 50px; height: 50px; border: 3px solid var(--border);
                    border-top-color: var(--primary); border-radius: 50%;
                }
                .bm-premium-loader p { font-weight: 700; color: var(--secondary); font-size: 0.9rem; letter-spacing: 1px; }

                /* Toast */
                .bm-notification-toast {
                    position: fixed; top: 30px; right: 30px; background: var(--card);
                    padding: 20px 30px; border-radius: 20px; display: flex; align-items: center; gap: 20px;
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); z-index: 2000; border: 1px solid var(--border);
                }
                .bm-notification-toast h4 { margin: 0; font-weight: 800; color: var(--foreground); }
                .bm-notification-toast p { margin: 2px 0 0; font-size: 0.85rem; color: #22c55e; font-weight: 600; }

                @media (max-width: 1200px) {
                    .bm-layout-grid { grid-template-columns: 1fr; }
                    .bm-visual-stack { position: relative; top: 0; }
                    .bm-sidebar-stack { order: -1; }
                }
                @media (max-width: 768px) {
                    .bm-max-container { padding: 0 20px; }
                    .bm-product-identity h1 { font-size: 2rem; }
                    .bm-pricing-engine .amount { font-size: 2.5rem; }
                    .price-tag .amount { font-size: 2.5rem; }
                    .bm-cta-hub { flex-direction: column; }
                }
            `}</style>
        </div>
    );
};

const ChevronRightIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

export default ProductDetail;
