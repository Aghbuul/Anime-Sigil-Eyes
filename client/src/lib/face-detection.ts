import "@mediapipe/face_mesh";
import { FaceMesh } from "@mediapipe/face_mesh";

// MediaPipe landmark indices for eye centers
const LEFT_EYE_CENTER = 468;  // Left eye center point in MediaPipe's 468-point model
const RIGHT_EYE_CENTER = 473; // Right eye center point in MediaPipe's 468-point model

/**
 * Detects facial landmarks in an image using MediaPipe Face Mesh.
 * This runs entirely in the browser for privacy - no images are sent to any server.
 * 
 * @param image - The image element to process
 * @returns Promise resolving to array of eye coordinates (normalized 0-1 range)
 */
export async function detectFaceLandmarks(image: HTMLImageElement) {
  return new Promise<Array<{x: number, y: number}>>((resolve) => {
    // Initialize MediaPipe Face Mesh with CDN-hosted model files
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    });

    // Configure face detection parameters
    faceMesh.setOptions({
      maxNumFaces: 1,           // Only detect one face for now
      refineLandmarks: true,    // Enable more precise landmark detection
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // Handle detection results
    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks?.[0]) {
        resolve([]); // No face detected
        return;
      }

      // Extract just the eye center coordinates from the full set of landmarks
      const landmarks = results.multiFaceLandmarks[0];
      resolve([
        landmarks[LEFT_EYE_CENTER],
        landmarks[RIGHT_EYE_CENTER]
      ]);

      // Clean up MediaPipe instance
      faceMesh.close();
    });

    // Process the image - this happens entirely client-side
    faceMesh.send({image});
  });
}