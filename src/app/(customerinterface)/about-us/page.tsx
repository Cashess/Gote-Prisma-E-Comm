import Head from 'next/head';
import Layout from './layout';
import SectionHeader from './_components/SectionHeader';
import AboutMission from './_components/AboutMission';
import QualityCommitment from './_components/QualityCommitment';
import CustomerService from './_components/CustomerService';
import LocationDetails from './_components/LocationDetails';
import RefundPolicy from './_components/RefundPolicy';
import Image from 'next/image';

export default function AboutUs() {
  return (
    <Layout>
      <Head>
        <title>About Us - Gote Probiotics</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <SectionHeader title="About Us" />

        <AboutMission />

        <QualityCommitment />

        <CustomerService />

        <LocationDetails />

        <RefundPolicy />
      </div>
      
    </Layout>
  );
}
