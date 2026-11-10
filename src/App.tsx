import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { BookingModal } from './components/booking/BookingModal';
import { GlobalFallingScientificElements } from './components/decorative/GlobalFallingScientificElements';

export function App() {
  const [route, setRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/blogs' || path === '/blog') {
        return '/blogs';
      }
      return '/';
    }
    return '/';
  });

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  const [bookingTierId, setBookingTierId] = useState<string | undefined>(undefined);

  // Helper to scroll to a section on the homepage
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const navbarOffset = 80;
      const targetY =
        sectionId === 'home'
          ? 0
          : el.getBoundingClientRect().top + window.scrollY - navbarOffset;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  // Support browser back/forward and initial URL hash/path
  useEffect(() => {
    const handlePopState = () => {
      const path = (window.location.pathname || '/').toLowerCase();
      if (path === '/blogs' || path === '/blog') {
        setRoute('/blogs');
      } else {
        setRoute('/');
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          setTimeout(() => scrollToSection(hash), 100);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initial check for hash or retired section paths
    const initialPath = window.location.pathname.toLowerCase();
    
    // Always start at Hero section (top: 0) on initial load or refresh of root homepage
    if (initialPath === '/' && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    }

    if (initialPath === '/about') {
      window.history.replaceState({}, '', '/');
      setTimeout(() => scrollToSection('about'), 200);
    } else if (initialPath === '/service' || initialPath === '/services') {
      window.history.replaceState({}, '', '/');
      setTimeout(() => scrollToSection('services'), 200);
    } else if (initialPath === '/pricing') {
      window.history.replaceState({}, '', '/');
      setTimeout(() => scrollToSection('consultations'), 200);
    } else if (initialPath === '/contact') {
      window.history.replaceState({}, '', '/');
      setTimeout(() => scrollToSection('contact'), 200);
    } else if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      setTimeout(() => scrollToSection(hash), 200);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleRouteChange = (newRoute: string, targetSectionId?: string) => {
    const normalized = newRoute === '/blog' ? '/blogs' : newRoute;

    if (normalized === '/blogs') {
      setRoute('/blogs');
      window.history.pushState({}, '', '/blogs');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Navigating to homepage '/'
    setRoute('/');
    window.history.pushState({}, '', '/');

    if (targetSectionId) {
      // Delay slightly to ensure homepage elements are mounted
      setTimeout(() => {
        scrollToSection(targetSectionId);
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (serviceId?: string, tierId?: string) => {
    setBookingServiceId(serviceId);
    setBookingTierId(tierId);
    setIsBookingOpen(true);
  };

  const renderPage = () => {
    switch (route) {
      case '/blogs':
        return (
          <BlogPage
            onBookNow={() => handleOpenBooking()}
            onNavigateHomeSection={(secId) => handleRouteChange('/', secId)}
          />
        );
      case '/':
      default:
        return (
          <HomePage
            onBookNow={(serviceId, tierId) => handleOpenBooking(serviceId, tierId)}
            onNavigateService={() => handleRouteChange('/', 'services')}
            onNavigateBlogs={() => handleRouteChange('/blogs')}
          />
        );
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FAF9F6] text-navy selection:bg-accent selection:text-white relative"
      style={{
        backgroundImage: `linear-gradient(rgba(250, 249, 246, 0.70), rgba(250, 249, 246, 0.70)), url('/white-wall-textures.webp')`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto, 750px 750px',
      }}
    >
      {/* Z-INDEX 1-3: Global Falling Scientific & DNA Elements (Depth Planes Far, Mid, Focus) */}
      <GlobalFallingScientificElements />

      {/* Z-INDEX 5: Floating Navigation Bar */}
      <Navbar
        currentRoute={route}
        onRouteChange={handleRouteChange}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Z-INDEX 4: Actual Website Content, Sections & Page Flow */}
      <div className="flex-grow relative z-10">{renderPage()}</div>

      {/* Footer */}
      <Footer
        onRouteChange={handleRouteChange}
        onOpenBooking={(serviceId) => handleOpenBooking(serviceId)}
      />

      {/* Global 4-Step Interactive Telehealth Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialServiceId={bookingServiceId}
        initialTierId={bookingTierId}
      />
    </div>
  );
}

export default App;
