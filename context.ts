import type { IncomingMessage, ServerResponse } from "http";
import type { User } from "../../drizzle/schema";

export interface Context {
  user: User | null;
  req: IncomingMessage;
  res: ServerResponse;
}

export async function createContext(opts: {
  req: IncomingMessage;
  res: ServerResponse;
}): Promise<Context> {
  // TODO: Extract user from session/JWT if needed
  return {
    user: null,
    req: opts.req,
    res: opts.res,
  };
}
