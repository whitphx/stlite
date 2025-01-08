import { mount } from "./mount";
import { setupCustomElement } from "./custom-element";

export { mount };

// Deferring the custom element registration until the DOM is ready.
// If not, `this.textContent` will be empty in `connectedCallback`
// because the browser has not parsed the content yet.
// Using `setTimeout()` is also a solution but it might not be the best practice as written in the article below.
// Ref: https://dbushell.com/2024/06/15/custom-elements-unconnected-callback/
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupCustomElement(mount);
  });
} else {
  setupCustomElement(mount);
}
