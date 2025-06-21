import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';


async function main() {
  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  console.log('Created user:', user);

  const coffeeProducts = [
    {
      id: '1',
      name: 'Espresso',
      price: 25000,
      desc: 'Rich and bold espresso shot made from premium arabica beans',
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop',
    },
    {
      id: '2',
      name: 'Cappuccino',
      price: 35000,
      desc: 'Perfect balance of espresso, steamed milk, and milk foam',
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
    },
    {
      id: '3',
      name: 'Latte',
      price: 40000,
      desc: 'Smooth espresso with steamed milk and light foam',
      image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=400&fit=crop',

    },
    {
      id: '4',
      name: 'Americano',
      price: 30000,
      desc: 'Espresso diluted with hot water for a lighter taste',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      
    },
    {
      id: '5',
      name: 'Mocha',
      price: 45000,
      desc: 'Espresso with chocolate syrup, steamed milk, and whipped cream',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      
    },
    {
      id: '6',
      name: 'Iced Coffee',
      price: 32000,
      desc: 'Refreshing cold brew coffee served over ice',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop',
      
    },
    {
      id: '7',
      name: 'Frappuccino',
      price: 50000,
      desc: 'Blended ice coffee with milk and topped with whipped cream',
      image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&h=400&fit=crop',
      
    },
    {
      id: '8',
      name: 'Caramel Macchiato',
      price: 48000,
      desc: 'Espresso marked with foamed milk and caramel sauce',
      image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop',
      
    },
    {
      id: '9',
      name: 'Vanilla Latte',
      price: 42000,
      desc: 'Classic latte with sweet vanilla syrup',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      
    },
    {
      id: '10',
      name: 'Matcha Latte',
      price: 45000,
      desc: 'Premium matcha powder with steamed milk',
      image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop',
      
    },
    {
      id: '11',
      name: 'Croissant',
      price: 25000,
      description: 'Buttery, flaky French pastry perfect with coffee',
      image: 'https://images.unsplash.com/photo-1555507036-eb0cf2a4cdef?w=400&h=400&fit=crop',
      
    },
    {
      id: '12',
      name: 'Chocolate Muffin',
      price: 28000,
      desc: 'Rich chocolate muffin with chocolate chips',
      image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop',
      
    },
    {
      id: '13',
      name: 'Cheesecake',
      price: 55000,
      desc: 'Creamy New York style cheesecake',
      image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=400&fit=crop',
      
    },
    {
      id: '14',
      name: 'Tiramisu',
      price: 60000,
      desc: 'Classic Italian dessert with coffee-soaked ladyfingers',
      image: 'https://images.unsplash.com/photo-1571877227200-63b8bbae8c47?w=400&h=400&fit=crop',
    },
    {
      id: '15',
      name: 'Avocado Toast',
      price: 38000,
      desc: 'Toasted bread topped with fresh avocado and seasonings',
      image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=400&fit=crop',
    }
  ];

  // Create products
  for (const productData of coffeeProducts) {
    const product = await prisma.product.upsert({
      where: { id: productData.name },
      update: {},
      create: productData,
    });
    console.log('Created product:', product.name);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
