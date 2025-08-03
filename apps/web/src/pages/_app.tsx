import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { ConfigProvider } from 'antd';
import { AuthProvider } from '../contexts/AuthContext';
import { GroupProvider } from '../contexts/GroupContext';
import { socketService } from '../services/socket.service';
import { Layout } from '../components/Layout';
import '../styles/globals.css';

// Import antd styles
import 'antd/dist/reset.css';

function MyApp({ Component, pageProps, router }: AppProps) {
  // Only show layout for authenticated pages
  const showLayout = !['/login', '/register', '/forgot-password', '/_error'].includes(
    router.pathname
  );

  // Connect to WebSocket when component mounts
  useEffect(() => {
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#25D366', // WhatsApp green
          borderRadius: 8,
          colorLink: '#25D366', // WhatsApp green for links
        },
        components: {
          Button: {
            primaryColor: '#fff',
          },
          Layout: {
            headerBg: '#fff',
            headerHeight: 64,
            headerPadding: '0 24px',
            headerColor: 'rgba(0, 0, 0, 0.85)',
          },
        },
      }}
    >
      <AuthProvider>
        <GroupProvider>
          {showLayout ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
        </GroupProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default MyApp;
