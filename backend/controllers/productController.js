import Product from '../models/Product.js';
import User from '../models/User.js';

export const createProduct = async (req, res) => {
    try {
        console.log('Create Product Request Body:', req.body);
        console.log('Create Product Files:', req.files);
        
        const { name, description, category, price, minOrderQuantity, packagingType, brand, deliveryTime, origin, specifications, countInStock } = req.body;
        const images = req.files ? req.files.map(file => file.path) : [];

        // Parse specifications if it's sent as a JSON string
        let parsedSpecs = [];
        if (specifications) {
            try {
                parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
            } catch (error) {
                console.error('Error parsing specifications:', error);
            }
        }

        const product = await Product.create({
            seller: req.user._id,
            name,
            description,
            category,
            price,
            minOrderQuantity,
            packagingType,
            brand,
            deliveryTime,
            origin,
            images,
            specifications: parsedSpecs,
            countInStock: countInStock || 10
        });

        console.log('Product created successfully:', product._id);
        res.status(201).json(product);
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(400).json({ message: error.message });
    }
};

export const getProducts = async (req, res) => {
    let matchConditions = [];

    if (req.query.keyword) {
        const regex = {
            $regex: req.query.keyword,
            $options: 'i'
        };
        
        const matchedUsers = await User.find({
            $or: [{ companyName: regex }, { name: regex }]
        }).select('_id');
        
        matchConditions.push({
            $or: [
                { name: regex },
                { category: regex },
                { seller: { $in: matchedUsers.map(u => u._id) } }
            ]
        });
    }

    if (!req.user || req.user.role === 'customer') {
        matchConditions.push({ isApproved: true });
    } else if (req.user.role === 'seller') {
        matchConditions.push({
            $or: [
                { isApproved: true },
                { seller: req.user._id }
            ]
        });
    }

    const query = matchConditions.length > 0 ? { $and: matchConditions } : {};
    
    const products = await Product.find(query).populate('seller', 'name companyName');
    res.json(products);
};

export const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('seller', 'name companyName phoneNumber address');
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export const updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.category = req.body.category || product.category;
        product.price = req.body.price || product.price;
        product.minOrderQuantity = req.body.minOrderQuantity || product.minOrderQuantity;
        product.packagingType = req.body.packagingType || product.packagingType;
        product.brand = req.body.brand || product.brand;
        product.deliveryTime = req.body.deliveryTime || product.deliveryTime;
        product.origin = req.body.origin || product.origin;
        product.countInStock = req.body.countInStock !== undefined ? req.body.countInStock : product.countInStock;
        
        if (req.body.specifications) {
            try {
                product.specifications = typeof req.body.specifications === 'string' 
                    ? JSON.parse(req.body.specifications) 
                    : req.body.specifications;
            } catch (error) {
                console.error('Error parsing specifications in update:', error);
            }
        }
        
        if (req.files && req.files.length > 0) {
            product.images = req.files.map(file => file.path);
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export const approveProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        product.isApproved = true;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};
