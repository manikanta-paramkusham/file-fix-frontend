import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Info } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-4 right-4 z-50 flex gap-2">
      {location.pathname !== '/' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/'}
          className="bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      )}
      {location.pathname !== '/about' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/about'}
          className="bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
        >
          <Info className="w-4 h-4 mr-2" />
          About
        </Button>
      )}
    </nav>
  );
};

export default Navigation;