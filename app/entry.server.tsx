/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { ModalProvider } from "./contexts/modal";

const ABORT_DELAY = 5_000;

function errorLog(error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {
  return isbot(request.headers.get("user-agent") || "")
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}

async function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const body = await renderToReadableStream(
    <ModalProvider>
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />
    </ModalProvider>,
    {
      signal: request.signal,
      onError(error: unknown) {
        errorLog(error);
        responseStatusCode = 500;
      },
    }
  );
  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set(
    "cache-control",
    "public, max-age=604800, s-max-age=604800, must-revalidate"
  );
  await body.allReady;

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

async function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const body = await renderToReadableStream(
    <ModalProvider>
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />
    </ModalProvider>,
    {
      signal: request.signal,
      onError(error: unknown) {
        errorLog(error);
        responseStatusCode = 500;
      },
    }
  );
  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set(
    "cache-control",
    "public, max-age=604800, s-max-age=604800, must-revalidate"
  );

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
