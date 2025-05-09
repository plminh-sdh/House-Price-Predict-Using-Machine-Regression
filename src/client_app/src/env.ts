// This file for compatibility with Jest unit testing only.
// If Vitest is the unit test framework of choice, this file can be skipped

const { VITE_APP_API_END_POINT } = import.meta.env;
const env = {
  VITE_APP_API_END_POINT,
};
export default env;
