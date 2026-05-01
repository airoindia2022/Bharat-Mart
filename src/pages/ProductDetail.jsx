import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as productService from '../services/product.service';
import * as paymentService from '../services/payment.service';
import * as authService from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    ShieldCheck,
    MapPin,
    ChevronLeft,
    Star,
    Truck,
    Clock,
    CheckCircle2,
    Package,
    ArrowRight,
    Zap,
    Share2,
    ShoppingCart,
    Info,
    Check,
    Briefcase,
    Globe,
    Award,
    ChevronDown,
    ChevronUp,
    Plus,
    Minus
} from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState({ title: '', description: '', quantity: 1 });
    const [successMsg, setSuccessMsg] = useState('');
    const [activeImage, setActiveImage] = useState(0);
    const [expandedSections, setExpandedSections] = useState({ description: true, specs: false, reviews: false });
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id, controller.signal);
                setProduct(data);
                setOrderData(prev => ({ ...prev, quantity: 1 }));


            } catch (error) {
                if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
                    console.error('Error fetching product:', error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
        return () => controller.abort();
    }, [id, user]);



    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');
        try {
            await productService.createProductReview(id, {
                rating: reviewRating,
                comment: reviewComment
            });
            setReviewSuccess('Review submitted successfully!');
            setReviewComment('');
            // Refresh product to show new review
            const updatedProduct = await productService.getProductById(id);
            setProduct(updatedProduct);
        } catch (error) {
            if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
                setReviewError(error.response?.data?.message || 'Failed to submit review');
            }
        }
    };

    const handlePayment = async () => {
        if (!user) { navigate('/login'); return; }

        try {
            const { key } = await paymentService.getRazorpayKey();
            const data = await paymentService.createOrder({
                productId: product._id,
                amount: product.price * orderData.quantity,
                quantity: orderData.quantity,
                sellerId: product.seller._id
            });

            const { order } = data;

            const options = {
                key,
                amount: order.amount,
                currency: order.currency,
                name: "BazaarIndia",
                description: `Purchase: ${product.name}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyData = await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyData.success) {
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
                        <span>BazaarIndia</span>
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
                                    onClick={() => addToCart(product, 1)}
                                    className="action-circle"
                                    title="Add to Cart"
                                >
                                    <ShoppingCart size={20} color="var(--brand-blue)" />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.1 }} className="action-circle" title="Share Product"><Share2 size={20} /></motion.button>
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
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= Math.round(product.rating || 0) ? "#fbbf24" : "none"} color={s <= Math.round(product.rating || 0) ? "#fbbf24" : "var(--border)"} />)}
                                </div>
                                <div className="rating-info">
                                    <span className="rating-value">{product.rating ? product.rating.toFixed(1) : 'No'}</span>
                                    <span className="review-count">({product.numReviews || 0} Reviews)</span>
                                </div>
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

                                <div className="config-box qty-box">
                                    <label><ShoppingBag size={14} /> Buy Quantity</label>
                                    <div className="qty-picker-inline">
                                        <button
                                            type="button"
                                            onClick={() => setOrderData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                                            disabled={orderData.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <input
                                            type="number"
                                            value={orderData.quantity}
                                            onChange={e => setOrderData(prev => ({
                                                ...prev,
                                                quantity: Math.max(1, Math.min(product.countInStock || 9999, parseInt(e.target.value) || 1))
                                            }))}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setOrderData(prev => ({ ...prev, quantity: Math.min(product.countInStock || 9999, prev.quantity + 1) }))}
                                            disabled={orderData.quantity >= (product.countInStock || 9999)}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
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
                                    whileHover={{ y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => addToCart(product, orderData.quantity)}
                                    className="bm-minimal-btn secondary"
                                    disabled={loading || (product.countInStock || 0) < orderData.quantity}
                                >
                                    <ShoppingCart size={20} />
                                    <span>Add to Cart</span>
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handlePayment}
                                    className="bm-minimal-btn primary"
                                    disabled={loading || (product.countInStock || 0) < orderData.quantity}
                                >
                                    <Zap size={20} fill="currentColor" />
                                    <span>
                                        {(product.countInStock || 0) < orderData.quantity ? 'Out of Stock' : 'Buy Now'}
                                    </span>
                                </motion.button>
                            </div>
                            <div className={`bm-accordion-item ${expandedSections.reviews ? 'open' : ''}`}>
                                <button onClick={() => toggleSection('reviews')}>
                                    <span>Customer Reviews</span>
                                    {expandedSections.reviews ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{ height: expandedSections.reviews ? 'auto' : 0, opacity: expandedSections.reviews ? 1 : 0 }}
                                    className="accordion-content"
                                >
                                    <div className="bm-reviews-container">
                                        <div className="bm-reviews-list">
                                            {product.reviews && product.reviews.length > 0 ? (
                                                product.reviews.map((review, i) => (
                                                    <div key={i} className="review-card">
                                                        <div className="review-meta">
                                                            <strong>{review.name}</strong>
                                                            <div className="review-stars">
                                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill={s <= review.rating ? "#fbbf24" : "none"} color={s <= review.rating ? "#fbbf24" : "var(--border)"} />)}
                                                            </div>
                                                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="review-comment">{review.comment}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="no-reviews">No reviews yet. Be the first to share your experience!</p>
                                            )}
                                        </div>

                                        {user ? (
                                            <div className="bm-review-form">
                                                <h4>Write a Review</h4>
                                                {reviewSuccess && <p className="success-msg">{reviewSuccess}</p>}
                                                {reviewError && <p className="error-msg">{reviewError}</p>}
                                                <form onSubmit={submitReviewHandler}>
                                                    <div className="form-group">
                                                        <label>Rating</label>
                                                        <select value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}>
                                                            <option value="5">5 - Excellent</option>
                                                            <option value="4">4 - Very Good</option>
                                                            <option value="3">3 - Good</option>
                                                            <option value="2">2 - Fair</option>
                                                            <option value="1">1 - Poor</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Comment</label>
                                                        <textarea
                                                            rows="3"
                                                            value={reviewComment}
                                                            onChange={(e) => setReviewComment(e.target.value)}
                                                            placeholder="What did you like or dislike?"
                                                            required
                                                        ></textarea>
                                                    </div>
                                                    <button type="submit" className="bm-small-cta">Post Review</button>
                                                </form>
                                            </div>
                                        ) : (
                                            <div className="login-to-review">
                                                <p>Please <button onClick={() => navigate('/login')}>Login</button> to write a review</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
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
                                    <p>{product.description || "Indulge in the finest quality product designed for excellence and durability. BazaarIndia ensures every unit meets global standards of craftsmanship."}</p>
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
                                <div className="seller-avatar" style={{ overflow: 'hidden' }}>
                                    {product.seller?.logoURL ? (
                                        <img src={product.seller.logoURL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" />
                                    ) : (
                                        product.seller?.companyName?.charAt(0) || 'B'
                                    )}
                                </div>
                                <div className="seller-details">
                                    <h3>{product.seller?.companyName || 'BazaarIndia Enterprises'}</h3>
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

                @media (max-width: 1024px) {
                    .bm-max-container { padding: 0 20px; }
                }

                /* Header & Nav */
                .bm-page-header {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    padding: 40px 0;
                }

                @media (max-width: 768px) {
                    .bm-page-header { padding: 20px 0; gap: 15px; flex-direction: column; align-items: flex-start; }
                    .bm-breadcrumbs { display: none; }
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

                @media (max-width: 1200px) {
                    .bm-layout-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
                    .bm-sidebar-stack { grid-column: span 2; }
                }

                @media (max-width: 768px) {
                    .bm-layout-grid { grid-template-columns: 1fr; gap: 30px; }
                    .bm-sidebar-stack { grid-column: span 1; order: -1; }
                    .bm-visual-stack { position: relative; top: 0; }
                }

                /* Visual Stack */
                .bm-visual-stack {
                    display: flex;
                    flex-direction: column; gap: 20px;
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

                @media (max-width: 768px) {
                    .bm-content-stack { gap: 25px; }
                }

                .bm-supra-text {
                    font-size: 0.85rem; font-weight: 800; color: var(--primary);
                    text-transform: uppercase; letter-spacing: 2px;
                }

                .bm-product-identity h1 {
                    font-size: 2.8rem; font-weight: 800; margin: 15px 0;
                    line-height: 1.1; color: var(--foreground);
                }

                @media (max-width: 768px) {
                    .bm-product-identity h1 { font-size: 1.8rem; }
                }

                .bm-rating-snap { display: flex; align-items: center; gap: 15px; color: var(--secondary); font-size: 0.9rem; }
                .bm-rating-snap .stars { display: flex; gap: 2px; }

                .bm-pricing-engine {
                    background: var(--accent); padding: 35px; border-radius: 24px;
                }
                
                @media (max-width: 768px) {
                    .bm-pricing-engine { padding: 20px; }
                }

                .price-tag { display: flex; align-items: baseline; gap: 8px; }
                .price-tag .currency { font-size: 1.5rem; font-weight: 600; color: var(--foreground); }
                .price-tag .amount { font-size: 3.5rem; font-weight: 900; color: var(--foreground); letter-spacing: -2px; }
                .price-tag .unit { font-size: 1.1rem; color: var(--secondary); font-weight: 500; }

                @media (max-width: 768px) {
                    .price-tag .amount { font-size: 2.5rem; }
                }

                .tax-legend { margin-top: 20px; display: flex; gap: 25px; flex-wrap: wrap; }
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

                .qty-picker-inline {
                    display: flex; align-items: center; gap: 10px; margin-top: 10px;
                }
                .qty-picker-inline button {
                    width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--border);
                    background: var(--accent); color: var(--foreground); display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: 0.2s;
                }
                .qty-picker-inline button:hover:not(:disabled) { background: var(--foreground); color: var(--background); border-color: var(--foreground); }
                .qty-picker-inline button:disabled { opacity: 0.3; cursor: not-allowed; }
                .qty-picker-inline input {
                    width: 45px; text-align: center; border: none; background: none;
                    font-weight: 800; color: var(--foreground); font-size: 1.1rem; padding: 0; outline: none;
                }
                .qty-picker-inline input::-webkit-outer-spin-button,
                .qty-picker-inline input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                .qty-picker-inline input[type=number] { -moz-appearance: textfield; }

                .bm-cta-hub { 
                    display: flex; 
                    gap: 12px; 
                    margin-top: 15px;
                }
                
                @media (max-width: 768px) {
                    .bm-cta-hub { gap: 10px; }
                }

                .bm-minimal-btn {
                    flex: 1;
                    height: 58px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    font-size: 1.05rem;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: none;
                    cursor: pointer;
                }

                .bm-minimal-btn.primary {
                    background: var(--foreground);
                    color: var(--background);
                }

                .bm-minimal-btn.secondary {
                    background: var(--background);
                    color: var(--foreground);
                    border: 1.5px solid var(--border);
                }

                .bm-minimal-btn.primary:hover {
                    opacity: 0.9;
                }

                .bm-minimal-btn.secondary:hover {
                    border-color: var(--foreground);
                    background: var(--accent);
                }

                .bm-minimal-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    filter: grayscale(1);
                    transform: none !important;
                }


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

                .bm-trust-banner {
                    background: var(--accent); border: 1px solid var(--border);
                    padding: 20px; border-radius: 20px; display: flex; gap: 15px; align-items: flex-start;
                }
                .bm-trust-banner h5 { margin: 0; font-weight: 800; color: var(--foreground); font-size: 0.95rem; }
                .bm-trust-banner p { font-size: 0.8rem; color: var(--secondary); margin-top: 5px; line-height: 1.4; font-weight: 500; }

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
                @media (max-width: 768px) { .bm-notification-toast { top: 10px; right: 10px; left: 10px; padding: 15px; } }
                .bm-notification-toast h4 { margin: 0; font-weight: 800; color: var(--foreground); }
                .bm-notification-toast p { margin: 2px 0 0; font-size: 0.85rem; color: #22c55e; font-weight: 600; }

                /* Reviews CSS */
                .bm-reviews-container { padding-bottom: 30px; }
                .review-card { padding: 15px; background: var(--accent); border-radius: 12px; margin-bottom: 15px; }
                .review-meta { display: flex; align-items: center; gap: 15px; margin-bottom: 8px; font-size: 0.85rem; }
                .review-stars { display: flex; gap: 2px; }
                .review-comment { font-size: 0.95rem; color: var(--foreground); line-height: 1.5; }
                .no-reviews { text-align: center; color: var(--secondary); padding: 20px; font-style: italic; }

                .bm-review-form { background: var(--card); padding: 20px; border-radius: 16px; border: 1px solid var(--border); margin-top: 20px; }
                .bm-review-form h4 { margin-bottom: 15px; font-weight: 800; }
                .bm-review-form .form-group { margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px; }
                .bm-review-form label { font-size: 0.8rem; font-weight: 700; color: var(--secondary); }
                .bm-review-form select, .bm-review-form textarea {
                    width: 100%; padding: 12px; border-radius: 10px; border: 1.5px solid var(--border);
                    background: var(--background); color: var(--foreground); font-family: inherit;
                }
                .bm-small-cta {
                    background: var(--foreground); color: var(--background);
                    padding: 10px 20px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer;
                    transition: 0.3s;
                }
                .bm-small-cta:hover { opacity: 0.8; }
                .success-msg { color: #22c55e; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem; }
                .error-msg { color: #ef4444; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem; }
                .login-to-review { margin-top: 20px; padding: 20px; background: var(--accent); border-radius: 12px; text-align: center; }
                .login-to-review button { background: none; border: none; font-weight: 800; color: var(--primary); cursor: pointer; text-decoration: underline; }
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
