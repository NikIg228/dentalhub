const SESSION_KEY = "dentalhub.session";
const SESSION_VALUE = "authenticated";
const DEFAULT_PASSWORD = "dentalhub";

function getConfiguredPassword() {
  return process.env.NEXT_PUBLIC_LOGIN_PASSWORD || DEFAULT_PASSWORD;
}

export function verifyLocalPassword(password: string) {
  return password === getConfiguredPassword();
}

export function isLocalSessionActive() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(SESSION_KEY) === SESSION_VALUE || sessionStorage.getItem(SESSION_KEY) === SESSION_VALUE;
}

export function createLocalSession(remember: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  clearLocalSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(SESSION_KEY, SESSION_VALUE);
}

export function clearLocalSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
