require('dotenv/config');
const connectDB = require('./config/db.js');
const User = require('./models/User.js');
const Product = require('./models/Product.js');

// Connect to Database
const startSeeding = async () => {
    await connectDB();
    if (process.argv[2] === '-d') {
        await destroyData();
    } else {
        await importData();
    }
};

const importData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();

        const users = [
            {
                name: 'Admin User',
                email: 'admin@bazaarindia.com',
                password: 'adminpassword123',
                role: 'admin',
            },
            {
                name: 'Seller User 1',
                email: 'seller1@bazaarindia.com',
                password: 'sellerpassword123',
                role: 'seller',
                companyName: 'A1 Electronics',
                phoneNumber: '9876543210',
                natureOfBusiness: 'Wholesaler'
            },
            {
                name: 'Seller User 2',
                email: 'seller2@bazaarindia.com',
                password: 'sellerpassword123',
                role: 'seller',
                companyName: 'B2 Textiles',
                phoneNumber: '9876543211',
                natureOfBusiness: 'Manufacturer'
            },
            {
                name: 'Customer User',
                email: 'customer@bazaarindia.com',
                password: 'customerpassword123',
                role: 'customer',
            }
        ];

        const createdUsers = [];
        for (const user of users) {
            createdUsers.push(await User.create(user));
        }
        const seller1Id = createdUsers[1]._id;
        const seller2Id = createdUsers[2]._id;

        const products = [
            // Medical (4 products)
            {
                name: 'Digital Thermometer',
                description: 'Accurate and fast reading digital thermometer for clinical use.',
                category: 'Medical',
                price: 150,
                seller: seller2Id,
                packagingType: 'Box',
                brand: 'MediCare',
                deliveryTime: '3-5 Days',
                origin: 'Made in India',
                countInStock: 2500,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1584308666744-24d5e4a8b7dd?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Grade', value: 'Medical Grade' },
                    { key: 'Certification', value: 'ISO/CE/FDA' },
                    { key: 'Material', value: 'Plastic/Glass' },
                    { key: 'Usage', value: 'Clinical/Hospital' }
                ]
            },
            {
                name: 'N95 Face Masks',
                description: 'Pack of 50 NIOSH certified N95 particulate respirators.',
                category: 'Medical',
                price: 500,
                seller: seller2Id,
                packagingType: 'Box',
                brand: 'SafeGuard',
                deliveryTime: '2-3 Days',
                origin: 'Made in India',
                countInStock: 5000,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1586942425654-228f416a96bc?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Grade', value: 'Medical Grade' },
                    { key: 'Certification', value: 'ISO/CE/FDA' },
                    { key: 'Material', value: 'Non-woven fabric' },
                    { key: 'Usage', value: 'Clinical/Hospital' }
                ]
            },
            {
                name: 'Surgical Gloves',
                description: 'Disposable latex surgical gloves for medical examinations.',
                category: 'Medical',
                price: 250,
                seller: seller2Id,
                packagingType: 'Box',
                brand: 'HealthGrip',
                deliveryTime: '2-4 Days',
                origin: 'Made in India',
                countInStock: 4000,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1584824388484-90409a6f1ac6?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Grade', value: 'Medical Grade' },
                    { key: 'Certification', value: 'ISO/CE/FDA' },
                    { key: 'Material', value: 'Latex' },
                    { key: 'Usage', value: 'Clinical/Hospital' }
                ]
            },
            {
                name: 'First Aid Kit',
                description: 'Comprehensive first aid kit for emergencies and clinical setups.',
                category: 'Medical',
                price: 850,
                seller: seller2Id,
                packagingType: 'Box',
                brand: 'LifeSaver',
                deliveryTime: '3-5 Days',
                origin: 'Made in India',
                countInStock: 1000,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Grade', value: 'Medical Grade' },
                    { key: 'Certification', value: 'ISO/CE/FDA' },
                    { key: 'Material', value: 'Plastic Case' },
                    { key: 'Usage', value: 'Clinical/Hospital' }
                ]
            },

            // Nutrition (4 products)
            {
                name: 'Whey Protein Powder',
                description: 'Premium quality whey protein isolate for muscle building.',
                category: 'Nutrition',
                price: 2500,
                seller: seller2Id,
                packagingType: 'Jar',
                brand: 'MuscleFit',
                deliveryTime: '3-5 Days',
                origin: 'Made in India',
                countInStock: 300,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Shelf Life', value: '12 Months' },
                    { key: 'Form', value: 'Powder/Liquid' },
                    { key: 'Veg/Non-Veg', value: 'Veg' },
                    { key: 'Key Ingredients', value: 'Whey Isolate' }
                ]
            },
            {
                name: 'Multivitamin Gummies',
                description: 'Daily multivitamin gummies with essential minerals and vitamins.',
                category: 'Nutrition',
                price: 400,
                seller: seller2Id,
                packagingType: 'Bottle',
                brand: 'HealthVita',
                deliveryTime: '2-4 Days',
                origin: 'Made in India',
                countInStock: 1000,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1576402434698-dc53e8e19c36?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Shelf Life', value: '12 Months' },
                    { key: 'Form', value: 'Powder/Liquid' },
                    { key: 'Veg/Non-Veg', value: 'Veg' },
                    { key: 'Key Ingredients', value: 'Vitamins A, C, E, Zinc' }
                ]
            },
            {
                name: 'Omega-3 Fish Oil',
                description: 'High strength Omega-3 1000mg supplement for heart health.',
                category: 'Nutrition',
                price: 600,
                seller: seller2Id,
                packagingType: 'Bottle',
                brand: 'NutriPlus',
                deliveryTime: '3-5 Days',
                origin: 'Made in India',
                countInStock: 800,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Shelf Life', value: '12 Months' },
                    { key: 'Form', value: 'Powder/Liquid' },
                    { key: 'Veg/Non-Veg', value: 'Veg' },
                    { key: 'Key Ingredients', value: 'Fish Oil, EPA, DHA' }
                ]
            },
            {
                name: 'Herbal Detox Tea',
                description: 'Natural herbal tea blend for daily detox and wellness.',
                category: 'Nutrition',
                price: 350,
                seller: seller2Id,
                packagingType: 'Box',
                brand: 'GreenLife',
                deliveryTime: '2-4 Days',
                origin: 'Made in India',
                countInStock: 1500,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Shelf Life', value: '12 Months' },
                    { key: 'Form', value: 'Powder/Liquid' },
                    { key: 'Veg/Non-Veg', value: 'Veg' },
                    { key: 'Key Ingredients', value: 'Green Tea, Ginger, Lemon' }
                ]
            },

            // Cosmetics (4 products)
            {
                name: 'Organic Aloe Vera Gel',
                description: '100% natural and organic aloe vera gel for skin and hair.',
                category: 'Cosmetics',
                price: 150,
                seller: seller1Id,
                packagingType: 'Bottle',
                brand: 'NatureGlow',
                deliveryTime: '3-4 Days',
                origin: 'Made in India',
                countInStock: 1500,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Skin Type', value: 'All' },
                    { key: 'Organic', value: 'Yes' },
                    { key: 'Main Ingredient', value: 'Aloe Vera Extract' },
                    { key: 'Certification', value: 'Ayush/GMP' }
                ]
            },
            {
                name: 'Vitamin C Face Serum',
                description: 'Brightening vitamin C face serum with hyaluronic acid.',
                category: 'Cosmetics',
                price: 450,
                seller: seller1Id,
                packagingType: 'Bottle',
                brand: 'SkinScience',
                deliveryTime: '2-4 Days',
                origin: 'Made in India',
                countInStock: 800,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Skin Type', value: 'All' },
                    { key: 'Organic', value: 'Yes' },
                    { key: 'Main Ingredient', value: 'Vitamin C, Hyaluronic Acid' },
                    { key: 'Certification', value: 'Ayush/GMP' }
                ]
            },
            {
                name: 'Matte Liquid Lipstick',
                description: 'Long-lasting liquid matte lipstick in nude shade.',
                category: 'Cosmetics',
                price: 300,
                seller: seller1Id,
                packagingType: 'Tube',
                brand: 'ColorPop',
                deliveryTime: '3-5 Days',
                origin: 'Made in India',
                countInStock: 500,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Skin Type', value: 'All' },
                    { key: 'Organic', value: 'Yes' },
                    { key: 'Main Ingredient', value: 'Color Pigments, Vitamin E' },
                    { key: 'Certification', value: 'Ayush/GMP' }
                ]
            },
            {
                name: 'Herbal Neem Face Wash',
                description: 'Neem and tulsi based herbal face wash for acne control.',
                category: 'Cosmetics',
                price: 120,
                seller: seller1Id,
                packagingType: 'Tube',
                brand: 'AyurCare',
                deliveryTime: '4-6 Days',
                origin: 'Made in India',
                countInStock: 3000,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Skin Type', value: 'All' },
                    { key: 'Organic', value: 'Yes' },
                    { key: 'Main Ingredient', value: 'Neem, Tulsi' },
                    { key: 'Certification', value: 'Ayush/GMP' }
                ]
            },

            // Fashion & Apparel (4 products)
            {
                name: 'Men\'s Cotton T-Shirt',
                description: '100% premium cotton t-shirt available in various sizes and colors.',
                category: 'Fashion & Apparel',
                price: 250,
                seller: seller2Id,
                packagingType: 'Polybag',
                brand: 'ComfortWear',
                deliveryTime: '5-7 Days',
                origin: 'Made in India',
                countInStock: 2000,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1489987707023-af82705b682e?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Fabric', value: 'Cotton/Polyester' },
                    { key: 'GSM', value: '180' },
                    { key: 'Size Range', value: 'S-XL' },
                    { key: 'Pattern', value: 'Plain/Printed' }
                ]
            },
            {
                name: 'Women\'s Denim Jeans',
                description: 'High quality denim jeans for women. Comfortable and durable.',
                category: 'Fashion & Apparel',
                price: 600,
                seller: seller2Id,
                packagingType: 'Polybag',
                brand: 'DenimPro',
                deliveryTime: '4-6 Days',
                origin: 'Made in India',
                countInStock: 1000,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1489987707023-af82705b682e?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Fabric', value: 'Cotton/Polyester' },
                    { key: 'GSM', value: '300' },
                    { key: 'Size Range', value: 'S-XL' },
                    { key: 'Pattern', value: 'Plain/Printed' }
                ]
            },
            {
                name: 'Printed Summer Dress',
                description: 'Lightweight and breathable printed summer dress.',
                category: 'Fashion & Apparel',
                price: 800,
                seller: seller2Id,
                packagingType: 'Polybag',
                brand: 'SummerStyle',
                deliveryTime: '3-6 Days',
                origin: 'Made in India',
                countInStock: 600,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1515347619362-72fb8ee82782?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1489987707023-af82705b682e?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Fabric', value: 'Cotton/Polyester' },
                    { key: 'GSM', value: '120' },
                    { key: 'Size Range', value: 'S-XL' },
                    { key: 'Pattern', value: 'Plain/Printed' }
                ]
            },
            {
                name: 'Winter Hooded Sweatshirt',
                description: 'Warm and comfortable hooded sweatshirt for winter.',
                category: 'Fashion & Apparel',
                price: 900,
                seller: seller2Id,
                packagingType: 'Polybag',
                brand: 'WinterShield',
                deliveryTime: '5-8 Days',
                origin: 'Made in India',
                countInStock: 500,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1489987707023-af82705b682e?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Fabric', value: 'Cotton/Polyester' },
                    { key: 'GSM', value: '350' },
                    { key: 'Size Range', value: 'S-XL' },
                    { key: 'Pattern', value: 'Plain/Printed' }
                ]
            },

            // Computer accessories (4 products)
            {
                name: 'Wireless Ergonomic Mouse',
                description: 'Ergonomic wireless mouse with adjustable DPI.',
                category: 'Computer accessories',
                price: 800,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'TechPro',
                deliveryTime: '2-4 Days',
                origin: 'Made in India',
                countInStock: 500,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Type', value: 'Peripheral' },
                    { key: 'Connectivity', value: 'USB/Wireless' },
                    { key: 'Compatibility', value: 'Windows/macOS' },
                    { key: 'Warranty', value: '1 Year' }
                ]
            },
            {
                name: 'Mechanical Gaming Keyboard',
                description: 'RGB mechanical keyboard with blue switches.',
                category: 'Computer accessories',
                price: 2500,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'GamePro',
                deliveryTime: '3-5 Days',
                origin: 'Made in India',
                countInStock: 200,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Type', value: 'Peripheral' },
                    { key: 'Connectivity', value: 'USB/Wireless' },
                    { key: 'Compatibility', value: 'Windows/macOS' },
                    { key: 'Warranty', value: '1 Year' }
                ]
            },
            {
                name: 'HD Web Camera 1080p',
                description: 'High-definition 1080p web camera with built-in microphone.',
                category: 'Computer accessories',
                price: 1200,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'VisionTech',
                deliveryTime: '2-3 Days',
                origin: 'Made in India',
                countInStock: 300,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1597859844431-7e37341fe231?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Type', value: 'Peripheral' },
                    { key: 'Connectivity', value: 'USB/Wireless' },
                    { key: 'Compatibility', value: 'Windows/macOS' },
                    { key: 'Warranty', value: '1 Year' }
                ]
            },
            {
                name: 'USB-C Hub 7-in-1',
                description: 'Multi-port USB-C adapter with HDMI, USB 3.0, and PD.',
                category: 'Computer accessories',
                price: 1500,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'ConnectAll',
                deliveryTime: '2-4 Days',
                origin: 'Made in India',
                countInStock: 400,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1616422323381-89a9f24fae0a?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Type', value: 'Peripheral' },
                    { key: 'Connectivity', value: 'USB/Wireless' },
                    { key: 'Compatibility', value: 'Windows/macOS' },
                    { key: 'Warranty', value: '1 Year' }
                ]
            },

            // Industrial Machinery (4 products)
            {
                name: 'CNC Milling Machine',
                description: 'High precision 3-axis CNC milling machine for industrial metal works.',
                category: 'Industrial Machinery',
                price: 1500000,
                seller: seller2Id,
                packagingType: 'Wooden Crate',
                brand: 'PreciseMach',
                deliveryTime: '15-20 Days',
                origin: 'Made in India',
                countInStock: 10,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1579450841234-49135815cc47?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1537462715879-360eeb61a0cc?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Power', value: '15 HP' },
                    { key: 'Table Size', value: '1000x500 mm' },
                    { key: 'Spindle Speed', value: '8000 RPM' },
                    { key: 'Controller', value: 'Siemens/Fanuc' }
                ]
            },
            {
                name: 'Industrial Steam Boiler',
                description: 'Energy efficient steam boiler for textile and chemical industries.',
                category: 'Industrial Machinery',
                price: 800000,
                seller: seller2Id,
                packagingType: 'Open Frame',
                brand: 'ThermalPro',
                deliveryTime: '10-15 Days',
                origin: 'Made in India',
                countInStock: 15,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1504917595217-d4dc5f63a167?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Capacity', value: '500 KG/HR' },
                    { key: 'Fuel Type', value: 'Gas/Oil' },
                    { key: 'Pressure', value: '10 Bar' },
                    { key: 'Material', value: 'ASME Carbon Steel' }
                ]
            },
            {
                name: 'Hydraulic Shearing Machine',
                description: 'Heavy duty hydraulic shearing machine for sheet metal cutting.',
                category: 'Industrial Machinery',
                price: 450000,
                seller: seller2Id,
                packagingType: 'Skid',
                brand: 'IronCut',
                deliveryTime: '12-18 Days',
                origin: 'Made in India',
                countInStock: 20,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1579450841234-49135815cc47?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Cutting Length', value: '3100 mm' },
                    { key: 'Shearing Thickness', value: '6 mm MS' },
                    { key: 'Back Gauge', value: '750 mm' },
                    { key: 'Drive', value: 'Electric/Hydraulic' }
                ]
            },
            {
                name: 'Automated Conveyor Belt',
                description: 'Modular belt conveyor system for warehouse automation.',
                category: 'Industrial Machinery',
                price: 200000,
                seller: seller2Id,
                packagingType: 'Crate',
                brand: 'FlexiMove',
                deliveryTime: '8-12 Days',
                origin: 'Made in India',
                countInStock: 50,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Length', value: '10 Meters' },
                    { key: 'Belt Width', value: '600 mm' },
                    { key: 'Speed', value: '0.5 m/s' },
                    { key: 'Load', value: '50 KG/M' }
                ]
            },

            // Home & Kitchen (4 products)
            {
                name: 'Robotic Vacuum Cleaner',
                description: 'Smart LiDAR based robotic vacuum with mopping function.',
                category: 'Home & Kitchen',
                price: 25000,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'SmartClean',
                deliveryTime: '3-5 Days',
                origin: 'Made in India',
                countInStock: 100,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Battery', value: '5200 mAh' },
                    { key: 'Suction', value: '4000 Pa' },
                    { key: 'Mapping', value: 'LiDAR 3.0' },
                    { key: 'Voice Control', value: 'Alexa/Google' }
                ]
            },
            {
                name: 'High Efficiency Air Purifier',
                description: 'HEPA 13 filter air purifier with smart air quality sensing.',
                category: 'Home & Kitchen',
                price: 12000,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'PureAir',
                deliveryTime: '2-4 Days',
                origin: 'Made in India',
                countInStock: 150,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1585771724684-25271286334f?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1523413555809-0fb1d4da238d?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'CADR', value: '400 m3/h' },
                    { key: 'Coverage', value: '500 sq ft' },
                    { key: 'Filter', value: 'HEPA 13/Activated Carbon' },
                    { key: 'Noise', value: '25-50 dB' }
                ]
            },
            {
                name: 'Smart Instant Pot',
                description: 'Multi-functional programmable pressure cooker with 15 modes.',
                category: 'Home & Kitchen',
                price: 8500,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'MasterChef',
                deliveryTime: '3-6 Days',
                origin: 'Made in India',
                countInStock: 200,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1544233726-b2bc2150d032?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Capacity', value: '6 Liters' },
                    { key: 'Wattage', value: '1000W' },
                    { key: 'Controls', value: 'LCD Soft Touch' },
                    { key: 'Functions', value: 'Saute, Steam, Yogurt' }
                ]
            },
            {
                name: 'Professional Stand Mixer',
                description: 'Heavy duty planetary stand mixer for baking and dough kneading.',
                category: 'Home & Kitchen',
                price: 15000,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'BakePro',
                deliveryTime: '4-7 Days',
                origin: 'Made in India',
                countInStock: 80,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1594385208930-cf2f40078235?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Motor', value: '1200W Copper' },
                    { key: 'Bowl', value: '5L Stainless Steel' },
                    { key: 'Speeds', value: '6-Speed Pulse' },
                    { key: 'Attachments', value: 'Whisk, Beater, Dough Hook' }
                ]
            },

            // Electronics & Home Appliances (4 products)
            {
                name: '55" OLED Smart TV',
                description: 'Ultra HD 4K OLED Smart TV with HDR10+ and Dolby Atmos.',
                category: 'Electronics & Home Appliances',
                price: 120000,
                seller: seller1Id,
                packagingType: 'Safe-Box',
                brand: 'VisionPlus',
                deliveryTime: '4-6 Days',
                origin: 'Made in India',
                countInStock: 40,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1593784991095-a205029471b6?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Display', value: 'OLED 4K UHD' },
                    { key: 'Refersh Rate', value: '120 Hz' },
                    { key: 'OS', value: 'Android TV 12' },
                    { key: 'Sound', value: '40W Dolby Atmos' }
                ]
            },
            {
                name: 'French Door Refrigerator',
                description: 'Large capacity 600L French door refrigerator with convertible zone.',
                category: 'Electronics & Home Appliances',
                price: 85000,
                seller: seller1Id,
                packagingType: 'Crate',
                brand: 'CoolLife',
                deliveryTime: '6-10 Days',
                origin: 'Made in India',
                countInStock: 30,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1571175432230-01c2462ad50b?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Capacity', value: '600 Liters' },
                    { key: 'Cooling', value: 'Twin Cooling Plus' },
                    { key: 'Compressor', value: 'Digital Inverter' },
                    { key: 'Warranty', value: '10 Years' }
                ]
            },
            {
                name: 'Front Load Steam Washer',
                description: 'Intelligent front load washing machine with steam wash technology.',
                category: 'Electronics & Home Appliances',
                price: 35000,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'WashExpert',
                deliveryTime: '3-7 Days',
                origin: 'Made in India',
                countInStock: 60,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1626806819282-2c1dc61a0e05?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Capacity', value: '8 KG' },
                    { key: 'Spin Speed', value: '1400 RPM' },
                    { key: 'Motor', value: 'Inverter Direct Drive' },
                    { key: 'Programmes', value: '14 Modes' }
                ]
            },
            {
                name: 'Split Inverter AC',
                description: '1.5 Ton 5 Star split inverter AC with Wi-Fi control.',
                category: 'Electronics & Home Appliances',
                price: 45000,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'ChillMaster',
                deliveryTime: '3-5 Days',
                origin: 'Made in India',
                countInStock: 100,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1631548231165-4f4d1e2e4ff9?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Capacity', value: '1.5 Ton' },
                    { key: 'Star Rating', value: '5 Star' },
                    { key: 'Cooling', value: 'Dual Inverter' },
                    { key: 'Smart', value: 'Wi-Fi/Voice Enable' }
                ]
            },

            // Office Supplies (4 products)
            {
                name: 'Ergonomic Task Chair',
                description: 'High-back ergonomic office chair with breathable mesh and lumbar support.',
                category: 'Office Supplies',
                price: 12000,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'ComfortZone',
                deliveryTime: '5-7 Days',
                origin: 'Made in India',
                countInStock: 120,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1505797149-43b0069ec234?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Back Type', value: 'Mesh High Back' },
                    { key: 'Adjustability', value: 'Height/Armrest/Headrest' },
                    { key: 'Base', value: 'Chrome/Nylon' },
                    { key: 'Warranty', value: '3 Years' }
                ]
            },
            {
                name: 'Electric Standing Desk',
                description: 'Height adjustable electric standing desk with memory presets.',
                category: 'Office Supplies',
                price: 28000,
                seller: seller1Id,
                packagingType: 'Flat-Pack',
                brand: 'ActiveDesk',
                deliveryTime: '7-10 Days',
                origin: 'Made in India',
                countInStock: 50,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1591130901023-8f5c02f06877?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Width', value: '1400 mm' },
                    { key: 'Height Range', value: '700-1100 mm' },
                    { key: 'Motor', value: 'Dual Silent' },
                    { key: 'Desktop', value: 'Engineered Wood/Oak' }
                ]
            },
            {
                name: 'Wireless All-in-One Printer',
                description: 'Laser MFP with wireless printing, scanning, and copying.',
                category: 'Office Supplies',
                price: 15500,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'PrintPro',
                deliveryTime: '3-5 Days',
                origin: 'Made in India',
                countInStock: 90,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Type', value: 'LaserJet Monochrome' },
                    { key: 'Functions', value: 'Print, Scan, Copy' },
                    { key: 'Speed', value: '25 PPM' },
                    { key: 'Connection', value: 'Wi-Fi/USB/Eth' }
                ]
            },
            {
                name: 'Cross-Cut Paper Shredder',
                description: 'High security cross-cut shredder for office confidentiality.',
                category: 'Office Supplies',
                price: 5500,
                seller: seller1Id,
                packagingType: 'Box',
                brand: 'ShredSafe',
                deliveryTime: '4-6 Days',
                origin: 'Made in India',
                countInStock: 200,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1616422323381-89a9f24fae0a?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Sheet Capacity', value: '12 Sheets' },
                    { key: 'Cut Type', value: 'Cross-Cut (P4)' },
                    { key: 'Bin Capacity', value: '20 Liters' },
                    { key: 'Run Time', value: '10 Mins Continuous' }
                ]
            },

            // Agriculture & Food (4 products)
            {
                name: 'Organic Long Grain Basmati Rice',
                description: 'Premium quality organic basmati rice with long grains and aroma.',
                category: 'Agriculture & Food',
                price: 120,
                seller: seller2Id,
                packagingType: 'Jute Bag',
                brand: 'KisanGold',
                deliveryTime: '4-6 Days',
                origin: 'Made in India',
                countInStock: 5000,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Type', value: 'Raw/Steamed' },
                    { key: 'Grain Length', value: '8.3 mm' },
                    { key: 'Admixture', value: '5% Max' },
                    { key: 'Organic', value: 'Yes' }
                ]
            },
            {
                name: 'Premium Cold Pressed Mustard Oil',
                description: 'Traditional wood-pressed kachi ghani mustard oil for culinary use.',
                category: 'Agriculture & Food',
                price: 180,
                seller: seller2Id,
                packagingType: 'Bottle/Can',
                brand: 'PurityPlus',
                deliveryTime: '3-5 Days',
                origin: 'Made in India',
                countInStock: 2000,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1474979266404-7eaacbadcbaf?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Process', value: 'Cold Pressed/Wood Pressed' },
                    { key: 'Purity', value: '100%' },
                    { key: 'Shelf Life', value: '12 Months' },
                    { key: 'Grade', value: 'Agmark Grade 1' }
                ]
            },
            {
                name: 'Solar Powered Irrigation Pump',
                description: 'Submersible solar pump system for agricultural irrigation.',
                category: 'Agriculture & Food',
                price: 45000,
                seller: seller2Id,
                packagingType: 'Box',
                brand: 'SolarFar',
                deliveryTime: '10-14 Days',
                origin: 'Made in India',
                countInStock: 30,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1590483734724-388175513b6e?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Power', value: '3 HP Solar' },
                    { key: 'Discharge', value: '50000 LPH' },
                    { key: 'Max Head', value: '30 Meters' },
                    { key: 'Warranty', value: '5 Years' }
                ]
            },
            {
                name: 'Versatile Power Tiller',
                description: 'Multi-functional 9HP power tiller for small to medium scale farms.',
                category: 'Agriculture & Food',
                price: 135000,
                seller: seller2Id,
                packagingType: 'Skid',
                brand: 'AgriTech',
                deliveryTime: '12-15 Days',
                origin: 'Made in India',
                countInStock: 15,
                isApproved: true,
                images: ['https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=400&h=300', 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400&h=300'],
                specifications: [
                    { key: 'Engine', value: '9 HP Diesel' },
                    { key: 'Tilling Width', value: '900 mm' },
                    { key: 'Gear', value: '2 Forward/1 Reverse' },
                    { key: 'Weight', value: '120 KG' }
                ]
            }

        ];

        await Product.insertMany(products);

        console.log('Data Imported - Users and Products Seeded!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding data: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error destroying data: ${error}`);
        process.exit(1);
    }
}

startSeeding();
