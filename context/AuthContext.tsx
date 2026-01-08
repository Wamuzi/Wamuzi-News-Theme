
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { type User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password:string) => Promise<User>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<User>;
  loading: boolean;
  // Admin functions
  getAllUsers: () => User[];
  updateUserRole: (userId: number, role: 'admin' | 'user') => void;
  deleteUser: (userId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getMockUsers = (): User[] => {
    const users = localStorage.getItem('mockUsers');
    return users ? JSON.parse(users) : [];
}

const setMockUsers = (users: User[]) => {
    localStorage.setItem('mockUsers', JSON.stringify(users));
}


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setUsers] = useState<User[]>(getMockUsers()); // For triggering re-renders on user list changes

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('currentUser');
    } finally {
        setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getMockUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  const register = async (username: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getMockUsers();
        if (users.some(u => u.email === email)) {
          return reject(new Error('An account with this email already exists.'));
        }
        // First user to register becomes an admin
        const role = users.length === 0 ? 'admin' : 'user';
        const newUser: User = { id: Date.now(), username, email, password, role };
        const updatedUsers = [...users, newUser];
        setMockUsers(updatedUsers);
        setUsers(updatedUsers);
        resolve(newUser);
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };
  
  // --- Admin Functions ---
  const getAllUsers = (): User[] => {
      return getMockUsers();
  }

  const updateUserRole = (userId: number, role: 'admin' | 'user') => {
      const users = getMockUsers();
      const updatedUsers = users.map(u => u.id === userId ? { ...u, role } : u);
      setMockUsers(updatedUsers);
      setUsers(updatedUsers);
  };

  const deleteUser = (userId: number) => {
      const users = getMockUsers();
      const updatedUsers = users.filter(u => u.id !== userId);
      setMockUsers(updatedUsers);
      setUsers(updatedUsers);
  };


  const value = useMemo(() => ({
      currentUser,
      login,
      logout,
      register,
      loading,
      getAllUsers,
      updateUserRole,
      deleteUser,
  }), [currentUser, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
