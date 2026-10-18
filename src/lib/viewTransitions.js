/**
 * View Transitions API Helper
 * Provides native cross-fade and shared element transitions for modern browsers (Chrome 111+, Safari 18+).
 * Falls back gracefully to standard execution in older environments.
 */

export function runViewTransition(updateDomCallback) {
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    return document.startViewTransition(updateDomCallback);
  }
  updateDomCallback();
  return {
    finished: Promise.resolve(),
    ready: Promise.resolve(),
    updateCallbackDone: Promise.resolve()
  };
}
