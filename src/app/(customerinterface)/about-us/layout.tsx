import Head from 'next/head';

const Layout = ({ children }) => (
  <div>
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Gote Probiotics</title>
      {/* Add any additional meta tags, CSS/JS imports here */}
    </Head>
    <header>
      {/* Your header content */}
    </header>
    <main>{children}</main>
    <footer>
      {/* Your footer content */}
    </footer>
  </div>
);

export default Layout;
