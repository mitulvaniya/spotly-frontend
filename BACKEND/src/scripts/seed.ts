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
            name: 'John Doe',
            email: 'user@spotly.com',
            password: 'user123',
            isVerified: true,
        });

        // Create sample spots
        console.log('📍 Creating sample spots...');
        const spots = [
            {
                name: 'The Cloud Lounge',
                description: 'Experience breathtaking city views from our rooftop lounge. Enjoy expertly crafted cocktails, live DJ sets, and an unforgettable atmosphere perfect for special occasions.',
                category: 'Entertainment',
                subcategory: 'Nightlife',
                location: {
                    address: '123 Skyline Avenue, Downtown',
                    city: 'Mumbai',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8777, 19.0760], // [longitude, latitude]
                    },
                },
                contact: {
                    phone: '+91 98765 43210',
                    website: 'thecloudlounge.com',
                    email: 'info@thecloudlounge.com',
                },
                hours: {
                    monday: '6:00 PM - 2:00 AM',
                    tuesday: '6:00 PM - 2:00 AM',
                    wednesday: '6:00 PM - 2:00 AM',
                    thursday: '6:00 PM - 2:00 AM',
                    friday: '6:00 PM - 3:00 AM',
                    saturday: '6:00 PM - 3:00 AM',
                    sunday: '6:00 PM - 1:00 AM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070',
                images: [
                    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070',
                    'https://images.unsplash.com/photo-1566417713204-01998813ee47?q=80&w=2672',
                ],
                rating: 4.9,
                reviewCount: 127,
                priceRange: '$$$',
                tags: ['Rooftop', 'Cocktails', 'Live Music', 'City Views'],
                features: ['WiFi', 'Parking', 'Valet', 'Outdoor Seating', 'Live DJ'],
                owner: businessOwner._id,
                isVerified: true,
                isActive: true,
                status: 'approved',
            },
            {
                name: 'Sakura Fusion',
                description: 'Authentic Japanese cuisine meets modern fusion in an elegant setting. Our master chefs prepare fresh sushi, sashimi, and innovative fusion dishes using the finest ingredients.',
                category: 'Food & Cafes',
                subcategory: 'Fine Dining',
                location: {
                    address: '45 Arts District Road',
                    city: 'Mumbai',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8258, 18.9750],
                    },
                },
                contact: {
                    phone: '+91 98765 43211',
                    website: 'sakurafusion.com',
                    email: 'reservations@sakurafusion.com',
                },
                hours: {
                    monday: 'Closed',
                    tuesday: '12:00 PM - 3:00 PM, 7:00 PM - 11:00 PM',
                    wednesday: '12:00 PM - 3:00 PM, 7:00 PM - 11:00 PM',
                    thursday: '12:00 PM - 3:00 PM, 7:00 PM - 11:00 PM',
                    friday: '12:00 PM - 3:00 PM, 7:00 PM - 12:00 AM',
                    saturday: '12:00 PM - 3:00 PM, 7:00 PM - 12:00 AM',
                    sunday: '12:00 PM - 3:00 PM, 7:00 PM - 11:00 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070',
                images: [
                    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070',
                    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=2127',
                ],
                rating: 4.8,
                reviewCount: 89,
                priceRange: '$$$$',
                tags: ['Sushi', 'Japanese', 'Fine Dining', 'Fusion'],
                features: ['WiFi', 'Reservations', 'Private Dining', 'Sake Bar'],
                owner: businessOwner._id,
                isVerified: true,
                isActive: true,
                status: 'approved',
            },
            {
                name: 'Brew & Bean',
                description: 'Your neighborhood coffee sanctuary. Artisanal coffee, fresh pastries, and a cozy atmosphere perfect for work or relaxation. Free WiFi and plenty of power outlets.',
                category: 'Food & Cafes',
                subcategory: 'Cafe',
                location: {
                    address: '78 University Avenue',
                    city: 'Mumbai',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8347, 19.1076],
                    },
                },
                contact: {
                    phone: '+91 98765 43212',
                    website: 'brewandbean.com',
                    email: 'hello@brewandbean.com',
                },
                hours: {
                    monday: '7:00 AM - 10:00 PM',
                    tuesday: '7:00 AM - 10:00 PM',
                    wednesday: '7:00 AM - 10:00 PM',
                    thursday: '7:00 AM - 10:00 PM',
                    friday: '7:00 AM - 11:00 PM',
                    saturday: '8:00 AM - 11:00 PM',
                    sunday: '8:00 AM - 9:00 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574',
                images: [
                    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574',
                    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1678',
                ],
                rating: 4.6,
                reviewCount: 234,
                priceRange: '$',
                tags: ['Coffee', 'Study Spot', 'WiFi', 'Pastries'],
                features: ['WiFi', 'Power Outlets', 'Outdoor Seating', 'Takeaway'],
                isVerified: true,
                isActive: true,
                status: 'approved',
            },
            {
                name: 'FitZone Pro',
                description: 'State-of-the-art fitness center with professional trainers, modern equipment, and diverse classes. Transform your fitness journey with personalized training programs.',
                category: 'Health & Wellness',
                subcategory: 'Gym',
                location: {
                    address: '90 Health Park Complex',
                    city: 'Mumbai',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8479, 19.0896],
                    },
                },
                contact: {
                    phone: '+91 98765 43213',
                    website: 'fitzonepro.com',
                    email: 'info@fitzonepro.com',
                },
                hours: {
                    monday: '5:00 AM - 11:00 PM',
                    tuesday: '5:00 AM - 11:00 PM',
                    wednesday: '5:00 AM - 11:00 PM',
                    thursday: '5:00 AM - 11:00 PM',
                    friday: '5:00 AM - 11:00 PM',
                    saturday: '6:00 AM - 10:00 PM',
                    sunday: '6:00 AM - 10:00 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070',
                images: [
                    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070',
                    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075',
                ],
                rating: 4.7,
                reviewCount: 156,
                priceRange: '$$',
                tags: ['Gym', 'Personal Training', 'Yoga', 'Crossfit'],
                features: ['Locker Rooms', 'Showers', 'Parking', 'Trainers', 'Classes'],
                isVerified: true,
                isActive: true,
                status: 'approved',
            },
            {
                name: 'Style Studio',
                description: 'Trendy boutique featuring curated collections of contemporary fashion. Discover unique pieces from emerging designers and established brands.',
                category: 'Fashion & Clothing',
                subcategory: 'Boutique',
                location: {
                    address: '56 Fashion Street',
                    city: 'Mumbai',
                    coordinates: {
                        type: 'Point',
                        coordinates: [72.8311, 18.9322],
                    },
                },
                contact: {
                    phone: '+91 98765 43214',
                    website: 'stylestudio.com',
                    email: 'shop@stylestudio.com',
                },
                hours: {
                    monday: '10:00 AM - 9:00 PM',
                    tuesday: '10:00 AM - 9:00 PM',
                    wednesday: '10:00 AM - 9:00 PM',
                    thursday: '10:00 AM - 9:00 PM',
                    friday: '10:00 AM - 10:00 PM',
                    saturday: '10:00 AM - 10:00 PM',
                    sunday: '11:00 AM - 8:00 PM',
                },
                featuredImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070',
                images: [
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070',
                    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070',
                ],
                rating: 4.8,
                reviewCount: 92,
                priceRange: '$$$',
                tags: ['Fashion', 'Boutique', 'Designer', 'Trendy'],
                features: ['Personal Styling', 'Alterations', 'Gift Cards', 'Online Shopping'],
                isVerified: true,
                isActive: true,
                status: 'approved',
            },
        ];

        await Spot.insertMany(spots);

        console.log('✅ Database seeded successfully!');
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
