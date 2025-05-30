export const mockVenues = [
  {
    id: 1,
    name: 'TanzStudio',
    image:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=400&fit=crop',
    address: 'Hauptstraße 1, Munich',
    rating: 4.8,
    reviewCount: 124,
    description:
      'Premier dance studio with 3 halls and professional sound system',
    features: ['Sprung Floor', 'Mirrors', 'Sound System'],
    styles: ['Ballet', 'Contemporary', 'Hip Hop'],
    areas: [
      {
        id: 1,
        name: 'Main Hall',
        description:
          'Spacious main hall with professional sound system and natural light',
        pricePerHour: 50,
        capacity: 30,
        size: {
          width: 12,
          length: 15,
          height: 4,
          unit: 'meters',
        },
        amenities: [
          'Professional Sound System',
          'Sprung Floor',
          'Wall-to-Wall Mirrors',
          'Ballet Barres',
          'Natural Light',
          'Air Conditioning',
        ],
        floorType: 'Harlequin Sprung Floor',
        images: [
          'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad',
          'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad',
        ],
        availability: {
          monday: '09:00-21:00',
          tuesday: '09:00-21:00',
          wednesday: '09:00-21:00',
          thursday: '09:00-21:00',
          friday: '09:00-21:00',
          saturday: '10:00-18:00',
          sunday: '10:00-16:00',
        },
      },
      {
        id: 2,
        name: 'Studio A',
        description:
          'Medium-sized studio perfect for small groups and private lessons',
        pricePerHour: 40,
        capacity: 20,
        size: {
          width: 8,
          length: 10,
          height: 3.5,
          unit: 'meters',
        },
        amenities: [
          'Bluetooth Speaker',
          'Sprung Floor',
          'Wall-to-Wall Mirrors',
          'Air Conditioning',
        ],
        floorType: 'Harlequin Sprung Floor',
        images: [
          'https://images.unsplash.com/photo-1581974944026-5d6ed762f617',
          'https://images.unsplash.com/photo-1581974944026-5d6ed762f617',
        ],
        availability: {
          monday: '09:00-21:00',
          tuesday: '09:00-21:00',
          wednesday: '09:00-21:00',
          thursday: '09:00-21:00',
          friday: '09:00-21:00',
          saturday: '10:00-18:00',
          sunday: '10:00-16:00',
        },
      },
      {
        id: 3,
        name: 'Studio B',
        description:
          'Cozy practice room ideal for solo practice and private coaching',
        pricePerHour: 35,
        capacity: 15,
        size: {
          width: 6,
          length: 8,
          height: 3.5,
          unit: 'meters',
        },
        amenities: [
          'Bluetooth Speaker',
          'Sprung Floor',
          'Wall-to-Wall Mirrors',
        ],
        floorType: 'Harlequin Sprung Floor',
        images: [
          'https://images.unsplash.com/photo-1581974944026-5d6ed762f617',
          'https://images.unsplash.com/photo-1581974944026-5d6ed762f617',
        ],
        availability: {
          monday: '09:00-21:00',
          tuesday: '09:00-21:00',
          wednesday: '09:00-21:00',
          thursday: '09:00-21:00',
          friday: '09:00-21:00',
          saturday: '10:00-18:00',
          sunday: '10:00-16:00',
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Dance Factory',
    image:
      'https://images.unsplash.com/photo-1581974944026-5d6ed762f617?w=800&h=400&fit=crop',
    address: 'Karlsplatz 5, Munich',
    rating: 4.6,
    reviewCount: 89,
    description: 'Modern dance space perfect for classes and social events',
    features: ['Air Conditioning', 'Bar', 'Stage'],
    styles: ['Salsa', 'Bachata', 'Kizomba'],
    areas: [
      {
        id: 1,
        name: 'Main Ballroom',
        description: 'Large ballroom with stage and professional lighting',
        pricePerHour: 75,
        capacity: 50,
        size: {
          width: 15,
          length: 20,
          height: 5,
          unit: 'meters',
        },
        amenities: [
          'Professional Sound System',
          'Stage',
          'Dance Floor',
          'Professional Lighting',
          'Bar Access',
          'Air Conditioning',
          'Changing Rooms',
        ],
        floorType: 'Floating Wood Floor',
        images: [
          'https://images.unsplash.com/photo-1581974944026-5d6ed762f617',
          'https://images.unsplash.com/photo-1581974944026-5d6ed762f617',
        ],
        availability: {
          monday: '09:00-22:00',
          tuesday: '09:00-22:00',
          wednesday: '09:00-22:00',
          thursday: '09:00-22:00',
          friday: '09:00-23:00',
          saturday: '10:00-23:00',
          sunday: '10:00-22:00',
        },
      },
      {
        id: 2,
        name: 'Practice Room',
        description: 'Intimate practice space with mirrors and sound system',
        pricePerHour: 45,
        capacity: 20,
        size: {
          width: 8,
          length: 10,
          height: 3.5,
          unit: 'meters',
        },
        amenities: [
          'Sound System',
          'Wall-to-Wall Mirrors',
          'Air Conditioning',
          'Water Dispenser',
        ],
        floorType: 'Floating Wood Floor',
        images: [
          'https://images.unsplash.com/photo-1581974944026-5d6ed762f617',
          'https://images.unsplash.com/photo-1581974944026-5d6ed762f617',
        ],
        availability: {
          monday: '09:00-22:00',
          tuesday: '09:00-22:00',
          wednesday: '09:00-22:00',
          thursday: '09:00-22:00',
          friday: '09:00-22:00',
          saturday: '10:00-22:00',
          sunday: '10:00-22:00',
        },
      },
    ],
  },
  {
    id: 3,
    name: 'Havana Club',
    image:
      'https://images.unsplash.com/photo-1536758305353-e47b72c06853?w=800&h=400&fit=crop',
    address: 'Schwabing West, Munich',
    rating: 4.9,
    reviewCount: 156,
    description: 'Authentic Latin club with live music every weekend',
    features: ['Live Music', 'Dance Floor', 'Bar'],
    styles: ['Salsa', 'Bachata', 'Latin'],
    areas: [
      {
        id: 1,
        name: 'Main Dance Floor',
        description: 'Spacious dance floor with stage for live bands',
        pricePerHour: 100,
        capacity: 150,
        size: {
          width: 20,
          length: 25,
          height: 6,
          unit: 'meters',
        },
        amenities: [
          'Professional Sound System',
          'Stage for Live Music',
          'Professional Lighting',
          'Full Bar Service',
          'Air Conditioning',
          'Seating Area',
          'Changing Rooms',
        ],
        floorType: 'Hardwood Dance Floor',
        images: [
          'https://images.unsplash.com/photo-1536758305353-e47b72c06853',
          'https://images.unsplash.com/photo-1536758305353-e47b72c06853',
        ],
        availability: {
          monday: '18:00-02:00',
          tuesday: '18:00-02:00',
          wednesday: '18:00-02:00',
          thursday: '18:00-02:00',
          friday: '18:00-04:00',
          saturday: '18:00-04:00',
          sunday: '18:00-02:00',
        },
      },
      {
        id: 2,
        name: 'Private Room',
        description: 'Intimate space for private events and dance lessons',
        pricePerHour: 60,
        capacity: 30,
        size: {
          width: 10,
          length: 12,
          height: 4,
          unit: 'meters',
        },
        amenities: [
          'Sound System',
          'Wall-to-Wall Mirrors',
          'Private Bar Setup',
          'Air Conditioning',
          'Private Restroom',
        ],
        floorType: 'Hardwood Dance Floor',
        images: [
          'https://images.unsplash.com/photo-1536758305353-e47b72c06853',
          'https://images.unsplash.com/photo-1536758305353-e47b72c06853',
        ],
        availability: {
          monday: '09:00-02:00',
          tuesday: '09:00-02:00',
          wednesday: '09:00-02:00',
          thursday: '09:00-02:00',
          friday: '09:00-04:00',
          saturday: '09:00-04:00',
          sunday: '09:00-02:00',
        },
      },
    ],
  },
]
