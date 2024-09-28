import Image from 'next/image'
import { features } from '../constants'
import styles, { layout } from '../style'
import Button from './Button'
import ButtonTouch from './Button'

const FeatureCard = ({ icon, title, content, index }: any) => (
  <div
    className={`flex flex-row p-6 rounded-[20px] ${
      index !== features.length - 1 ? 'mb-6' : 'mb-0'
    } feature-card`}
  >
    <div
      className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}
    >
      <Image
        src={icon}
        alt="star"
        className=" object-contain"
        width={50}
        height={55}
      />
    </div>
    <div className="flex-1 flex flex-col ml-3">
      <h4 className="font-poppins font-semibold text-white text-[18px] leading-[23.4px] mb-1">
        {title}
      </h4>
      <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]">
        {content}
      </p>
    </div>
  </div>
)

const Business = () => (
  <section id="features" className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        You do the business, <br className="sm:block hidden text-red-900" />{' '}
        we’ll handle the Logistics.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5 text-red-900`}>
        With the right Organic Coffee, you can improve your Aesthhetic life by
        building a healthy, for better productivity
      </p>

      <ButtonTouch styles={`mt-10 bg-black text-white`} />
    </div>

    <div className={`${layout.sectionImg} flex-col`}>
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  </section>
)

export default Business
