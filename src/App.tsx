import { useEffect } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { MusicToggle } from '@/components/MusicToggle';
import { useRouter } from '@/lib/router';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { WishesPage } from '@/pages/WishesPage';
import { MemoriesPage } from '@/pages/MemoriesPage';
import { TimelinePage } from '@/pages/TimelinePage';
import { QuizPage } from '@/pages/QuizPage';
import { GiftsPage } from '@/pages/GiftsPage';

function App() {
  const { path } = useRouter();

  // Scroll to top whenever the route changes (except home hero).
  useEffect(() => {
    if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [path]);

  let page;
  switch (path) {
    case '/':
      page = <HomePage />;
      break;
    case '/about':
      page = <AboutPage />;
      break;
    case '/wishes':
      page = <WishesPage />;
      break;
    case '/memories':
      page = <MemoriesPage />;
      break;
    case '/timeline':
      page = <TimelinePage />;
      break;
    case '/quiz':
      page = <QuizPage />;
      break;
    case '/gifts':
      page = <GiftsPage />;
      break;
    default:
      page = <NotFound />;
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <Nav />
      <main>{page}</main>
      <Footer />
      <MusicToggle />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl font-bold text-gradient-rose">404</p>
      <p className="mt-4 font-body text-lg text-wine-600">
        This page wandered off — like a reel that bhag gayi.
      </p>
      <a href="#/" className="btn-primary mt-8">
        Back home
      </a>
    </div>
  );
}

export default App;
