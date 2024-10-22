import { supabase } from './supabaseClient'

export { supabase }

// Use the imported supabase instance for all operations

export async function signUp(email: string, password: string) {
  if (!email || !password) {
    return { error: { message: 'Email and password are required' } };
  }
  if (password.length < 6) {
    return { error: { message: 'Password must be at least 6 characters long' } };
  }
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          email_confirmed: true
        }
      }
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error: unknown) {
    console.error('Signup error:', error);
    if (error instanceof Error) {
      return { data: null, error: { message: error.message } };
    }
    return { data: null, error: { message: 'An unexpected error occurred' } };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error: unknown) {
    console.error('Signin error:', error);
    if (error instanceof Error) {
      return { data: null, error: { message: error.message } };
    }
    return { data: null, error: { message: 'An unexpected error occurred' } };
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function uploadAudio(file: File) {
  const fileName = `audio_${Date.now()}.webm`;
  const { data, error } = await supabase.storage
    .from('meal-audio')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading audio:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function getPublicUrl(path: string) {
  const { data } = supabase.storage
    .from('meal-audio')
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function getUploadUrl() {
  const { data, error } = await supabase.storage
    .from('meal-audio')
    .createSignedUploadUrl(`audio_${Date.now()}.webm`);

  if (error) {
    console.error('Error creating signed URL:', error);
    return { data: null, error };
  }

  return { data, error: null };
}
