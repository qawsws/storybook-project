// pages/_app.tsx

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";  // ✅ 상대경로로 수정


export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}


