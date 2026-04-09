import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';

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
                email: 'admin@bharatmart.com',
                password: 'adminpassword123',
                role: 'admin',
            },
            {
                name: 'Seller User 1',
                email: 'seller1@bharatmart.com',
                password: 'sellerpassword123',
                role: 'seller',
                companyName: 'A1 Electronics',
                phoneNumber: '9876543210',
                natureOfBusiness: 'Wholesaler'
            },
            {
                name: 'Seller User 2',
                email: 'seller2@bharatmart.com',
                password: 'sellerpassword123',
                role: 'seller',
                companyName: 'B2 Textiles',
                phoneNumber: '9876543211',
                natureOfBusiness: 'Manufacturer'
            },
            {
                name: 'Customer User',
                email: 'customer@bharatmart.com',
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
