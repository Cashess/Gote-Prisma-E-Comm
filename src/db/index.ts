import { PrismaClient } from '@prisma/client'

// Create a function to instantiate a new PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Declare a global variable for the Prisma client
declare global {
  var prisma: PrismaClient | undefined
}

// Initialize the Prisma client as a singleton
const database = globalThis.prisma ?? prismaClientSingleton()

// Ensure the Prisma client is reused in development mode
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = database
}

// Export the Prisma client instance
export default database
