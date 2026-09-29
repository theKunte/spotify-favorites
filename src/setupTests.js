// Adds DOM matchers such as toBeInTheDocument() to expect()
import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement these browser features
Element.prototype.scrollIntoView = () => {};
HTMLCanvasElement.prototype.getContext = () => null;
window.matchMedia ??= (query) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
});

beforeEach(() => {
  window.location.hash = "";
  localStorage.clear();
});
