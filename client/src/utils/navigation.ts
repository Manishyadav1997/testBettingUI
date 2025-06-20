import { useLocation } from 'wouter';

// Base path for GitHub Pages
export const BASE_PATH = process.env.NODE_ENV === 'production' ? '/testBettingUI' : '';

// Helper function to create paths with the base path
export const createPath = (path: string) => {
  // Ensure the path starts with a slash and doesn't have duplicate slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${cleanPath}`.replace(/\/+$/, ''); // Remove trailing slashes
};

// Hook to get navigation functions with base path
export const useNavigation = () => {
  const [, setLocation] = useLocation();
  
  const navigate = (to: string) => {
    setLocation(createPath(to));
  };
  
  return { navigate, createPath };
};

export default useNavigation;
