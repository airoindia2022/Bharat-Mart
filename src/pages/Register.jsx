import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Building, Phone, MapPin, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'customer',
        companyName: '', phoneNumber: '', address: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 70px)', padding: '50px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--accent)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Create Account</h1>
                    <p style={{ color: 'var(--secondary)' }}>Join Bharat Mart B2B Network</p>
                </div>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                <input type="text" name="name" className="input" style={{ paddingLeft: '40px' }} placeholder="John Doe" onChange={handleChange} required />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                <input type="email" name="email" className="input" style={{ paddingLeft: '40px' }} placeholder="john@example.com" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                <input type="password" name="password" className="input" style={{ paddingLeft: '40px' }} placeholder="••••••••" onChange={handleChange} required />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Account Type</label>
                            <select name="role" className="input" value={formData.role} onChange={handleChange} required>
                                <option value="customer">Customer (Buyer)</option>
                                <option value="seller">Seller (Supplier)</option>
                            </select>
                        </div>
                    </div>

                    {formData.role === 'seller' && (
                        <>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Company Name</label>
                                <div style={{ position: 'relative' }}>
                                    <Building size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                    <input type="text" name="companyName" className="input" style={{ paddingLeft: '40px' }} placeholder="ABC Pvt Ltd" onChange={handleChange} required />
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                    <input type="text" name="phoneNumber" className="input" style={{ paddingLeft: '40px' }} placeholder="+91 9876543210" onChange={handleChange} required />
                                </div>
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Address</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                    <input type="text" name="address" className="input" style={{ paddingLeft: '40px' }} placeholder="123 Main St, City, State" onChange={handleChange} required />
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center' }} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                    </button>
                </form>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--secondary)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
