import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
    try {
        console.log('Create Product Request Body:', req.body);
        console.log('Create Product Files:', req.files);
        
        const { name, description, category, price, minOrderQuantity } = req.body;
        const images = req.files ? req.files.map(file => file.path) : [];

        const product = await Product.create({
            seller: req.user._id,
            name,
            description,
            category,
            price,
            minOrderQuantity,
            images
        });

        console.log('Product created successfully:', product._id);
        res.status(201).json(product);
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(400).json({ message: error.message });
    }
};

export const getProducts = async (req, res) => {
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};
    
    // Default: only approved products for customers, all for admin
    const query = { ...keyword };
    if (!req.user || req.user.role === 'customer') {
        query.isApproved = true;
    } else if (req.user.role === 'seller') {
        // Seller sees approved products OR their own products
        query.$or = [
            { isApproved: true },
            { seller: req.user._id }
        ]
    }

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
