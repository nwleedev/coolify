import { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import style from "~/index.css?url";
import Footer from "./components/Footer";
import Header from "./components/Header";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: style }];

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="entry">
          <Header />
          <Outlet />
          <Footer />
        </div>
        <div id="modals"></div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
