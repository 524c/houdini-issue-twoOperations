import consola from "consola";

function logRequest(
  eventName: string,
  args: { args: { contextValue: { req: unknown; params: { query: string } } } }
) {
  //const { req } = args.args.contextValue;
  const params = args?.args?.contextValue?.params;
  if (params?.query.indexOf("query IntrospectionQuery") === -1) {
    //skip annoying logs
    consola.log(params);
  }
}

export { logRequest };
