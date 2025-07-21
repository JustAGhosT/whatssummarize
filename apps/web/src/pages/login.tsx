import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { redirect } = router.query;

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      await login(values.email, values.password);
      message.success('Login successful!');
      router.push(redirect ? String(redirect) : '/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showSidebar={false}>
      <div className="auth-container">
        <Card className="auth-card">
          <div className="auth-header">
            <Title level={2} className="text-center">Welcome Back</Title>
            <Text type="secondary" className="text-center">
              Sign in to your account to continue
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="auth-form"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <div className="forgot-password">
              <Link href="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-footer">
            <Text>
              Don't have an account?{' '}
              <Link href="/register">
                Sign up
              </Link>
            </Text>
          </div>
        </Card>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 64px);
          padding: 24px;
          background-color: #f5f7fa;
        }
        
        .auth-card {
          width: 100%;
          max-width: 420px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .auth-header {
          margin-bottom: 24px;
          text-align: center;
        }
        
        .auth-header :global(.ant-typography) {
          margin-bottom: 8px;
        }
        
        .auth-form {
          margin-top: 24px;
        }
        
        .forgot-password {
          margin-bottom: 16px;
          text-align: right;
        }
        
        .auth-footer {
          margin-top: 24px;
          text-align: center;
        }
        
        .text-center {
          text-align: center;
          display: block;
        }
      `}</style>
    </Layout>
  );
};

export default LoginPage;
