/**
 * Converts Google Drive URLs into direct CDN image URLs via lh3.googleusercontent.com
 * This solves the issue where drive.google.com/thumbnail or /uc URLs fail to render in browsers
 * due to 302 redirects, third-party cookie restrictions, and hotlinking blocks.
 */
export const getImageUrl = (url) => {
  if (!url) return url;

  let fileId = null;

  // Format 1: /d/{FILE_ID}
  const driveMatch1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch1) {
    fileId = driveMatch1[1];
  }

  // Format 2: id={FILE_ID} or ?id={FILE_ID}
  if (!fileId) {
    const driveMatch2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch2) {
      fileId = driveMatch2[1];
    }
  }

  if (fileId) {
    // Direct CDN endpoint (HTTP 200 directly, CORS enabled, no cookie dependency)
    return `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
  }

  return url;
};

