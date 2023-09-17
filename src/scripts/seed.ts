const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
  try {
    await db.products.createMany({
      data: [
        {
          userId: 'user_2VDDh1JHoduT9XX6ONjOSuOXKzc',
          title: 'Black t-shirt',
          description:
            ' A black t-shirt is a must-have in every wardrobe. It is versatile and can be worn with anything. This one is made from 100% cotton, so it will feel soft against your skin. Wear it with jeans or shorts for an easy look that will never go out of style.',
          // get images from unsplash
          images: [
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1015&q=80',
          ],
          category: 'clothing',

          seller: 'Nika Ko',
          quantity: 1,
          rating: 4.5,
          price: 69.99,
        },

        {
          userId: 'user_2VDDh1JHoduT9XX6ONjOSuOXKzc',
          title: 'Timberland Boots',
          description:
            'These boots are made for walking, and that’s just what they’ll do. They’re also great for hiking, camping, or any other outdoor activity you can think of. The best part is that they come in so many different colors and styles! You’ll be able to find the perfect pair for any occasion.',
          // get images from unsplash
          images: [
            'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1133&q=80',
          ],
          category: 'shoes',
          seller: 'Nika Ko',
          quantity: 1,
          rating: 4.5,
          price: 129.99,
        },

        {
          userId: 'user_2VDDh1JHoduT9XX6ONjOSuOXKzc',
          title: 'Tech Accessories',
          description:
            'Accessories are the perfect way to add a little something extra to your outfit. Whether you’re looking for a new phone case, laptop sleeve, or even just some headphones, we have what you need. Our accessories are made with high-quality materials and designed by our team of experts so they’ll last as long as possible. And if you don’t see what you’re looking for, let us know! We’ll be happy to help find it for you.',
          // get images from unsplash
          images: [
            'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80',
          ],
          category: 'accessories',

          seller: 'Nika Ko',
          quantity: 1,
          rating: 4.5,
          price: 239.99,
        },

        {
          userId: 'user_2VDDh1JHoduT9XX6ONjOSuOXKzc',
          title: 'Skateboard',
          description:
            'This skateboard is perfect for any skater. It’s made of high-quality materials and has a durable design that will last you years. The wheels are also super smooth, so they won’t get stuck on anything while you’re riding around town. Plus, it comes in tons of different colors!',
          // get images from unsplash
          images: [
            'https://images.unsplash.com/photo-1547447134-cd3f5c716030?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
          ],
          category: 'sports',
          seller: 'Nika Ko',
          quantity: 1,
          rating: 4.5,
          price: 129.99,
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
