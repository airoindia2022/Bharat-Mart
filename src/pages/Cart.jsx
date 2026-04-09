import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react';

const Cart = () => {
    const { 
        cartItems, 
        removeFromCart, 
        updateQuantity, 
        getCartTotal, 
        clearCart 
    } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '8px' }}><ArrowLeft size={18} /></button>
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Shopping Cart</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}>
                {/* Cart Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {cartItems.map(item => (
                        <div key={item._id} className="card" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <img 
                                src={item.images?.[0] || 'https://via.placeholder.com/100'} 
                                alt={item.name} 
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                            />
                            <div style={{ flex: 1 }}>
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
                <div className="card" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
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
                        onClick={() => navigate('/orders')}
                    >
                        Proceed to Checkout <ChevronRight size={20} />
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
