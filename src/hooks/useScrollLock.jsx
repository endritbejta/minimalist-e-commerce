import { useEffect } from 'react';

/**
 * Reference-counted body scroll lock.
 *
 * Overlays (modal, cart drawer, mobile menu, search) can be open at the same
 * time, so each one cannot simply restore `overflow` when it closes — the last
 * one to unmount would unlock the page while another overlay is still open.
 * Counting active locks and restoring the original value only when the count
 * reaches zero keeps them from fighting each other.
 */
let lockCount = 0;
let previousOverflow = '';

const acquireLock = () => {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
};

const releaseLock = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
  }
};

/**
 * useScrollLock Hook
 * Locks body scrolling while `isLocked` is true, and releases the page only
 * once every active lock has been released.
 * @param {boolean} isLocked - Whether this caller currently needs the page frozen.
 */
export default function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return undefined;

    acquireLock();
    return releaseLock;
  }, [isLocked]);
}
