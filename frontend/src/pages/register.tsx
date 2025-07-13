import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const { register } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    try {
      setIsLoading(true);
      await register(values.email, values.password, values.name);
      message.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      message.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showSidebar={false}>
      <div className="auth-container">
        <Card className="auth-card">
          <div className="auth-header">
            <Title level={2} className="text-center">Create an Account</Title>
            <Text type="secondary" className="text-center">
              Join us to get started
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="auth-form"
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: 'Please input your name!' },
                { min: 2, message: 'Name must be at least 2 characters' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Full Name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
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
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Confirm Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-footer">
            <Text>
              Already have an account?{' '}
              <Link href="/login">
                Sign in
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
          max-width: 480px;
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

export default RegisterPage;
