"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { AlertCircle, Eye, EyeOff, Github, Loader2, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
  showHeader?: boolean;
  showSocialLogins?: boolean;
  showSignupLink?: boolean;
  className?: string;
}

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

type FormState = {
  email: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
  errors: {
    email?: string;
    password?: string;
  };
};

export function LoginForm({
  onSuccess,
  onSwitchToSignup,
  showHeader = true,
  showSocialLogins = true,
  showSignupLink = true,
  className,
}: LoginFormProps) {
  const { signInWithEmail, signInWithGoogle, signInWithGithub } = useAuth();
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    showPassword: false,
    rememberMe: false,
    errors: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast({
        title: 'Account created!',
        description: 'Please sign in with your credentials.',
        variant: 'success',
      });
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const errors: FormState['errors'] = {};
    
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setForm(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await signInWithEmail(form.email, form.password, form.rememberMe);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        variant: 'success',
      });
      
      onSuccess?.();
    } catch (error: any) {
      console.error('Login failed:', error);
      
      let errorMessage = 'An error occurred during login. Please try again.';
      
      if (error?.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error?.message?.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email before logging in.';
      }
      
      setForm(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          password: errorMessage
        }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: undefined
      }
    }));
  };

  const togglePasswordVisibility = () => {
    setForm(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const isFormValid = form.email && form.password && !form.errors.email && !form.errors.password;

  return (
    <div className={cn('space-y-6', className)}>
      {showHeader && (
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>
      )}

      {showSocialLogins && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              type="button"
              onClick={signInWithGoogle}
              disabled={isSubmitting}
            >
              <FcGoogle className="h-4 w-4 mr-2" />
              Google
            </Button>
            <Button 
              variant="outline" 
              type="button"
              onClick={signInWithGithub}
              disabled={isSubmitting}
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleInputChange}
              className={cn('pl-9', form.errors.email && 'border-destructive')}
              disabled={isSubmitting}
              autoComplete="email"
            />
          </div>
          {form.errors.email && (
            <p className="text-sm text-destructive flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {form.errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              href="/forgot-password" 
              className="text-sm font-medium text-primary hover:underline"
              tabIndex={isSubmitting ? -1 : 0}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={form.showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handleInputChange}
              className={cn('pl-9 pr-10', form.errors.password && 'border-destructive')}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
              disabled={isSubmitting}
            >
              {form.showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {form.showPassword ? 'Hide password' : 'Show password'}
              </span>
            </button>
          </div>
          {form.errors.password && (
            <p className="text-sm text-destructive flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {form.errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={form.rememberMe}
            onCheckedChange={(checked) => {
              setForm(prev => ({
                ...prev,
                rememberMe: checked as boolean
              }));
            }}
            disabled={isSubmitting}
          />
          <Label htmlFor="rememberMe" className="text-sm font-normal">
            Remember me
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>

        {showSignupLink && onSwitchToSignup && (
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="font-medium text-primary hover:underline"
              disabled={isSubmitting}
            >
              Sign up
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
