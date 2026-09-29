// Editor drafts, saved in this browser's localStorage. Never shared.
const KEY = "soundprint-drafts";

export function loadDrafts() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function saveDrafts(drafts) {
  try {
    localStorage.setItem(KEY, JSON.stringify(drafts));
    return true;
  } catch {
    return false; // private mode or storage full
  }
}
