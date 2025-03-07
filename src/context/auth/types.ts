
export interface User {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  updated_at?: string;
}

export interface SignInResponse {
  user?: User;
  error?: Error;
}

export interface SignUpOptions {
  username?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signUp: (email: string, password: string, options?: SignUpOptions) => Promise<SignInResponse>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
