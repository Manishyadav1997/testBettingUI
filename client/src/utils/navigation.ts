import { useLocation } from 'wouter';

// Base path for GitHub Pages
export const BASE_PATH = (import.meta.env.BASE_URL || '').replace(/\/+$/, '');

// Helper function to create paths with the base path
export const createPath = (path: string) => {
  // Remove any existing base path and leading/trailing slashes
  const cleanPath = path.replace(new RegExp(`^${BASE_PATH}`), '').replace(/^\/+|\/+$/g, '');
  // Combine with base path ensuring no double slashes
  return [BASE_PATH.replace(/\/+$/, ''), cleanPath].filter(Boolean).join('/') || '/';
};

// Hook to get navigation functions with base path
export const useNavigation = () => {
  const [location, setLocation] = useLocation();
  
  const navigate = (to: string) => {
    // Don't add base path if it's an absolute URL or already contains the base path
    if (to.startsWith('http') || to.startsWith(BASE_PATH)) {
      setLocation(to);
    } else {
      setLocation(createPath(to));
    }
  };
  
  // Helper to check if a path is active
  const isActive = (path: string) => {
    const currentPath = location.replace(new RegExp(`^${BASE_PATH}`), '').replace(/^\/+|\/+$/g, '');
    const targetPath = path.replace(/^\/+|\/+$/g, '');
    return currentPath === targetPath || 
           (targetPath !== '' && currentPath.startsWith(targetPath));
  };
  
  return { navigate, createPath, isActive, location };
};

export default useNavigation;
