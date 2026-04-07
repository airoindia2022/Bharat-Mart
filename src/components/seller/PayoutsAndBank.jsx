import React, { useState } from 'react';
import {
    IndianRupee, CheckCircle, Clock, AlertCircle,
    Copy, Check, ExternalLink, Wallet, Landmark,
    ArrowUpRight, ArrowDownLeft, ShieldCheck, Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PayoutsAndBank = ({ stats, orders }) => {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'bank', 'history'
    const [copied, setCopied] = useState(false);

    const [settingsData, setSettingsData] = useState({
        bankName: user?.bankName || '',
        accountNumber: user?.accountNumber || '',
        ifscCode: user?.ifscCode || '',
        accountHolderName: user?.accountHolderName || '',
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUpdateBank = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile(settingsData);
            alert('Bank details updated successfully!');
        } catch (error) {
            alert('Failed to update bank details');
        } finally {
            setIsSaving(false);
        }
    };

    const payoutOrders = orders.filter(o => o.status === 'Paid') || [];

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--foreground)' }}>Payouts & Financials</h1>
                    <p style={{ color: 'var(--secondary)' }}>Manage your earnings, settlement account, and track your transfers.</p>
                </div>
                <div style={{ display: 'flex', background: 'var(--accent)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: activeTab === 'overview' ? 'var(--card)' : 'transparent',
                            color: activeTab === 'overview' ? 'var(--primary)' : 'var(--secondary)',
                            boxShadow: activeTab === 'overview' ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: activeTab === 'history' ? 'var(--card)' : 'transparent',
                            color: activeTab === 'history' ? 'var(--primary)' : 'var(--secondary)',
                            boxShadow: activeTab === 'history' ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab('bank')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: activeTab === 'bank' ? 'var(--card)' : 'transparent',
                            color: activeTab === 'bank' ? 'var(--primary)' : 'var(--secondary)',
                            boxShadow: activeTab === 'bank' ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        Bank Settings
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Summary Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="card" style={{ background: 'linear-gradient(135deg, var(--brand-blue) 0%, #3b82f6 100%)', color: 'white', border: 'none' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)' }}>
                                        <Wallet size={24} />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.8 }}>Available for Payout</span>
                                </div>
                                <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>₹{stats?.netEarnings?.toFixed(2) || '0.00'}</h2>
                                <p style={{ fontSize: '0.85rem', marginTop: '10px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <ShieldCheck size={14} /> Auto-transfer enabled
                                </p>
                            </div>
                            <div className="card" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--success-bg)', color: 'var(--success)' }}>
                                        <ArrowUpRight size={24} />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary)' }}>Total Revenue (Gross)</span>
                                </div>
                                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--foreground)' }}>₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</h2>
                                <p style={{ fontSize: '0.85rem', marginTop: '10px', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <ArrowDownLeft size={14} /> -₹{(stats?.totalRevenue * 0.10).toFixed(2) || '0.00'} platform fee
                                </p>
                            </div>
                        </div>

                        {/* Recent Transfers Mini List */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontWeight: 700 }}>Recent Transfers</h3>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    View All
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {payoutOrders.slice(0, 3).map(order => (
                                    <div key={order._id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '16px', backgroundColor: 'var(--accent)', border: '1px solid var(--border)' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                            <IndianRupee size={20} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>₹{(order.amount * 0.90).toFixed(2)}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{new Date(order.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '2px' }}>Order #{order._id.substring(0, 8)}...</p>
                                        </div>
                                        <div style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            backgroundColor: order.isTransferredToSeller ? 'var(--success-bg)' : 'var(--warning-bg)',
                                            color: order.isTransferredToSeller ? 'var(--success)' : 'var(--warning)'
                                        }}>
                                            {order.isTransferredToSeller ? 'SUCCESSFUL' : 'PENDING'}
                                        </div>
                                    </div>
                                ))}
                                {payoutOrders.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--secondary)' }}>
                                        <Info size={40} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                                        <p>No transfers recorded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {/* Bank Status Sidebar */}
                        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}>
                                <Landmark size={120} />
                            </div>
                            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Settlement Account</h3>

                            {user.razorpayAccountId ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ padding: '15px', borderRadius: '16px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)30' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '5px' }}>
                                            <CheckCircle size={18} /> Account Linked
                                        </div>
                                        <p style={{ fontSize: '0.8rem' }}>Your store is connected to Razorpay Route for instant settlements.</p>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginBottom: '5px' }}>RAZORPAY ACCOUNT ID</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 15px', borderRadius: '12px', backgroundColor: 'var(--accent)', border: '1px solid var(--border)' }}>
                                            <code style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.razorpayAccountId}</code>
                                            <button onClick={() => handleCopy(user.razorpayAccountId)} style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer' }}>
                                                {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('bank')} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                                        View Bank Details
                                    </button>
                                </div>
                            ) : (user.bankName && user.accountNumber) ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ padding: '15px', borderRadius: '16px', backgroundColor: 'var(--brand-blue)10', color: 'var(--brand-blue)', border: '1px solid var(--brand-blue)30' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '5px' }}>
                                            <Clock size={18} /> Details Saved
                                        </div>
                                        <p style={{ fontSize: '0.8rem' }}>Account linking will be finalized automatically during your first successful sale.</p>
                                    </div>
                                    <div style={{ padding: '15px', borderRadius: '12px', backgroundColor: 'var(--accent)', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Bank</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.bankName}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Account</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>•••• {user.accountNumber.slice(-4)}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('bank')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                                        Edit Details
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid var(--warning)30', textAlign: 'center' }}>
                                        <AlertCircle size={32} style={{ margin: '0 auto 10px' }} />
                                        <h4 style={{ fontWeight: 700, marginBottom: '5px' }}>Missing Info</h4>
                                        <p style={{ fontSize: '0.8rem' }}>Add your bank details to receive payments from your sales.</p>
                                    </div>
                                    <button onClick={() => setActiveTab('bank')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        Setup Now
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Fee Structure */}
                        <div className="card" style={{ background: 'var(--accent)', border: 'none' }}>
                            <h4 style={{ fontWeight: 700, marginBottom: '15px', fontSize: '0.95rem' }}>Fee Structure</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--secondary)' }}>Platform Fee</span>
                                    <span style={{ fontWeight: 600 }}>10%</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--secondary)' }}>Payment Processing</span>
                                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>FREE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--secondary)' }}>Settlement Time</span>
                                    <span style={{ fontWeight: 600 }}>7 days</span>
                                </div>
                                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--secondary)', fontStyle: 'italic' }}>
                                    * Fees are automatically deducted from the gross sale amount. No hidden charges.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div>
                            <h3 style={{ fontWeight: 700 }}>Transfer History</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>List of all fund transfers initiated to your bank account.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* Potential filters could go here */}
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '15px', fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>Transfer Date</th>
                                    <th style={{ padding: '15px', fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>Order ID</th>
                                    <th style={{ padding: '15px', fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>Amount</th>
                                    <th style={{ padding: '15px', fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>Transfer ID</th>
                                    <th style={{ padding: '15px', fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>Status</th>
                                    <th style={{ padding: '15px', fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payoutOrders.length > 0 ? payoutOrders.map(order => (
                                    <tr key={order._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                                        <td style={{ padding: '15px', fontWeight: 500 }}>{new Date(order.updatedAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '15px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>#{order._id.substring(0, 12)}</td>
                                        <td style={{ padding: '15px', fontWeight: 700 }}>₹{(order.amount * 0.90).toFixed(2)}</td>
                                        <td style={{ padding: '15px' }}>
                                            {order.razorpayTransferId ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <code style={{ fontSize: '0.75rem', backgroundColor: 'var(--accent)', padding: '2px 6px', borderRadius: '4px' }}>{order.razorpayTransferId}</code>
                                                </div>
                                            ) : <span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>Processing...</span>}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                color: order.isTransferredToSeller ? 'var(--success)' : 'var(--warning)',
                                                fontSize: '0.85rem', fontWeight: 700
                                            }}>
                                                {order.isTransferredToSeller ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                {order.isTransferredToSeller ? 'SUCCESSFUL' : 'PENDING'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <button className="btn btn-outline" style={{ padding: '6px', fontSize: '0.75rem' }}>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary)' }}>
                                            No payout history available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'bank' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 500px) 1fr', gap: '40px' }}>
                    <div className="card">
                        <h3 style={{ marginBottom: '25px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Landmark size={22} color="var(--primary)" /> Bank Configuration
                        </h3>

                        <form onSubmit={handleUpdateBank} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Account Holder Name</label>
                                <input
                                    className="input"
                                    value={settingsData.accountHolderName}
                                    onChange={(e) => setSettingsData({ ...settingsData, accountHolderName: e.target.value })}
                                    placeholder="Enter full name as per bank records"
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Bank Name</label>
                                    <input
                                        className="input"
                                        value={settingsData.bankName}
                                        onChange={(e) => setSettingsData({ ...settingsData, bankName: e.target.value })}
                                        placeholder="e.g. ICICI Bank"
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>IFSC Code</label>
                                    <input
                                        className="input"
                                        value={settingsData.ifscCode}
                                        onChange={(e) => setSettingsData({ ...settingsData, ifscCode: e.target.value })}
                                        placeholder="ICIC0001234"
                                        style={{ textTransform: 'uppercase' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Bank Account Number</label>
                                <input
                                    className="input"
                                    type="password"
                                    value={settingsData.accountNumber}
                                    onChange={(e) => setSettingsData({ ...settingsData, accountNumber: e.target.value })}
                                    placeholder="•••• •••• •••• ••••"
                                    required
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '8px' }}>For security, your full account number is partially hidden.</p>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', width: '100%', justifyContent: 'center', height: '48px' }} disabled={isSaving}>
                                {isSaving ? 'Updating...' : 'Save & Secure Account'}
                            </button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="card" style={{ backgroundColor: 'var(--primary)05', borderColor: 'var(--primary)20' }}>
                            <h4 style={{ fontWeight: 700, marginBottom: '15px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={20} /> Why verify your bank?
                            </h4>
                            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: 'var(--foreground)' }}>
                                    <div style={{ color: 'var(--success)', marginTop: '2px' }}><Check size={14} /></div>
                                    <span>Instant fund transfers via Razorpay Route upon delivery.</span>
                                </li>
                                <li style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: 'var(--foreground)' }}>
                                    <div style={{ color: 'var(--success)', marginTop: '2px' }}><Check size={14} /></div>
                                    <span>Zero commission deduction error with automated splitting.</span>
                                </li>
                                <li style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: 'var(--foreground)' }}>
                                    <div style={{ color: 'var(--success)', marginTop: '2px' }}><Check size={14} /></div>
                                    <span>Compliant with Indian financial regulations & GST.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="card" style={{ borderStyle: 'dashed' }}>
                            <h4 style={{ fontWeight: 600, marginBottom: '10px', fontSize: '0.9rem' }}>Need help?</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', lineHeight: 1.5 }}>
                                If you're having trouble setting up your bank account or linking with Razorpay, please contact our seller support team.
                            </p>
                            <button className="btn btn-outline" style={{ marginTop: '15px', width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
                                Contact Finance Support
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayoutsAndBank;
