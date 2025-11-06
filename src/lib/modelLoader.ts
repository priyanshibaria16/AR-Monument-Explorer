import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
loader.setDRACOLoader(dracoLoader);

// Placeholder model URL (a simple cube as a fallback)
const PLACEHOLDER_MODEL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf';

export const loadModel = async (url: string): Promise<THREE.Group> => {
  try {
    const gltf = await loader.loadAsync(url);
    return gltf.scene;
  } catch (error) {
    console.error('Error loading model:', error);
    console.log('Falling back to placeholder model...');
    
    try {
      // Try loading the placeholder model
      const gltf = await loader.loadAsync(PLACEHOLDER_MODEL);
      return gltf.scene;
    } catch (fallbackError) {
      console.error('Failed to load placeholder model:', fallbackError);
      throw new Error('Failed to load 3D model');
    }
  }
};

export const loadModelWithProgress = (
  url: string,
  onProgress?: (progress: number) => void,
  onError?: (error: Error) => void
): Promise<THREE.Group> => {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        resolve(gltf.scene);
      },
      (xhr) => {
        if (onProgress) {
          const progress = (xhr.loaded / xhr.total) * 100;
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Error loading model:', error);
        if (onError) onError(error);
        
        // Try loading the placeholder model as fallback
        loader.load(
          PLACEHOLDER_MODEL,
          (gltf) => resolve(gltf.scene),
          undefined,
          (fallbackError) => {
            console.error('Failed to load placeholder model:', fallbackError);
            reject(fallbackError);
          }
        );
      }
    );
  });
};
