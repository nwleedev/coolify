import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";

export function loader(args: LoaderFunctionArgs) {
  const headers = Array.from(args.request.headers.entries());
  console.log(headers);
  return json({});
}

export default function StatusPage() {
  return (
    <div>
      <h1>Status Page</h1>
      <p>ok</p>
    </div>
  );
}
