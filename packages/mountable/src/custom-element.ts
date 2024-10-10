import { mount } from ".";
import "./custom-element.css";

class StliteAppElement extends HTMLElement {
  private _controller: ReturnType<typeof mount> | null = null;

  connectedCallback() {
    // Now we mount the app to the body.
    // Encapsulation using Shadow DOM requires more work such as
    // applying styles to the shadow root.
    // TODO: Implement encapsulation using Shadow DOM.
    const container = document.body;

    const code = this.textContent ?? ""; // innerText ignores line breaks.

    this._controller = mount(code, container);
  }

  disconnectedCallback() {
    this._controller?.unmount();
  }
}

// Deferring the custom element registration until the DOM is ready.
// If not, `this.textContent` will be empty in `connectedCallback`
// because the browser has not parsed the content yet.
// Using `setTimeout()` is also a solution but it might not be the best practice as written in the article below.
// Ref: https://dbushell.com/2024/06/15/custom-elements-unconnected-callback/
document.addEventListener("DOMContentLoaded", () => {
  customElements.define("streamlit-app", StliteAppElement);
});
