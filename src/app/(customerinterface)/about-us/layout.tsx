import Head from 'next/head';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode; // Define `children` as ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div>
    <Head>
      <meta charSet="utf-8" />
      <title>About Us </title>
    </Head>
    <main>{children}</main> {/* Render the children */}
  </div>
);

export default Layout;
