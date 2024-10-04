import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export default function WaitlistWelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the Nutrical AI Waitlist!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://your-logo-url.com/logo.png"
            width="170"
            height="50"
            alt="Nutrical AI"
            style={logo}
          />
          <Heading style={h1}>Welcome to Nutrical AI!</Heading>
          <Text style={text}>
            Thank you for joining our waitlist. We&apos;re thrilled to have you on board!
          </Text>
          <Section style={buttonContainer}>
            <Link
              style={button}
              href="https://nutricalai.com"
              target="_blank"
            >
              Visit Our Website
            </Link>
          </Section>
          <Text style={text}>
            We&apos;re working hard to bring you the best AI-powered calorie tracking experience. 
            We&apos;ll keep you updated on our progress and let you know as soon as we&apos;re live!
          </Text>
          <Text style={text}>
            In the meantime, follow us on social media for the latest updates:
          </Text>
          <Section style={socialLinks}>
            <Link href="https://twitter.com/nutricalai" target="_blank" style={socialIcon}>
              <Img
                src="https://react-email.opencatalyst.net/static/twitter-icon.png"
                width="24"
                height="24"
                alt="Twitter"
              />
            </Link>
            <Link href="https://facebook.com/nutricalai" target="_blank" style={socialIcon}>
              <Img
                src="https://react-email.opencatalyst.net/static/facebook-icon.png"
                width="24"
                height="24"
                alt="Facebook"
              />
            </Link>
            <Link href="https://instagram.com/nutricalai" target="_blank" style={socialIcon}>
              <Img
                src="https://react-email.opencatalyst.net/static/instagram-icon.png"
                width="24"
                height="24"
                alt="Instagram"
              />
            </Link>
          </Section>
          <Text style={footer}>
            © 2023 Nutrical AI. All rights reserved.
            <br />
            123 AI Street, Tech City, TC 12345
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#1d1c1d',
  fontSize: '36px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0',
  lineHeight: '42px',
  textAlign: 'center' as const,
};

const text = {
  color: '#484848',
  fontSize: '18px',
  lineHeight: '24px',
  textAlign: 'center' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  fontWeight: '600',
};

const socialLinks = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const socialIcon = {
  display: 'inline-block',
  margin: '0 10px',
};

const footer = {
  color: '#9ca299',
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '48px 0 0',
};