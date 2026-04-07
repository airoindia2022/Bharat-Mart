import React, { useState, useEffect } from 'react';
import * as rfqService from '../services/rfq.service';
import { useAuth } from '../context/AuthContext';
import { FileText, Clock, CheckCircle, MessageSquare } from 'lucide-react';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [rfqs, setRfqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchRFQs = async (signal) => {
            try {
                const data = await rfqService.getRFQs({}, signal);
                setRfqs(data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error fetching RFQs:', error);
                }
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchRFQs(controller.signal);
        return () => controller.abort();
    }, [user]);

    if (!user) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Please login to view dashboard.</div>;

    return (
        <div className="container" style={{ padding: '40px 1rem' }}>
            <h1 style={{ marginBottom: '30px' }}>My Inquiries (RFQs)</h1>
            
            {loading ? (
                <div>Loading your inquiries...</div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {rfqs.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
                            <MessageSquare size={48} style={{ color: 'var(--secondary)', marginBottom: '20px' }} />
                            <h3>No inquires yet</h3>
                            <p style={{ color: 'var(--secondary)' }}>Start browsing products and send inquiries to suppliers.</p>
                        </div>
                    ) : (
                        rfqs.map(rfq => (
                            <div key={rfq._id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <span style={{ 
                                            padding: '2px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '0.75rem', 
                                            backgroundColor: rfq.status === 'pending' ? 'var(--warning-bg)' : 'var(--success-bg)',
                                            color: rfq.status === 'pending' ? 'var(--warning)' : 'var(--success)'
                                        }}>
                                            {rfq.status.toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>Sent on {new Date(rfq.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 style={{ marginBottom: '5px' }}>{rfq.title}</h3>
                                    <p style={{ color: 'var(--secondary)', fontSize: '0.95rem' }}>Product: <strong>{rfq.product?.name || 'N/A'}</strong></p>
                                    <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>{rfq.description}</p>
                                    
                                    {rfq.sellerReply && (
                                        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: 'var(--success-bg)', borderRadius: '8px', borderLeft: '4px solid var(--success)' }}>
                                            <p style={{ color: 'var(--success)', margin: 0 }}><strong>Response from Seller:</strong></p>
                                            <p style={{ color: 'var(--foreground)', marginTop: '5px' }}>{rfq.sellerReply}</p>
                                        </div>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Qty: {rfq.quantity}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
