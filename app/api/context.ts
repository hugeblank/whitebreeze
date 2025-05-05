export function createContext({
  req,
  resHeaders,
}: {
  req: Request;
  resHeaders: Headers;
}) {
  // As an example, you can retrieve auth or other information here.
  // const user = { name: req.headers.get("username") ?? "anonymous" };
  return {
    req,
    resHeaders,
    // user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
