// Use native global fetch

const API_BASE = 'https://spotly-frontend.onrender.com/api';
const EMAIL = 'admin@spotly.com';
const PASSWORD = 'admin123';

const IMAGE_MAP = {
    'Kansar Gujarati Thali': 'https://loremflickr.com/800/600/indian,food,thali/all',
    'VR Surat': 'https://loremflickr.com/800/600/shopping,mall/all',
    'Dumas Beach Food Stalls': 'https://loremflickr.com/800/600/indian,street,food/all',
    'Sahara Darwaza Textile Market': 'https://loremflickr.com/800/600/fabric,market,textile/all',
    'Dutch Garden': 'https://loremflickr.com/800/600/park,garden/all',
    'Gopi Talav': 'https://loremflickr.com/800/600/lake,park/all',
    'Chopati (Athwa)': 'https://loremflickr.com/800/600/street,food,night/all',
    'Surat Castle (Old Fort)': 'https://loremflickr.com/800/600/old,castle,fort/all'
};

async function updateSpots() {
    try {
        console.log('Logging in...');
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        }).then(r => r.json());

        const token = loginRes.data.accessToken;
        if (!token) throw new Error('Failed to get token');

        console.log('Fetching all spots...');
        const spotsRes = await fetch(`${API_BASE}/spots?limit=100`).then(r => r.json());
        const spots = spotsRes.data.spots;

        console.log(`Found ${spots.length} spots.`);

        for (const spot of spots) {
            if (IMAGE_MAP[spot.name]) {
                console.log(`Updating ${spot.name}...`);
                const newImageUrl = IMAGE_MAP[spot.name];

                const updateRes = await fetch(`${API_BASE}/spots/${spot._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        featuredImage: newImageUrl,
                        images: [newImageUrl]
                    })
                }).then(r => r.json());

                if (updateRes.success) {
                    console.log(`✅ Updated ${spot.name}`);
                } else {
                    console.error(`❌ Failed to update ${spot.name}:`, updateRes.message);
                }
            }
        }

        console.log('All updates complete!');

    } catch (e) {
        console.error('Error:', e);
    }
}

updateSpots();
