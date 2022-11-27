import type { Socket } from "net";
import { createServer } from "http";
import { createYoga, useLogger } from "graphql-yoga";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { schema } from "$graphql/schema";
import { logRequest } from "$lib/utils/logRequest";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 4000;

export async function buildApp() {
  const yogaApp = createYoga({
    schema: schema,
    graphiql: {
      // Use WebSockets in GraphiQL
      subscriptionsProtocol: "WS",
    },
    plugins: [
      useLogger({
        logFn: async (eventName, args) => {
          if (eventName === "execute-start") {
            // log only execute-start event
            logRequest(eventName, args);
          }
        },
      }),
    ],
  });

  // deepcode ignore HttpToHttps
  const server = createServer(yogaApp);
  const wss = new WebSocketServer({
    server,
    path: yogaApp.graphqlEndpoint,
  });

  useServer(
    {
      execute: (args: any) => args.execute(args),
      subscribe: (args: any) => args.subscribe(args),
      onSubscribe: async (ctx, msg) => {
        const { schema, execute, subscribe, contextFactory, parse, validate } =
          yogaApp.getEnveloped({
            ...ctx,
            req: ctx.extra.request,
            socket: ctx.extra.socket,
            params: msg.payload,
          });

        const args = {
          schema,
          operationName: msg.payload.operationName,
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
          contextValue: await contextFactory(),
          execute,
          subscribe,
        };

        const errors = validate(args.schema, args.document);
        if (errors.length) return errors;
        return args;
      },
    },
    wss
  );

  // for termination
  const sockets = new Set<Socket>();
  server.on("connection", (socket) => {
    sockets.add(socket);
    server.once("close", () => sockets.delete(socket));
  });

  return {
    start: (hostname: string, port: number) =>
      new Promise<void>((resolve, reject) => {
        server.on("error", (err) => reject(err));
        server.on("listening", () => resolve());
        server.listen(port, hostname);
      }),
    stop: () =>
      new Promise<void>((resolve) => {
        for (const socket of sockets) {
          socket.destroy();
          sockets.delete(socket);
        }
        server.close(() => resolve());
      }),
    path: yogaApp.graphqlEndpoint,
  };
}

(async function main() {
  const app = await buildApp();
  app.start(DEFAULT_HOST, DEFAULT_PORT);
  console.log(
    "🧘",
    `GraphQL API located at http://${DEFAULT_HOST}:${DEFAULT_PORT}${app.path}`
  );
})().catch((e) => {
  console.log(e);
  process.exit(1);
});
