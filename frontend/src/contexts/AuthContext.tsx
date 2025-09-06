import { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';
import mockData from '../data/mockUsers.json';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  ecoCredits: number;
  lockedCredits: number;
  codingHours: number;
  activitiesCount: number;
  rank: number;
  badge: string;
  joinedDate: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('code-to-nature-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockData.users.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('code-to-nature-user', JSON.stringify(userWithoutPassword));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockData.users.find(
      u => u.email === userData.email || u.username === userData.username
    );
    
    if (existingUser) {
      setLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      ecoCredits: 0,
      lockedCredits: 0,
      codingHours: 0,
      activitiesCount: 0,
      rank: mockData.users.length + 1,
      badge: "Nature Newbie",
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `${userData.firstName[0]}${userData.lastName[0]}`
    };
    
    // Add to mock data (in real app, this would be saved to database)
    mockData.users.push({...newUser, password: userData.password});
    
    // Set user (without password)
    setUser(newUser);
    localStorage.setItem('code-to-nature-user', JSON.stringify(newUser));
    
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('code-to-nature-user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};