
const { PrismaClient } = require('@prisma/client');
const database = new PrismaClient();

async function main() {
  try {
    const productsData = [
      {
        name: 'Coffee Bean A',
        priceInCents: 1999,
        filePath: '/products',
        imagePath: '/products/pexels-enginakyurt-2456429.jpg', // Replace with actual Pexels URL
        description: 'Rich and aromatic coffee bean A.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Coffee Bean B',
        priceInCents: 2999,
        filePath: '/products',
        imagePath: '/products/pexels-cristian-rojas-7487365.jpg', // Replace with actual Pexels URL
        description: 'Smooth and balanced coffee bean B.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Coffee Bean C',
        priceInCents: 3999,
        filePath: '/products',
        imagePath: 'https://images.pexels.com/photos/789012/pexels-photo-789012.jpeg', // Replace with actual Pexels URL
        description: 'Bold and intense coffee bean C.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Coffee Bean D',
        priceInCents: 4999,
        filePath: '/products',
        imagePath: '/products/pexels-shottrotter-1309778.jpg', // Replace with actual Pexels URL
        description: 'Complex and flavorful coffee bean D.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Coffee Bean E',
        priceInCents: 5999,
        filePath: '/products',
        imagePath: '/products/pexels-johnmatt-3784328.jpg', // Replace with actual Pexels URL
        description: 'Premium quality coffee bean E.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Coffee Bean F',
        priceInCents: 1999,
        filePath: '/products',
        imagePath: '/product/pexels-goumbik-94273pexels3.jpg', // Replace with actual Pexels URL
        description: 'Freshly roasted coffee bean F.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Coffee Bean G',
        priceInCents: 2999,
        filePath: '/products',
        imagePath: '/product/pexels-valeriiamiller-3146167.jpg', // Replace with actual Pexels URL
        description: 'Premium blend coffee bean G.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Coffee Bean H',
        priceInCents: 3999,
        filePath: '/products',
        imagePath: '/product/pexels-eyad-tariq-2217318-3879495.jpg', // Replace with actual Pexels URL
        description: 'Organic coffee bean H with unique flavor.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Coffee Bean I',
        priceInCents: 4999,
        filePath: '/products',
        imagePath: '/product/pexels-lilartsy-3050824.jpg', // Replace with actual Pexels URL
        description: 'Single origin coffee bean I.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Coffee Bean J',
        priceInCents: 5999,
        filePath: '/products',
        imagePath: '/product/pexels-andrew-7400278.jpg', // Replace with actual Pexels URL
        description: 'Exotic and rare coffee bean J.',
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
