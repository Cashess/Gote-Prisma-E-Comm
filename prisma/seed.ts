const { PrismaClient } = require('@prisma/client')
const database = new PrismaClient()

async function main() {
  try {
    const productsData = [
      {
        name: 'Coffee Bean A',
        priceInCents: 1999,
        filePath: '/products',
        imagePath: '/products/testimonials 1.jpg', // Replace with actual Pexels URL
        description: 'Rich and aromatic vanilla blend coffee.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Cloves Blend coffee',
        priceInCents: 2999,
        filePath: '/products',
        imagePath: '/products/testimonials 2.jpg', // Replace with actual Pexels URL
        description: 'Smooth and balanced almond blend.',
        isAvailableForPurchase: true,
      },
      {
        name: ' Ginger Blend Coffee ',
        priceInCents: 3999,
        filePath: '/products',
        imagePath: '/products/testimonials 3.jpg', // Replace with actual Pexels URL
        description: 'Bold and intense coffee bean C.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Almond Blend Coffee',
        priceInCents: 4999,
        filePath: '/products',
        imagePath: '/products/testimonials 4.jpg', // Replace with actual Pexels URL
        description: 'Complex and flavorful coffee bean D.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Ethopian Arabica Blend',
        priceInCents: 5999,
        filePath: '/products',
        imagePath: '/products/testimonials 5.jpg', // Replace with actual Pexels URL
        description: 'Premium quality coffee blend.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Kenyan Kahawa',
        priceInCents: 1999,
        filePath: '/products',
        imagePath: '/products/testimonials 6.jpg', // Replace with actual Pexels URL
        description: 'Freshly roasted coffee blend.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Arabica Coffee Blend',
        priceInCents: 2999,
        filePath: '/products',
        imagePath: '/what people are buying.jpg', // Replace with actual Pexels URL
        description: 'Premium blend coffee bean G.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Burundi Blend',
        priceInCents: 3999,
        filePath: '/products',
        imagePath: '/coffeePet.jpg', // Replace with actual Pexels URL
        description: 'Organic coffee bean H with unique flavor.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Ugandan Blend',
        priceInCents: 4999,
        filePath: '/products',
        imagePath: '/burundiBlend.jpg', // Replace with actual Pexels URL
        description: 'Single origin coffee bean I.',
        isAvailableForPurchase: true,
      },
      {
        name: 'Tanzanian Blend ',
        priceInCents: 5999,
        filePath: '/products',
        imagePath: '/light edge coffee 4.jpg', // Replace with actual Pexels URL
        description: 'Exotic and rare coffee bean J.',
        isAvailableForPurchase: true,
      },
      // ...other products
    ]

    await database.product.createMany({
      data: productsData,
      skipDuplicates: true, // Optional: Skip records that already exist
    })

    console.log('Seeding completed!')
  } catch (error) {
    console.error('Error seeding data:', error)
    throw error
  } finally {
    await database.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
