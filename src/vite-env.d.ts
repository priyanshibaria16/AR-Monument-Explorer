/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ar-mode'?: 'webxr' | 'quick-look';
        'ar'?: string | boolean;
        'ar-scale'?: string;
        'ar-placement'?: 'floor' | 'wall';
        'camera-controls'?: string | boolean;
        'auto-rotate'?: string | boolean;
        'autoplay'?: string | boolean;
        'interaction-prompt'?: 'none' | 'when-focused' | 'always';
        'shadow-intensity'?: string | number;
        'exposure'?: string | number;
        'environment-image'?: string;
        'poster'?: string;
        'alt'?: string;
      },
      HTMLElement
    >;
  }
}

interface ModelViewerElement extends HTMLElement {
  activateAR: () => void;
}