import styles from '@/style'
import { discount } from '../assets'
import GetStarted from '../components/GetStarted'
import Image from 'next/image'

const Hero = () => {
  return (
    <section
      id="home"
      className={`flex md:flex-row flex-col ${styles.paddingY}`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
      >
        <div className="flex flex-row items-center py-[6px] px-4  rounded-[10px] mb-2">
          <Image
            src={discount}
            alt="discount"
            className="w-[32px] h-[32px]"
            width={30}
            height={34}
          />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">20%</span> Discount For{' '}
            <span className="text-white">1 Month</span> Account Subscrptions
          </p>
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
            The Aesthetic <br className="sm:block hidden" />{' '}
            <span className="text-gradient text-red-700">Arabica</span>{' '}
          </h1>
          <div className="ss:flex hidden md:mr-4 mr-0">
            <GetStarted />
          </div>
        </div>

        <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px] text-gray-500 ss:leading-[100.8px] leading-[75px] w-full">
          Organic Coffee.
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5 text-center`}>
          At Branded Coffee, we’re passionate about delivering the finest coffee
          experience to our customers. Our team of coffee aficionados curates
          each blend with precision, ensuring you receive only the best in
          flavor, quality, and freshness.
        </p>
      </div>

      <div
        className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}
      >
        <Image
          src="/HeroBanner.png"
          alt="Organic"
          className="w-[100%] h-[100%] rounded-full relative z-[5]"
          width={500}
          height={600}
        />

        {/* gradient start */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 bg-[#6f4f28] opacity-70" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bg-[#d0bfae] bottom-40 opacity-80" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 bg-[#3e2723] opacity-60" />
        {/* gradient end */}
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
        <GetStarted />
      </div>
    </section>
  )
}

export default Hero
