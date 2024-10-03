import { ShippingAddress } from '@prisma/client';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

const OrderReceivedEmail = ({
  shippingAddress,
  orderId,
  orderDate,
}: {
  shippingAddress: ShippingAddress;
  orderId: string;
  orderDate: string;
}) => {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'http://localhost:3000'
      : 'https://gote-Coffee-Hub.com';

  return (
    <Html>
      <Head />
      <Preview>Your order summary and estimated delivery date</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={message}>
            <Img
              src={`${baseUrl}/Gote-Logo.png`}
              width="65"
              height="73"
              alt="delivery beans"
              style={{ margin: 'auto' }}
            />
            <Heading style={global.heading}>Thank you for your order!</Heading>
            <p>
              Thank you for your order. We&apos;ve received it and will process
              it soon. <p>We&apos;re preparing your order now.</p>
            </p>
            <Text style={global.text}>
              <p>
                We&apos;ve received your order, and we&apos;re working on it.
              </p>
              Your package has been shipped. Delivery usually takes 2 days.
            </Text>
            <Text style={{ ...global.text, marginTop: 24 }}>
              If you have any questions regarding your order, please feel free
              <p>
                If there&apos;s anything we can assist you with, let us know!
                Thank you
                <p>
                  We&apos;re thrilled to process your order and we&apos;ll keep
                  you updated on its status.
                </p>
                We&apos;ve received it and will process it soon.
              </p>
            </Text>
          </Section>
          <Hr style={global.hr} />
          <Section style={global.defaultPadding}>
            <Text style={adressTitle}>
              Shipping to: {shippingAddress?.name ?? 'Unknown'}
            </Text>
            <Text style={{ ...global.text, fontSize: 14 }}>
              {shippingAddress?.street ?? 'Unknown Street'},{' '}
              {shippingAddress?.city ?? 'Unknown City'},{' '}
              {shippingAddress?.state ?? 'Unknown State'}{' '}
              {shippingAddress?.postalCode ?? '0000'}
            </Text>
          </Section>
          <Hr style={global.hr} />
          <Section style={global.defaultPadding}>
            <Row style={{ display: 'inline-flex gap-16', marginBottom: 40 }}>
              <Column style={{ width: 170 }}>
                <Text style={global.paragraphWithBold}>Order Number</Text>
                <Text style={track.number}>{orderId}</Text>
              </Column>
              <Column style={{ marginLeft: 20 }}>
                <Text style={global.paragraphWithBold}>Order Date</Text>
                <Text style={track.number}>{orderDate}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={global.hr} />

          <Section style={paddingY}>
            <Row>
              <p>
                We&apos;re thrilled to have you as a customer, and we hope
                you&apos;ll enjoy your purchase.
              </p>
              <Text
                style={{
                  ...footer.text,
                  paddingTop: 30,
                  paddingBottom: 30,
                }}
              >
                <p>
                  We&apos;re thrilled to have you as a customer, and we hope
                  you&apos;ll enjoy your purchase.
                </p>
                <p>We&apos;ll keep you updated on the delivery status.</p>{' '}
              </Text>
              <p>We hope you&apos;ll enjoy your purchase!</p>
            </Row>
            <Row>
              <Text style={footer.text}>
                © Gote-Coffee-Hub, Inc. All Rights Reserved.
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderReceivedEmail;

const paddingX = {
  paddingLeft: '40px',
  paddingRight: '40px',
};

const paddingY = {
  paddingTop: '22px',
  paddingBottom: '22px',
};

const paragraph = {
  margin: '0',
  lineHeight: '2',
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: 'bold' },
  heading: {
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '-1px',
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: '#747474',
    fontWeight: '500',
  },
  button: {
    border: '1px solid #929292',
    fontSize: '16px',
    textDecoration: 'none',
    padding: '10px 0px',
    width: '220px',
    display: 'block',
    textAlign: 'center',
    fontWeight: 500,
    color: '#000',
  } as React.CSSProperties,
  hr: {
    borderColor: '#E5E5E5',
    margin: '0',
  },
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '10px auto',
  width: '600px',
  maxWidth: '100%',
  border: '1px solid #E5E5E5',
};

const track = {
  container: {
    padding: '22px 40px',
    backgroundColor: '#F7F7F7',
  },
  number: {
    margin: '12px 0 0 0',
    fontWeight: 500,
    lineHeight: '1.4',
    color: '#6F6F6F',
  },
};

const message = {
  padding: '40px 74px',
  textAlign: 'center',
} as React.CSSProperties;

const adressTitle = {
  ...paragraph,
  fontSize: '15px',
  fontWeight: 'bold',
};

const footer = {
  policy: {
    width: '166px',
    margin: 'auto',
  },
  text: {
    margin: '0',
    color: '#AFAFAF',
    fontSize: '13px',
    textAlign: 'center',
  } as React.CSSProperties,
};
