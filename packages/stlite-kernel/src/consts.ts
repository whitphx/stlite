// The following hostname and port are invalid values for constructing an actual URL
// so that they should not be accidentally used to refer to and access external resources.
export const DUMMY_BASE_HOSTNAME = "xxx";
export const DUMMY_BASE_PORT = 99999;
export const DUMMY_BASE_HOST =
  DUMMY_BASE_HOSTNAME + ":" + DUMMY_BASE_PORT.toString();
