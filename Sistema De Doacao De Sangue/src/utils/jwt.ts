import { parseCookies, setCookie } from 'nookies';

import CryptoJS from 'crypto-js';
import axios from "./axios";
import jwtDecode from "jwt-decode";

const isValidToken = (accessToken: string): boolean => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

function setCookies(key: string, value: string) {
  setCookie(null, key, value, {
    maxAge: 30 * 24 * 60 * 60, // 30 Dias
    path: '/',
  });
}

function getCookie(): number {
  const cookie = parseCookies();
  if (!cookie["crm-token"] || !isValidToken(cookie["crm-token"].toString()) || !cookie["codUser"]) {
    return 0;
  } else if (cookie["crm-token"] && isValidToken(cookie["crm-token"].toString()) && cookie["codUser"]) {
    return 1;
  }
  return 0;
}

const decryptCookieValue = (): number | null => {
  const cookie = parseCookies();
  const encryptedValue = cookie["codUser"];
  if (!encryptedValue) {
    return null; // Cookie não encontrado
  }
  const secretKey = "8)-i<!du:!x#|2lc+mm+(b13+?4$zua))~6w~jh!1b8?}f9jtp^6/b]$2!wi}9f";
  const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
  const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
  return parseInt(decryptedValue);
};

const encryptCookieValue = (value: string): string => {
  const secretKey = "8)-i<!du:!x#|2lc+mm+(b13+?4$zua))~6w~jh!1b8?}f9jtp^6/b]$2!wi}9f";
  return CryptoJS.AES.encrypt(value, secretKey).toString();
};

const getPermissoesFromCookie = (): number[] => {
  const cookies = parseCookies();
  const value = cookies["permCookie"];

  if (!value) {
    return [];
  }

  return decodeURIComponent(value).split(',').map(Number);
};

const hasPermission = (permissions: number[], requiredPermission: number): boolean => {
  return permissions.includes(requiredPermission);
};

const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession, getCookie, decryptCookieValue, setCookies, getPermissoesFromCookie, hasPermission, encryptCookieValue };
