const GOOGLE_DRIVE_HOST = 'drive.google.com';
const GOOGLE_DOCS_VIEWER = 'https://docs.google.com/gview';

export function resolveCvPreviewUrl(value: string): string | null {
  const url = parseExternalUrl(value);
  if (!url) {
    return null;
  }

  const googleDriveId = extractGoogleDriveFileId(url);
  if (googleDriveId) {
    return `https://${GOOGLE_DRIVE_HOST}/file/d/${googleDriveId}/preview`;
  }

  const previewUrl = new URL(GOOGLE_DOCS_VIEWER);
  previewUrl.searchParams.set('embedded', '1');
  previewUrl.searchParams.set('url', url.href);
  return previewUrl.href;
}

function parseExternalUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

function extractGoogleDriveFileId(url: URL): string | null {
  if (url.protocol !== 'https:' || url.hostname !== GOOGLE_DRIVE_HOST) {
    return null;
  }

  const filePathMatch = url.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/);
  const id = filePathMatch?.[1] ?? url.searchParams.get('id');
  return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : null;
}
