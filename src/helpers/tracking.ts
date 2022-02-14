import Amplitude from "amplitude-js";

const instance = Amplitude.getInstance();
instance.init(window._env_.AMPLITUDE_API_KEY, undefined, {
  trackingOptions: {
    ip_address: false,
  },
});

type Properties = {
  [key: string]: any;
};

export const logEvent = (type: string, properties?: Properties) => {

  if (properties) {
    // Override the IP so we don't collect it
    // eslint-disable-next-line no-param-reassign
    properties.ip = "";
  }

  // Track only production URL (exclude all dev URLs)
  if (window.location.host === "qadsan.app") {
    instance.logEvent(type, properties);
  }
};
