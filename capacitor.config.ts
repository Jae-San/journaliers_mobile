import type { CapacitorConfig } from "@capacitor/cli";

// Dev-time setup: the native shell loads the Vite dev server directly over
// your LAN so the app updates live on your phone/emulator, exactly like
// running `npm run dev` in a browser. Replace with your machine's LAN IP
// (find it with `ipconfig`, look for IPv4 Address) before `npx cap run android`.
//
// This project builds its production bundle for a server (SSR on Cloudflare
// Workers via Nitro) rather than static files, so `webDir` isn't wired to a
// real production build yet — that gets revisited once the backend exists
// and we decide how the shipped app will fetch its data.
const DEV_SERVER_LAN_URL = "http://192.168.1.10:8080";

const config: CapacitorConfig = {
  appId: "com.journaliers.app",
  appName: "Journaliers",
  webDir: "dist",
  server: {
    url: DEV_SERVER_LAN_URL,
    cleartext: true,
  },
};

export default config;
