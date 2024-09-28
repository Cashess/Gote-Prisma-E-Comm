import Image from 'next/image';

const AboutMission = () => (
  <div className="mb-8 flex items-center">
    <div className="w-1/2 mr-4">
      
        <Image
          src="/products/ecd647a7-2b0d-4c5d-b14e-f1bc6d48d000-download (2).jpg"  // Replace with your actual image URL
          alt="Coffee Beans"
          width={600}
          height={400}
          layout="responsive"
        />
      
    </div>
    <div className="w-1/2">
      <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
      <p>
        At Gote Probiotics, we are dedicated to sourcing the finest coffee beans
        from around the world to bring you a truly exceptional coffee experience.
        Our mission is to deliver quality and freshness straight to your doorstep,
        ensuring every cup of coffee you brew is nothing short of perfect.
      </p>
    </div>
  </div>
);

export default AboutMission;
