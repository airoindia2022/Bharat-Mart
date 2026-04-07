import RFQ from '../models/RFQ.js';
import Product from '../models/Product.js';

export const createRFQ = async (req, res) => {
    const { productId, title, description, quantity } = req.body;
    const rfq = await RFQ.create({
        customer: req.user._id,
        product: productId,
        title,
        description,
        quantity
    });
    if (rfq) {
        res.status(201).json(rfq);
    } else {
        res.status(400).json({ message: 'Invalid RFQ data' });
    }
};

export const getRFQs = async (req, res) => {
    let query = {};
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    if (req.user.role === 'customer') {
        query.customer = req.user._id;
    } else if (req.user.role === 'seller') {
        // Find products belonging to this seller
        const products = await Product.find({ seller: req.user._id });
        const productIds = products.map(p => p._id);
        query.product = { $in: productIds };
    }
    // Admin sees all
    
    const rfqs = await RFQ.find(query).populate('customer', 'name email phoneNumber').populate('product', 'name');
    res.json(rfqs);
};

export const getRFQById = async (req, res) => {
    const rfq = await RFQ.findById(req.params.id).populate('customer', 'name email phoneNumber').populate('product', 'name');
    if (rfq) {
        res.json(rfq);
    } else {
        res.status(404).json({ message: 'RFQ not found' });
    }
};

export const updateRFQStatus = async (req, res) => {
    const rfq = await RFQ.findById(req.params.id);
    if (rfq) {
        rfq.status = req.body.status || rfq.status;
        rfq.sellerReply = req.body.reply || rfq.sellerReply;
        const updatedRFQ = await rfq.save();
        res.json(updatedRFQ);
    } else {
        res.status(404).json({ message: 'RFQ not found' });
    }
};
