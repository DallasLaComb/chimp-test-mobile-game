// Setup for React Native Testing Library

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Native components
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    Alert: {
      alert: jest.fn(),
    },
  };
});

// Mock Supabase
jest.mock('./src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signOut: jest.fn(),
      setSession: jest.fn(),
    },
  },
}));

// Don't mock API - test the real implementation
global.fetch = jest.fn();