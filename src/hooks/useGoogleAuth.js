import { useGoogleLogin } from '@react-oauth/google';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let initialized = false;

async function nativeGoogleLogin() {
  if (!initialized) {
    await SocialLogin.initialize({ google: { webClientId: GOOGLE_CLIENT_ID } });
    initialized = true;
  }
  // Note: passing `scopes` here breaks on Android unless MainActivity is
  // patched (plugin limitation); the default sign-in already returns an
  // ID token containing email + name, which is all the backend needs.
  const { result } = await SocialLogin.login({
    provider: 'google',
    options: {},
  });
  // Send only the ID token when we have one: the backend verifies it via
  // Google's tokeninfo endpoint, which is reachable from the cPanel host,
  // while the userinfo call used for access tokens is not.
  if (result.idToken) {
    return { access_token: null, id_token: result.idToken };
  }
  return { access_token: result.accessToken?.token ?? null, id_token: null };
}

/**
 * Drop-in replacement for useGoogleLogin that also works inside the
 * Capacitor APK, where Google blocks the web OAuth flow. onSuccess
 * receives { access_token, id_token } (either may be null).
 */
export default function useGoogleAuth({ onSuccess, onError }) {
  const webLogin = useGoogleLogin({
    onSuccess: (tokenResponse) =>
      onSuccess({ access_token: tokenResponse.access_token, id_token: null }),
    onError,
  });

  if (!Capacitor.isNativePlatform()) return webLogin;

  return async () => {
    try {
      const tokens = await nativeGoogleLogin();
      if (!tokens.access_token && !tokens.id_token) {
        throw new Error('No Google token received');
      }
      await onSuccess(tokens);
    } catch (err) {
      // Closing the Google account picker is not an error.
      if (String(err?.message || err).toLowerCase().includes('cancel')) return;
      onError?.(err);
    }
  };
}
