export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Recent';
  }
}

export async function requestFullscreenAndLandscape(element: HTMLElement): Promise<{
  fullscreenGranted: boolean;
  orientationGranted: boolean;
}> {
  let fullscreenGranted = false;
  let orientationGranted = false;

  // 1. Fullscreen
  try {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
      fullscreenGranted = true;
    } else if ((element as any).webkitRequestFullscreen) {
      await (element as any).webkitRequestFullscreen();
      fullscreenGranted = true;
    } else if ((element as any).msRequestFullscreen) {
      await (element as any).msRequestFullscreen();
      fullscreenGranted = true;
    }
  } catch (err) {
    console.warn('Fullscreen request bypassed or not supported:', err);
  }

  // 2. Screen Orientation API (Landscape)
  try {
    if (screen.orientation && (screen.orientation as any).lock) {
      await (screen.orientation as any).lock('landscape');
      orientationGranted = true;
    }
  } catch (err) {
    console.warn('Orientation lock not supported by browser or requires user gesture:', err);
  }

  return { fullscreenGranted, orientationGranted };
}

export function exitFullscreen(): void {
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  } catch (err) {
    console.warn('Exit fullscreen error:', err);
  }
}
