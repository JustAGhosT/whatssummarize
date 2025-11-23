import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type TestUser = {
  email: string;
  password: string;
};

export async function createTestUser(): Promise<TestUser> {
  const testEmail = `test-${uuidv4()}@example.com`;
  // Use environment variable for test password to avoid hard-coded credentials
  // Fallback is provided for local development only - in CI/CD, TEST_USER_PASSWORD must be set
  const testPassword = process.env.TEST_USER_PASSWORD || 'Test@1234';
  
  if (!process.env.TEST_USER_PASSWORD && process.env.CI) {
    throw new Error('TEST_USER_PASSWORD environment variable must be set in CI/CD environments');
  }
  
  // Create user in Supabase
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });
  
  if (signUpError) {
    console.error('Error creating test user:', signUpError);
    throw signUpError;
  }
  
  // Add user to the public.users table if needed
  const { error: userError } = await supabase
    .from('users')
    .insert([
      { 
        id: authData.user?.id, 
        email: testEmail,
        full_name: 'Test User',
        created_at: new Date().toISOString()
      }
    ]);
  
  if (userError) {
    console.error('Error adding test user to users table:', userError);
    throw userError;
  }
  
  return { email: testEmail, password: testPassword };
}

export async function deleteTestUser(email: string): Promise<void> {
  try {
    // Delete user from auth
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userData?.id) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userData.id);
      
      if (deleteError) {
        console.error('Error deleting test user from auth:', deleteError);
      }
      
      // Delete user from public.users
      const { error: userDeleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userData.id);
      
      if (userDeleteError) {
        console.error('Error deleting test user from users table:', userDeleteError);
      }
    }
  } catch (error) {
    console.error('Error in deleteTestUser:', error);
  }
}

// Helper to get auth token for API testing
export async function getAuthToken(email: string, password: string): Promise<string | null> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
  
  return data.session?.access_token || null;
}
