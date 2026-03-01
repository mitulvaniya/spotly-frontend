import dotenv from 'dotenv';
import User from '../models/User';
import Spot from '../models/Spot';
import connectDB from '../config/database';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Spot.deleteMany({});

        // Create admin user
        console.log('👤 Creating admin user...');
        await User.create({
            name: 'Admin User',
            email: 'admin@spotly.com',
            password: 'admin123',
            role: 'admin',
            isVerified: true,
        });

        // Create business owner
        console.log('💼 Creating business owner...');
        const businessOwner = await User.create({
            name: 'Business Owner',
            email: 'owner@spotly.com',
            password: 'owner123',
            role: 'business_owner',
            isVerified: true,
        });

        // Create regular user
        console.log('👥 Creating regular user...');
        await User.create({
            name: 'Mitul Vaniya',
            email: 'user@spotly.com',
            password: 'user123',
            isVerified: true,
        });

        // Create authentic Surat spots
        console.log('📍 Creating authentic Surat spots...');
        const spots = [
            {
                name: 'Kansar Gujarati Thali',
                description: 'Experience the authentic taste of Gujarat with our premium unlimited Thali. Renowned in Surat for our hospitality, traditional ambiance, and a rotating menu of sweet and savory delicacies that capture the true essence of Surati cuisine.',
                category: 'Food & Cafes',
                subcategory: 'Traditional Dining',
                location: {
                    address: 'Kansar Thali, Nanpura',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8091, 21.1893], // [longitude, latitude]
                    },
                },
                contact: {
                    phone: '+91 261 247 2222',
                    website: 'kansarthalisurat.com',
                },
                hours: {
                    monday: '11:00 AM - 3:15 PM, 7:00 PM - 10:45 PM',
                    tuesday: '11:00 AM - 3:15 PM, 7:00 PM - 10:45 PM',
                    wednesday: '11:00 AM - 3:15 PM, 7:00 PM - 10:45 PM',
                    thursday: '11:00 AM - 3:15 PM, 7:00 PM - 10:45 PM',
                    friday: '11:00 AM - 3:15 PM, 7:00 PM - 10:45 PM',
                    saturday: '11:00 AM - 3:15 PM, 7:00 PM - 10:45 PM',
                    sunday: '11:00 AM - 3:15 PM, 7:00 PM - 10:45 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800',
                    'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800',
                ],
                rating: 4.8,
                reviewCount: 1542,
                priceRange: '$$',
                tags: ['Gujarati Thali', 'Traditional', 'Family Friendly', 'Pure Veg'],
                features: ['Air Conditioned', 'Valet Parking', 'Group Bookings'],
                owner: businessOwner._id,
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 8540
            },
            {
                name: 'Common Sense Coffee',
                description: 'Surat\'s premier specialty coffee destination in Vesu. We roast our own beans and craft every cup with precision. A perfect, aesthetic environment for remote work, catching up with friends, or just enjoying a perfectly poured flat white.',
                category: 'Food & Cafes',
                subcategory: 'Cafe',
                location: {
                    address: 'Shop 101, VIP Road, Vesu',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.7667, 21.1418],
                    },
                },
                contact: {
                    phone: '+91 98980 12345',
                    website: 'instagram.com/commonsensecoffee',
                },
                hours: {
                    monday: '9:00 AM - 11:30 PM',
                    tuesday: '9:00 AM - 11:30 PM',
                    wednesday: '9:00 AM - 11:30 PM',
                    thursday: '9:00 AM - 11:30 PM',
                    friday: '9:00 AM - 11:30 PM',
                    saturday: '9:00 AM - 12:00 AM',
                    sunday: '9:00 AM - 12:00 AM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800',
                    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=80&w=800',
                ],
                rating: 4.6,
                reviewCount: 430,
                priceRange: '$$',
                tags: ['Specialty Coffee', 'Aesthetic', 'Vesu', 'Workplace'],
                features: ['Free WiFi', 'Power Outlets', 'Outdoor Seating', 'Vegan Options'],
                owner: businessOwner._id,
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 5210
            },
            {
                name: 'VR Surat',
                description: 'The ultimate retail and entertainment destination in Surat. Featuring top international and national brands, a massive food court, INOX multiplex, and premium events. The perfect spot for weekend outings and shopping sprees.',
                category: 'Entertainment',
                subcategory: 'Shopping Mall',
                location: {
                    address: 'Dumas Road, Magdalla',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.7505, 21.1448],
                    },
                },
                contact: {
                    phone: '+91 261 679 5001',
                    website: 'vrsurat.com',
                },
                hours: {
                    monday: '11:00 AM - 9:30 PM',
                    tuesday: '11:00 AM - 9:30 PM',
                    wednesday: '11:00 AM - 9:30 PM',
                    thursday: '11:00 AM - 9:30 PM',
                    friday: '11:00 AM - 10:00 PM',
                    saturday: '11:00 AM - 10:00 PM',
                    sunday: '11:00 AM - 10:00 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?q=80&w=800',
                    'https://images.unsplash.com/photo-1519567281726-5b91b9ae30ba?q=80&w=800',
                ],
                rating: 4.5,
                reviewCount: 12500,
                priceRange: '$$$',
                tags: ['Shopping', 'Movies', 'Food Court', 'Events'],
                features: ['Parking', 'Accessible', 'AC', 'Entertainment Zone'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 18900
            },
            {
                name: 'Leonardo Italian Mediterranean Dining',
                description: 'An upscale dining experience bringing the finest Italian and Mediterranean flavors to Surat. Enjoy hand-crafted pastas, wood-fired pizzas, and exotic mocktails in a luxurious, romantic setting.',
                category: 'Food & Cafes',
                subcategory: 'Fine Dining',
                location: {
                    address: 'International Business Center, Piplod',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.7719, 21.1558],
                    },
                },
                contact: {
                    phone: '+91 89800 55555',
                    website: 'leonardodining.in',
                },
                hours: {
                    monday: '12:00 PM - 3:30 PM, 7:00 PM - 11:30 PM',
                    tuesday: '12:00 PM - 3:30 PM, 7:00 PM - 11:30 PM',
                    wednesday: '12:00 PM - 3:30 PM, 7:00 PM - 11:30 PM',
                    thursday: '12:00 PM - 3:30 PM, 7:00 PM - 11:30 PM',
                    friday: '12:00 PM - 3:30 PM, 7:00 PM - 11:30 PM',
                    saturday: '12:00 PM - 3:30 PM, 7:00 PM - 11:30 PM',
                    sunday: '12:00 PM - 3:30 PM, 7:00 PM - 11:30 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800',
                    'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800',
                ],
                rating: 4.7,
                reviewCount: 890,
                priceRange: '$$$$',
                tags: ['Italian', 'Fine Dining', 'Date Night', 'Pizza'],
                features: ['Reservations', 'Valet Parking', 'Luxury Ambiance'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 6700
            },
            {
                name: 'Dumas Beach Food Stalls',
                description: 'A vibrant stretch along the iconic Dumas Beach famous for Surat\'s beloved street food. Must-try items include the legendary Tomato Bhajiya, Lashkari Locho, and spicy Pav Bhaji. A perfect evening spot.',
                category: 'Food & Cafes',
                subcategory: 'Street Food',
                location: {
                    address: 'Dumas Beach Promenade',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.7061, 21.0825],
                    },
                },
                contact: {},
                hours: {
                    monday: '4:00 PM - 10:00 PM',
                    tuesday: '4:00 PM - 10:00 PM',
                    wednesday: '4:00 PM - 10:00 PM',
                    thursday: '4:00 PM - 10:00 PM',
                    friday: '4:00 PM - 11:00 PM',
                    saturday: '3:00 PM - 11:30 PM',
                    sunday: '3:00 PM - 11:30 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
                    'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?q=80&w=800',
                ],
                rating: 4.4,
                reviewCount: 3200,
                priceRange: '$',
                tags: ['Street Food', 'Bhajiya', 'Beach', 'Budget'],
                features: ['Outdoor', 'Scenic View', 'Late Night'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 12400
            },
            {
                name: 'Gopi Talav',
                description: 'A historic artificial lake that has been beautifully redeveloped into a major recreational spot. Features boating, food zones, laser shows, and beautifully landscaped walkways. Great for families and evening strolls.',
                category: 'Entertainment',
                subcategory: 'Parks & Recreation',
                location: {
                    address: 'Rustampura, Surat',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8310, 21.1895],
                    },
                },
                contact: {},
                hours: {
                    monday: 'Closed',
                    tuesday: '10:00 AM - 10:00 PM',
                    wednesday: '10:00 AM - 10:00 PM',
                    thursday: '10:00 AM - 10:00 PM',
                    friday: '10:00 AM - 10:00 PM',
                    saturday: '10:00 AM - 10:30 PM',
                    sunday: '10:00 AM - 10:30 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800',
                ],
                rating: 4.3,
                reviewCount: 5400,
                priceRange: '$',
                tags: ['Lake', 'Boating', 'Family', 'Historic'],
                features: ['Parking', 'Food Stalls', 'Toilets', 'Wheelchair Accessible'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 9800
            },
            {
                name: 'Meraki - The Coffee House',
                description: 'A minimal and beautiful cafe serving artisanal brews, gourmet sandwhices, and decadent desserts. Known for its perfect lighting and being one of the top spots for creatives to gather.',
                category: 'Food & Cafes',
                subcategory: 'Cafe',
                location: {
                    address: 'Adajan, Surat',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.7933, 21.1959],
                    },
                },
                contact: {
                    phone: '+91 80000 11222'
                },
                hours: {
                    monday: '11:00 AM - 11:00 PM',
                    tuesday: '11:00 AM - 11:00 PM',
                    wednesday: '11:00 AM - 11:00 PM',
                    thursday: '11:00 AM - 11:00 PM',
                    friday: '11:00 AM - 11:00 PM',
                    saturday: '11:00 AM - 11:30 PM',
                    sunday: '11:00 AM - 11:30 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=80&w=800',
                ],
                rating: 4.7,
                reviewCount: 650,
                priceRange: '$$',
                tags: ['Cafe', 'Aesthetic', 'Desserts', 'Adajan'],
                features: ['Free WiFi', 'Air Conditioned'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 4100
            },
            {
                name: 'Dutch Garden',
                description: 'A beautifully maintained historical garden dating back to the British era. Perfect for morning walks, evening jogs, and photography. Features a small museum, manicured lawns, and colonial-era architecture.',
                category: 'Entertainment',
                subcategory: 'Parks & Recreation',
                location: {
                    address: 'Nanpura, Surat',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8193, 21.1863],
                    },
                },
                contact: {},
                hours: {
                    monday: '6:00 AM - 8:00 PM',
                    tuesday: '6:00 AM - 8:00 PM',
                    wednesday: '6:00 AM - 8:00 PM',
                    thursday: '6:00 AM - 8:00 PM',
                    friday: '6:00 AM - 8:00 PM',
                    saturday: '6:00 AM - 8:30 PM',
                    sunday: '6:00 AM - 8:30 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800',
                ],
                rating: 4.2,
                reviewCount: 2100,
                priceRange: '$',
                tags: ['Garden', 'Photography', 'Historic', 'Morning Walk'],
                features: ['Parking', 'Wheelchair Accessible', 'Children Friendly'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 6300
            },
            {
                name: 'Surat Castle (Old Fort)',
                description: 'A 16th-century castle with rich Mughal history, located on the banks of the Tapi River. One of the oldest landmarks in Surat, offering stunning river views and a glimpse into the city\'s glorious past.',
                category: 'Entertainment',
                subcategory: 'Historical',
                location: {
                    address: 'Chowk Bazaar, Surat',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8258, 21.1894],
                    },
                },
                contact: {},
                hours: {
                    monday: '8:00 AM - 6:00 PM',
                    tuesday: '8:00 AM - 6:00 PM',
                    wednesday: '8:00 AM - 6:00 PM',
                    thursday: '8:00 AM - 6:00 PM',
                    friday: '8:00 AM - 6:00 PM',
                    saturday: '8:00 AM - 6:00 PM',
                    sunday: '8:00 AM - 6:00 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800',
                ],
                rating: 4.1,
                reviewCount: 3600,
                priceRange: '$',
                tags: ['Historic', 'Fort', 'Architecture', 'River View'],
                features: ['Guided Tours', 'Photography Allowed'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 7200
            },
            {
                name: 'Chopati (Athwa)',
                description: 'Surat\'s favorite evening hangout spot along the lakeside. Features a variety of street food stalls, ice cream parlors, game zones, and a lively atmosphere perfect for families and friends.',
                category: 'Food & Cafes',
                subcategory: 'Street Food',
                location: {
                    address: 'Athwa Gate, Surat',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8015, 21.1782],
                    },
                },
                contact: {},
                hours: {
                    monday: '5:00 PM - 11:00 PM',
                    tuesday: '5:00 PM - 11:00 PM',
                    wednesday: '5:00 PM - 11:00 PM',
                    thursday: '5:00 PM - 11:00 PM',
                    friday: '5:00 PM - 11:30 PM',
                    saturday: '4:00 PM - 11:30 PM',
                    sunday: '4:00 PM - 11:30 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800',
                ],
                rating: 4.5,
                reviewCount: 4800,
                priceRange: '$',
                tags: ['Street Food', 'Ice Cream', 'Evening', 'Family'],
                features: ['Outdoor', 'Late Night', 'Kids Zone'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 11200
            },
            {
                name: 'Rangila Park',
                description: 'A beautiful amusement and recreation park with rides, gardens, boating facilities, and a mini zoo. Perfect weekend destination for families with kids looking for outdoor fun.',
                category: 'Entertainment',
                subcategory: 'Theme Parks',
                location: {
                    address: 'Piplod, Surat',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.7745, 21.1560],
                    },
                },
                contact: {
                    phone: '+91 261 247 8899',
                },
                hours: {
                    monday: 'Closed',
                    tuesday: '10:00 AM - 9:00 PM',
                    wednesday: '10:00 AM - 9:00 PM',
                    thursday: '10:00 AM - 9:00 PM',
                    friday: '10:00 AM - 9:30 PM',
                    saturday: '10:00 AM - 10:00 PM',
                    sunday: '10:00 AM - 10:00 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?q=80&w=800',
                ],
                rating: 4.0,
                reviewCount: 2900,
                priceRange: '$$',
                tags: ['Amusement Park', 'Rides', 'Family', 'Kids'],
                features: ['Parking', 'Food Court', 'Restrooms'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 5400
            },
            {
                name: 'The Grand Bhagwati',
                description: 'A premium banquet and dining destination in Surat. Known for lavish buffets, exceptional service, and grand event spaces. Their Sunday brunch is legendary among Suratis.',
                category: 'Food & Cafes',
                subcategory: 'Fine Dining',
                location: {
                    address: 'Athwa Gate, Surat',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8035, 21.1790],
                    },
                },
                contact: {
                    phone: '+91 261 234 5678',
                    website: 'thegrandbhagwati.com',
                },
                hours: {
                    monday: '12:00 PM - 3:00 PM, 7:00 PM - 11:00 PM',
                    tuesday: '12:00 PM - 3:00 PM, 7:00 PM - 11:00 PM',
                    wednesday: '12:00 PM - 3:00 PM, 7:00 PM - 11:00 PM',
                    thursday: '12:00 PM - 3:00 PM, 7:00 PM - 11:00 PM',
                    friday: '12:00 PM - 3:00 PM, 7:00 PM - 11:30 PM',
                    saturday: '12:00 PM - 3:00 PM, 7:00 PM - 11:30 PM',
                    sunday: '12:00 PM - 3:30 PM, 7:00 PM - 11:00 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?q=80&w=800',
                ],
                rating: 4.6,
                reviewCount: 1800,
                priceRange: '$$$',
                tags: ['Buffet', 'Banquet', 'Sunday Brunch', 'Premium'],
                features: ['Valet Parking', 'AC', 'Group Dining', 'Events'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 7800
            },
            {
                name: 'Surat Science Centre',
                description: 'An interactive science museum and planetarium featuring exhibits on space, robotics, and natural history. Hosts regular workshops and shows. A great educational outing for kids and curious adults.',
                category: 'Education & Training',
                subcategory: 'Museum',
                location: {
                    address: 'Citylight, Surat',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.7875, 21.1615],
                    },
                },
                contact: {
                    phone: '+91 261 222 3344',
                },
                hours: {
                    monday: 'Closed',
                    tuesday: '10:00 AM - 5:30 PM',
                    wednesday: '10:00 AM - 5:30 PM',
                    thursday: '10:00 AM - 5:30 PM',
                    friday: '10:00 AM - 5:30 PM',
                    saturday: '10:00 AM - 6:00 PM',
                    sunday: '10:00 AM - 6:00 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',
                ],
                rating: 4.3,
                reviewCount: 1200,
                priceRange: '$',
                tags: ['Science', 'Museum', 'Kids', 'Planetarium'],
                features: ['Guided Tours', 'AC', 'Gift Shop'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 3800
            },
            {
                name: 'Sahara Darwaza Textile Market',
                description: 'The heart of Surat\'s textile industry. A massive market area offering fabrics, sarees, and dress materials at wholesale rates. Surat produces over 40% of India\'s synthetic fabric, and this is ground zero.',
                category: 'Fashion & Clothing',
                subcategory: 'Wholesale Market',
                location: {
                    address: 'Ring Road, Sahara Darwaza',
                    city: 'Surat',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8350, 21.1950],
                    },
                },
                contact: {},
                hours: {
                    monday: '10:00 AM - 8:00 PM',
                    tuesday: '10:00 AM - 8:00 PM',
                    wednesday: '10:00 AM - 8:00 PM',
                    thursday: '10:00 AM - 8:00 PM',
                    friday: '10:00 AM - 8:00 PM',
                    saturday: '10:00 AM - 8:00 PM',
                    sunday: 'Closed',
                },
                featuredImage: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=800',
                images: [
                    'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=800',
                ],
                rating: 4.4,
                reviewCount: 6500,
                priceRange: '$',
                tags: ['Textiles', 'Shopping', 'Wholesale', 'Sarees'],
                features: ['Wholesale Prices', 'Variety', 'Bargaining'],
                isVerified: true,
                isActive: true,
                status: 'approved',
                views: 15200
            }
        ];

        await Spot.insertMany(spots);

        console.log('✅ Surat Database seeded successfully!');
        console.log(`\n📊 Summary:`);
        console.log(`   - Users: ${await User.countDocuments()}`);
        console.log(`   - Spots: ${await Spot.countDocuments()}`);
        console.log(`\n🔐 Test Credentials:`);
        console.log(`   Admin: admin@spotly.com / admin123`);
        console.log(`   Business Owner: owner@spotly.com / owner123`);
        console.log(`   User: user@spotly.com / user123`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
