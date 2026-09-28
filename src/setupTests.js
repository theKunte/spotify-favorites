// Adds DOM matchers such as toBeInTheDocument() to expect()
import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = () => {};
