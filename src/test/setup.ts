import "@testing-library/jest-dom";

// jsdom doesn't implement these browser APIs, but Radix's Select calls them
// when it opens/positions the dropdown. Without a stub, the calls throw
// silently and the dropdown never actually opens in tests.
Element.prototype.hasPointerCapture = () => false;
Element.prototype.releasePointerCapture = () => {};
Element.prototype.scrollIntoView = () => {};

// jsdom has no ResizeObserver at all. Radix's Switch (and other components)
// use it to measure elements, so we stub it with no-op methods — the tests
// don't care about real measurements, they just need it to exist.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub;
