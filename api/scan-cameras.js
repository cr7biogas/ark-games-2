/**
 * Camera Scanner API
 * Scans local network for IP Webcam / DroidCam devices
 * 
 * Usage: Called from stream.html via fetch('/api/scan-cameras')
 * Returns: Array of found cameras with their URLs
 */

// Common camera app ports
const CAMERA_PORTS = {
  DROIDCAM: 4747,
  IPWEBCAM: 8080,
  IPWEBCAM_ALT: 8081,
  IPWEBCAM_SSL: 8082
};

// Verification endpoints for each camera type
const VERIFY_ENDPOINTS = {
  4747: '/video',      // DroidCam
  8080: '/video',      // IP Webcam MJPEG
  8081: '/shot.jpg',   // IP Webcam snapshot
  8082: '/video'       // IP Webcam alt
};

/**
 * Scan a single IP for camera services
 */
async function scanIP(ip, timeout = 500) {
  const results = [];
  
  for (const [name, port] of Object.entries(CAMERA_PORTS)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const url = `http://${ip}:${port}`;
      const verifyPath = VERIFY_ENDPOINTS[port] || '/video';
      
      // Try to verify the camera is responding
      const response = await fetch(`${url}${verifyPath}`, {
        signal: controller.signal,
        mode: 'no-cors'
      });
      
      clearTimeout(timeoutId);
      
      // If we got here, something is listening
      results.push({
        ip,
        port,
        url,
        type: name === 'DROIDCAM' ? 'DroidCam' : 'IP Webcam',
        streamUrl: `${url}/video`,
        snapshotUrl: `${url}/shot.jpg`,
        verified: true
      });
      
    } catch (e) {
      // Camera not found at this port
    }
  }
  
  return results;
}

/**
 * Scan subnet for cameras
 * @param {string} baseIp - Base IP (e.g., "192.168.1")
 * @param {number} start - Start IP
 * @param {number} end - End IP
 */
async function scanSubnet(baseIp = '192.168.1', start = 1, end = 254) {
  const allResults = [];
  const batchSize = 20; // Scan 20 IPs at a time
  
  for (let i = start; i <= end; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, end + 1); j++) {
      batch.push(scanIP(`${baseIp}.${j}`));
    }
    
    const batchResults = await Promise.all(batch);
    allResults.push(...batchResults.flat());
  }
  
  return allResults;
}

/**
 * Quick scan common IPs (router-assigned range)
 */
async function quickScan() {
  // Most routers assign IPs in .100-.150 range for mobile devices
  const commonRanges = [
    { base: '192.168.1', start: 100, end: 150 },
    { base: '192.168.0', start: 100, end: 150 },
    { base: '10.0.0', start: 100, end: 150 }
  ];
  
  const allResults = [];
  
  for (const range of commonRanges) {
    const results = await scanSubnet(range.base, range.start, range.end);
    allResults.push(...results);
    if (allResults.length > 0) break; // Stop if we found cameras
  }
  
  return allResults;
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.CameraScanner = {
    scanIP,
    scanSubnet,
    quickScan,
    CAMERA_PORTS
  };
}

// Vercel serverless function handler
export default async function handler(req, res) {
  // For Vercel, we can't do actual network scanning from serverless
  // This endpoint returns instructions for client-side scanning
  
  res.json({
    message: 'Camera scanning must be done client-side due to network restrictions',
    clientCode: `
      // Run this in browser console on stream.html:
      const results = await CameraScanner.quickScan();
      console.log('Found cameras:', results);
    `,
    ports: CAMERA_PORTS,
    verifyEndpoints: VERIFY_ENDPOINTS
  });
}
