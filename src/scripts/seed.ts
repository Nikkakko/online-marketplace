const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
  try {
    await db.products.createMany({
      data: [
        {
          userId: 'user_2VDDh1JHoduT9XX6ONjOSuOXKzc',
          title: 'Hoodie of the Season',
          description:
            'A hoodie that will keep you warm and cozy all season long.',
          // get images from unsplash
          images: [
            'https://images.unsplash.com/photo-1565978771542-0db9ab9ad3de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
          ],
          category: 'clothing',

          seller: 'Nika Ko',
          quantity: 1,
          rating: 4.5,
          price: 69.99,
        },

        {
          userId: 'user_2VDDh1JHoduT9XX6ONjOSuOXKzc',
          title: 'Nike Air Max 90',
          description:
            'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU accents. Fresh colours give a modern look while Max Air cushioning adds comfort to your journey.',
          // get images from unsplash
          images: [
            'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80',
          ],
          category: 'shoes',
          seller: 'Nika Ko',
          quantity: 1,
          rating: 4.5,
          price: 169.99,
        },

        {
          userId: 'user_2VDDh1JHoduT9XX6ONjOSuOXKzc',
          title: 'Accessories for the Season',
          description:
            'Accessories complete the look and add a touch of personality to your outfit.',
          // get images from unsplash
          images: [
            'https://images.unsplash.com/3/www.madebyvadim.com.jpg?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2082&q=80',
          ],
          category: 'accessories',

          seller: 'Nika Ko',
          quantity: 1,
          rating: 4.5,
          price: 49.99,
        },

        {
          userId: 'user_2VDDh1JHoduT9XX6ONjOSuOXKzc',
          title: 'Golf Balls for the Season',
          description: 'Enjoy the game with these golf balls.',
          // get images from unsplash
          images: [
            'https://images.unsplash.com/photo-1592592878585-abcaaaaf7cd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80',
          ],
          category: 'sports',
          seller: 'Nika Ko',
          quantity: 1,
          rating: 4.5,
          price: 29.99,
        },
      ],
    });
  } catch (error) {
    console.log(error, 'error seeding default categories');
  } finally {
    await db.$disconnect();
  }

  console.log('Default categories seeded');
}

main();
