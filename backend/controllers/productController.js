const Product = require('../models/Product.js');
const User = require('../models/User.js');
const Image = require('../models/Image.js');

exports.createProduct = async (req, res) => {
    try {
        console.log('Create Product Request Body:', req.body);
        console.log('Create Product Files:', req.files);
        
        const { name, description, category, price, packagingType, brand, deliveryTime, origin, specifications, countInStock } = req.body;
        const images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const image = await Image.create({
                    data: file.buffer,
                    contentType: file.mimetype,
                    fileName: file.originalname
                });
                images.push(`${req.protocol}://${req.get('host')}/api/images/${image._id}`);
            }
        }

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

exports.getProducts = async (req, res) => {
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

    if (req.query.seller) {
        matchConditions.push({ seller: req.query.seller });
    }
    
    if (req.query.category) {
        matchConditions.push({ category: req.query.category });
    }

    if (!req.user || req.user.role === 'customer') {
        matchConditions.push({ isApproved: true });
    } else if (req.user.role === 'seller') {
        // If the seller is specifically viewing their own products, show all (including pending)
        // Otherwise, in the general marketplace, only show approved products
        const isViewingOwnProducts = req.query.seller && req.query.seller.toString() === req.user._id.toString();
        if (!isViewingOwnProducts) {
            matchConditions.push({ isApproved: true });
        }
    }

    const query = matchConditions.length > 0 ? { $and: matchConditions } : {};
    
    const products = await Product.find(query).populate('seller', 'name companyName logoURL');
    res.json(products);
};

exports.getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('seller', 'name companyName phoneNumber address logoURL');
    if (product) {
        // Check if product is approved
        if (!product.isApproved) {
            const isAdmin = req.user && req.user.role === 'admin';
            const isOwner = req.user && product.seller && product.seller._id.toString() === req.user._id.toString();
            
            if (!isAdmin && !isOwner) {
                return res.status(403).json({ message: 'Product is pending administrative approval' });
            }
        }
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

exports.updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.category = req.body.category || product.category;
        product.price = req.body.price || product.price;
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
            const images = [];
            for (const file of req.files) {
                const image = await Image.create({
                    data: file.buffer,
                    contentType: file.mimetype,
                    fileName: file.originalname
                });
                images.push(`${req.protocol}://${req.get('host')}/api/images/${image._id}`);
            }
            product.images = images;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

exports.deleteProduct = async (req, res) => {
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

exports.approveProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        product.isApproved = true;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

exports.createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400).json({ message: 'Product already reviewed' });
            return;
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};
