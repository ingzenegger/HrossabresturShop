import "@testing-library/jest-dom";

// jsdom doesn't implement these browser APIs, but Radix's Select calls them
// when it opens/positions the dropdown. Without a stub, the calls throw
// silently and the dropdown never actually opens in tests.
Element.prototype.hasPointerCapture = () => false;
Element.prototype.releasePointerCapture = () => {};
Element.prototype.scrollIntoView = () => {};
