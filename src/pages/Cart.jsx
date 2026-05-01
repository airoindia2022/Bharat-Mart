import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as paymentService from '../services/payment.service';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { 
        cartItems, 
        removeFromCart, 
        updateQuantity, 
        getCartTotal, 
        clearCart 
    } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const { key } = await paymentService.getRazorpayKey();
            const data = await paymentService.createCartOrder({
                cartItems: cartItems.map(item => ({
                    _id: item._id,
                    quantity: item.quantity,
                    price: item.price,
                    seller: item.seller?._id || item.seller // Support both populated and ID
                })),
                totalAmount: getCartTotal()
            });

            const { order } = data;

            const options = {
                key, // Use dynamic key from backend
                amount: order.amount,
                currency: order.currency,
                name: "BazaarIndia",
                description: "Cart Checkout",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyData = await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyData.success) {
                            setSuccessMsg('Payment Successful! Your order has been placed.');
                            clearCart();
                            setTimeout(() => {
                                setSuccessMsg('');
                                navigate('/orders');
                            }, 3000);
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
            console.error('Checkout error:', error);
            alert(error.response?.data?.message || 'Payment Initiation Failed');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !successMsg) {
        return (
            <div className="container" style={{ padding: '80px 1rem', textAlign: 'center' }}>
                <div style={{ backgroundColor: 'var(--accent)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--secondary)' }}>
                    <ShoppingBag size={50} />
                </div>
                <h2>Your cart is empty</h2>
                <p style={{ color: 'var(--secondary)', marginTop: '10px', marginBottom: '30px' }}>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/products" className="btn btn-primary" style={{ padding: '12px 30px' }}>
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 1rem' }}>
            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="bm-notification-toast"
                        style={{
                            position: 'fixed', top: '30px', right: '30px', backgroundColor: 'var(--card)',
                            padding: '20px 30px', border_radius: '20px', display: 'flex', alignItems: 'center', gap: '20px',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', zIndex: 2000, border: '1px solid var(--border)'
                        }}
                    >
                        <CheckCircle2 color="#22c55e" size={24} />
                        <div>
                            <h4 style={{ margin: 0 }}>Success</h4>
                            <p style={{ margin: '2px 0 0', color: '#22c55e', fontWeight: 600 }}>{successMsg}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '8px' }}><ArrowLeft size={18} /></button>
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Shopping Cart</h1>
            </div>

            <div className="cart-grid" style={{ display: 'flex', gap: '30px', alignItems: 'start', flexWrap: 'wrap' }}>
                {/* Cart Items List */}
                <div className="md-w-full" style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {cartItems.map(item => (
                        <div key={item._id} className="card cart-item-card" style={{ padding: '20px' }}>
                            <div className="md-flex-col" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <img 
                                    src={item.images?.[0] || 'https://via.placeholder.com/100'} 
                                    alt={item.name} 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    className="md-w-full"
                                />
                                <div style={{ flex: 1, width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{item.name}</h3>
                                            <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{item.category}</p>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item._id)}
                                            style={{ color: 'var(--error)', backgroundColor: 'transparent', padding: '5px' }}
                                            title="Remove Item"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--accent)', padding: '5px 12px', borderRadius: '8px' }}>
                                            <button 
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                style={{ color: 'var(--foreground)', background: 'none' }}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span style={{ fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                style={{ color: 'var(--foreground)', background: 'none' }}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--brand-green)' }}>
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button 
                        onClick={clearCart} 
                        className="btn btn-outline" 
                        style={{ alignSelf: 'flex-start', color: 'var(--error)', borderColor: 'var(--error)' }}
                    >
                        <Trash2 size={16} /> Clear Cart
                    </button>
                </div>

                {/* Summary Section */}
                <div className="card summary-card md-w-full" style={{ padding: '30px', flex: '0 0 350px', position: 'sticky', top: '100px', minWidth: '300px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Order Summary</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--secondary)' }}>Subtotal</span>
                            <span>₹{getCartTotal().toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--secondary)' }}>Shipping</span>
                            <span style={{ color: 'var(--brand-green)', fontWeight: 'bold' }}>FREE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--secondary)' }}>Taxes</span>
                            <span>Included</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total</span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--brand-blue)' }}>₹{getCartTotal().toLocaleString()}</span>
                    </div>
                    
                    <button 
                        className="btn btn-primary" 
                        style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1.1rem' }}
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Pay with Razorpay'} <ChevronRight size={20} />
                    </button>
                    
                    <Link 
                        to="/products" 
                        style={{ display: 'block', textAlign: 'center', marginTop: '15px', color: 'var(--secondary)', fontSize: '0.9rem' }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
