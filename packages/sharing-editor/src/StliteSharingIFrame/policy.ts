// Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy#directives
// On 2022/09/16
export const ALLOWED_FEATURE_POLICY = [
  // Controls whether the current document is allowed to gather information about the acceleration of the device through the Accelerometer interface.
  "accelerometer", // Experimental

  // Controls whether the current document is allowed to gather information about the amount of light in the environment around the device through the AmbientLightSensor interface.
  // Disabled following Apple's position: https://www.zdnet.com/article/apple-declined-to-implement-16-web-apis-in-safari-due-to-privacy-concerns/
  // "ambient-light-sensor", // Experimental

  // Controls whether the current document is allowed to autoplay media requested through the HTMLMediaElement interface. When this policy is disabled and there were no user gestures, the Promise returned by HTMLMediaElement.play() will reject with a DOMException. The autoplay attribute on <audio> and <video> elements will be ignored.
  "autoplay", // Experimental

  // Controls whether the use of the Battery Status API is allowed. When this policy is disabled, the Promise returned by Navigator.getBattery() will reject with a NotAllowedError DOMException.
  // Disabled following Apple's position: https://www.zdnet.com/article/apple-declined-to-implement-16-web-apis-in-safari-due-to-privacy-concerns/
  // "battery", // Experimental

  // Controls whether the current document is allowed to use video input devices. When this policy is disabled, the Promise returned by getUserMedia() will reject with a NotAllowedError DOMException.
  "camera",

  // Controls whether or not the current document is permitted to use the getDisplayMedia() method to capture screen contents. When this policy is disabled, the promise returned by getDisplayMedia() will reject with a NotAllowedError if permission is not obtained to capture the display's contents.
  // Disabled as Streamlit does: https://github.com/streamlit/streamlit/blob/1.12.0/frontend/src/lib/IFrameUtil.ts#L101
  // "display-capture",

  // Controls whether the current document is allowed to set document.domain. When this policy is disabled, attempting to set document.domain will fail and cause a SecurityError DOMException to be thrown.
  "document-domain", // Experimental

  // Controls whether the current document is allowed to use the Encrypted Media Extensions API (EME). When this policy is disabled, the Promise returned by Navigator.requestMediaKeySystemAccess() will reject with a DOMException.
  "encrypted-media", // Experimental

  // Controls whether tasks should execute in frames while they're not being rendered (e.g. if an iframe is hidden or display: none).
  // Disabled as Streamlit does: https://github.com/streamlit/streamlit/blob/1.12.0/frontend/src/lib/IFrameUtil.ts#L110
  // "execution-while-not-rendered",

  // Controls whether tasks should execute in frames while they're outside of the visible viewport.
  // Disabled as Streamlit does: https://github.com/streamlit/streamlit/blob/1.12.0/frontend/src/lib/IFrameUtil.ts#L113
  // "execution-while-out-of-viewport",

  // Controls whether the current document is allowed to use Element.requestFullscreen(). When this policy is disabled, the returned Promise rejects with a TypeError.
  "fullscreen",

  // Controls whether the current document is allowed to use the Gamepad API. When this policy is disabled, calls to Navigator.getGamepads() will throw a SecurityError DOMException, and the gamepadconnected and gamepaddisconnected events will not fire.
  "gamepad", // Experimental

  // Controls whether the current document is allowed to use the Geolocation Interface. When this policy is disabled, calls to getCurrentPosition() and watchPosition() will cause those functions' callbacks to be invoked with a GeolocationPositionError code of PERMISSION_DENIED.
  "geolocation",

  // Controls whether the current document is allowed to gather information about the orientation of the device through the Gyroscope interface.
  "gyroscope", // Experimental

  // Controls whether the current document is allowed to show layout animations.
  "layout-animations", // Experimental Non-standard

  // Controls whether the current document is allowed to display images in legacy formats.
  "legacy-image-formats", // Experimental Non-standard

  // Controls whether the current document is allowed to gather information about the orientation of the device through the Magnetometer interface.
  // Disabled following Apple's position: https://www.zdnet.com/article/apple-declined-to-implement-16-web-apis-in-safari-due-to-privacy-concerns/
  // "magnetometer", // Experimental

  // Controls whether the current document is allowed to use audio input devices. When this policy is disabled, the Promise returned by MediaDevices.getUserMedia() will reject with a NotAllowedError DOMException.
  "microphone",

  // Controls whether the current document is allowed to use the Web MIDI API. When this policy is disabled, the Promise returned by Navigator.requestMIDIAccess() will reject with a DOMException.
  // Disabled following Mozilla's position ("under consideration"): https://mozilla.github.io/standards-positions/
  // Disabled following Apple's position: https://www.zdnet.com/article/apple-declined-to-implement-16-web-apis-in-safari-due-to-privacy-concerns/
  // "midi", // Experimental

  // Controls the availability of mechanisms that enables the page author to take control over the behavior of spatial navigation, or to cancel it outright.
  // Disabled as Streamlit does: https://github.com/streamlit/streamlit/blob/1.12.0/frontend/src/lib/IFrameUtil.ts#L140
  // "navigation-override",

  // Controls whether the current document is allowed to download and display large images.
  "oversized-images", // Experimental Non-standard

  // Controls whether the current document is allowed to use the Payment Request API. When this policy is enabled, the PaymentRequest() constructor will throw a SecurityError DOMException.
  "payment", // Experimental

  // Controls whether the current document is allowed to play a video in a Picture-in-Picture mode via the corresponding API.
  // Disabled following Mozilla's position ("defer"): https://mozilla.github.io/standards-positions/
  // "picture-in-picture", // Experimental

  // Controls whether the current document is allowed to use the Web Authentication API to retrieve already stored public-key credentials, i.e. via navigator.credentials.get({publicKey: ..., ...}).
  "publickey-credentials-get", // Experimental

  // Controls whether the current document is allowed to use the Audio Output Devices API to list and select speakers.
  "speaker-selection", // Experimental

  // Controls whether the current document is allowed to make synchronous XMLHttpRequest requests.
  "sync-xhr", // Experimental Non-standard

  // Controls whether the current document is allowed to download and display unoptimized images.
  "unoptimized-images", // Experimental Non-standard

  // Controls whether the current document is allowed to change the size of media elements after the initial layout is complete.
  "unsized-media", // Experimental Non-standard

  // Controls whether the current document is allowed to use the WebUSB API.
  // Disabled following Mozilla's position ("negative"): https://mozilla.github.io/standards-positions/
  // "usb", // Experimental

  // Controls whether the current document is allowed to use Screen Wake Lock API to indicate that device should not turn off or dim the screen.
  "screen-wake-lock", // Experimental

  // Controls whether or not the current document is allowed to use the Navigator.share() of Web Share API to share text, links, images, and other content to arbitrary destinations of user's choice, e.g. mobile apps.
  "web-share", // Experimental

  // Controls whether or not the current document is allowed to use the WebXR Device API to interact with a WebXR session.
  "xr-spatial-tracking", // Experimental
].join(";");
