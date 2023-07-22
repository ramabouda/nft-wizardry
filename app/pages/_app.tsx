import { NextUIProvider } from "@nextui-org/react";
import "./globals.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: any) {
  return (
    <NextUIProvider>
      <Component {...pageProps} />;
    </NextUIProvider>
  );
}
