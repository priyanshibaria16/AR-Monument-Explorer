import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, X, AlertCircle } from 'lucide-react';

interface ARViewerProps {
  monumentName: string;
  modelUrl?: string;
  onClose: () => void;
}

interface XRNavigator extends Navigator {
  xr?: {
    isSessionSupported: (mode: string) => Promise<boolean>;
    requestSession: (mode: string, options?: Record<string, unknown>) => Promise<unknown>;
  };
}

export default function ARViewer({ monumentName, modelUrl, onClose }: ARViewerProps) {
  const [arSupported, setArSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkARSupport();
  }, []);

  const checkARSupport = async () => {
    setIsLoading(true);
    
    // Check for WebXR support
    if ('xr' in navigator) {
      try {
        const xrNavigator = navigator as XRNavigator;
        const supported = await xrNavigator.xr?.isSessionSupported('immersive-ar');
        setArSupported(!!supported);
        if (!supported) {
          setError('AR is not supported on this device. WebXR AR mode is not available.');
        }
      } catch (err) {
        setError('Unable to check AR support. Please try on a compatible device.');
      }
    } else {
      setError('WebXR is not available in this browser. Please use Chrome or Edge on Android.');
    }
    
    setIsLoading(false);
  };

  const startARSession = async () => {
    if (!arSupported) {
      setError('AR is not supported on this device');
      return;
    }

    try {
      const xrNavigator = navigator as XRNavigator;
      const session = await xrNavigator.xr?.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
      });

      // AR session started successfully
      console.log('AR session started', session);
      
      // In a real implementation, you would:
      // 1. Set up WebGL context
      // 2. Load the 3D model
      // 3. Handle hit-test for placement
      // 4. Render the model in AR space
      
    } catch (err) {
      console.error('Failed to start AR session:', err);
      setError('Failed to start AR session. Please ensure camera permissions are granted.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-white" />
          <h2 className="text-white font-semibold">AR View: {monumentName}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        {isLoading ? (
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Checking AR compatibility...</p>
          </div>
        ) : error ? (
          <Alert className="max-w-md bg-red-500/20 border-red-500 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {error}
              <div className="mt-4 text-sm">
                <p className="font-semibold mb-2">To use AR features:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use Chrome or Edge browser on Android</li>
                  <li>Ensure your device supports ARCore</li>
                  <li>Grant camera permissions when prompted</li>
                  <li>Make sure you're using HTTPS</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="text-center text-white space-y-6">
            <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center">
              <Camera className="w-16 h-16" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready for AR Experience</h3>
              <p className="text-white/80 mb-6">
                Point your camera at a flat surface to place the {monumentName}
              </p>
            </div>
            <Button
              size="lg"
              onClick={startARSession}
              className="bg-white text-black hover:bg-white/90"
            >
              Start AR Session
            </Button>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!error && !isLoading && (
        <div className="p-4 bg-black/50 backdrop-blur-sm text-white/80 text-sm">
          <p className="text-center">
            💡 Tip: Move your device slowly to help detect surfaces. Tap to place the monument.
          </p>
        </div>
      )}
    </div>
  );
}