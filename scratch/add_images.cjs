const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../backend/seeder.js');
let data = fs.readFileSync(filePath, 'utf8');

const extraImages = {
    'Medical': [
        "'https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?auto=format&fit=crop&q=80&w=400&h=300'",
        "'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400&h=300'"
    ],
    'Nutrition': [
         "'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=400&h=300'",
         "'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?auto=format&fit=crop&q=80&w=400&h=300'" 
    ],
    'Cosmetics': [
        "'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400&h=300'",
        "'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400&h=300'"
    ],
    'Fashion & Apparel': [
        "'https://images.unsplash.com/photo-1489987707023-af82705b682e?auto=format&fit=crop&q=80&w=400&h=300'",
        "'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400&h=300'"
    ],
    'Computer accessories': [
        "'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400&h=300'",
        "'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400&h=300'" 
    ]
};

data = data.replace(/category: '(.*?)',([\s\S]*?)images: \['(.*?)'\],/g, (match, category, middle, image1) => {
    let imagesArr = [`'${image1}'`];
    if (extraImages[category]) {
        imagesArr.push(...extraImages[category]);
    } else {
        Object.values(extraImages)[0].forEach(img => imagesArr.push(img));
    }
    return `category: '${category}',${middle}images: [${imagesArr.join(', ')}],`;
});

fs.writeFileSync(filePath, data);
console.log('Successfully updated seeder.js with more images!');
