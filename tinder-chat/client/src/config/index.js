import axios from 'axios';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address,
    window.location.hostname === '[::1]' ||
    //  is the IPv4 localhost address,
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const API_URL = isLocalhost
  ? 'http://localhost:8080'
  : 'http://35.180.109.170:8080';

export const Axios = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});
