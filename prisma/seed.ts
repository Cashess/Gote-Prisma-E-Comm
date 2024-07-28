const { PrismaClient } = require('@prisma/client');
const database = new PrismaClient();

async function main() {
  try {
    const productsData = [
      {
        name: 'Product 1',
        priceInCents: 1999,
        filePath: '/products/product1',
        imagePath: '/images/product1.jpg',
        description: 'Description of Product 1',
        isAvailableForPurchase: true,
      },
      {
        name: 'Product 2',
        priceInCents: 2999,
        filePath: '/products/product2',
        imagePath: '/images/product2.jpg',
        description: 'Description of Product 2',
        isAvailableForPurchase: true,
      },
      {
        name: 'Product 3',
        priceInCents: 3999,
        filePath: '/products/product3',
        imagePath: '/images/product3.jpg',
        description: 'Description of Product 3',
        isAvailableForPurchase: true,
      },
      {
        name: 'Product 4',
        priceInCents: 4999,
        filePath: '/products/product4',
        imagePath: '/images/product4.jpg',
        description: 'Description of Product 4',
        isAvailableForPurchase: true,
      },
      {
        name: 'Product 5',
        priceInCents: 5999,
        filePath: '/products/product5',
        imagePath: '/images/product5.jpg',
        description: 'Description of Product 5',
        isAvailableForPurchase: true,
      },
    ];

    for (let productData of productsData) {
      await database.product.create({
        data: productData,
      });
    }

    console.log('Seeding completed!');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await database.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
