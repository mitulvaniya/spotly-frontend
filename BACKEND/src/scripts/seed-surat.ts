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
                featuredImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Gujarati_Thali.jpg/1200px-Gujarati_Thali.jpg',
                images: [
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Gujarati_Thali.jpg/1200px-Gujarati_Thali.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gujarati_Thali_01.jpg/1200px-Gujarati_Thali_01.jpg',
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
                featuredImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2647', // aesthetic cafe
                images: [
                    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2647',
                    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2669',
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
                featuredImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/VR_Surat_Mall.jpg/1200px-VR_Surat_Mall.jpg',
                images: [
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/VR_Surat_Mall.jpg/1200px-VR_Surat_Mall.jpg',
                    'https://images.unsplash.com/photo-1519567281726-5b91b9ae30ba?q=80&w=2670',
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
                featuredImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070', // fine dining restaurant
                images: [
                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070',
                    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574',
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
                featuredImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dumas_Beach_Surat.jpg/1200px-Dumas_Beach_Surat.jpg',
                images: [
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dumas_Beach_Surat.jpg/1200px-Dumas_Beach_Surat.jpg',
                    'https://images.unsplash.com/photo-1596450514735-22a3fc51eb14?q=80&w=2670', // beach vibe
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
                featuredImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Gopi_Talav_Surat.jpg/1200px-Gopi_Talav_Surat.jpg',
                images: [
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Gopi_Talav_Surat.jpg/1200px-Gopi_Talav_Surat.jpg',
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
                featuredImage: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2670', // cozy coffee cup
                images: [
                    'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2670',
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
