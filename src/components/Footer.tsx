import styles from '../style'
import { footerLinks, socialMedia } from '../constants'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => (
  <section
    className={`${styles.flexCenter} ${styles.paddingY} flex-col bg-gray-200 rounded-xl`}
  >
    <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full`}>
      <div className="flex-[1] flex flex-col justify-start mr-10">
        <Image
          src="/Gote-Logo.png"
          alt="Gote-CoffeeHub"
          className=" object-contain rounded-full"
          width={300}
          height={300}
        />
        <p className={`${styles.paragraph} mt-4 max-w-[312px] text-center`}>
          A new way to make Your Day with Gote Coffee, reliable and flavoured.
        </p>
      </div>

      <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10">
        {footerLinks.map((footerlink) => (
          <div
            key={footerlink.title}
            className={`flex flex-col ss:my-0 my-4 min-w-[150px]`}
          >
            <h4 className="font-poppins font-medium text-[18px] leading-[27px] text-white">
              {footerlink.title}
            </h4>
            <ul className="list-none mt-4">
              {footerlink.links.map((link, index) => (
                <li
                  key={link.name}
                  className={`font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer ${
                    index !== footerlink.links.length - 1 ? 'mb-4' : 'mb-0'
                  }`}
                >
                  {link.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
      <p className="font-poppins font-normal text-center text-[18px] leading-[27px] text-red-800">
        Copyright Ⓒ 2022 Gote-Coffee-Hub. All Rights Reserved.
      </p>

      <div className="flex flex-row md:mt-0 mt-6">
        {socialMedia.map((social, index) => (
          // eslint-disable-next-line react/jsx-key
          <Link href="/track">
            <Image
              key={social.id}
              src={social.icon}
              alt={social.id}
              width={25}
              height={30}
              className="gap-8"
            />
          </Link>
        ))}
      </div>
    </div>
  </section>
)

export default Footer
