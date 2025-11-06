import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/lib/themeContext';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from '@/components/Navbar';
import Index from './pages/Index';
import Monument from './pages/Monument';
import Quiz from './pages/Quiz';
import Achievements from './pages/Achievements';
import Gallery from './pages/Gallery';
import Timeline from './pages/Timeline';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-destructive mb-4">Oops! Something went wrong</h2>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/monument/:id" element={<Monument />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;