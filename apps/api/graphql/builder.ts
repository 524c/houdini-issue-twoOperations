import SchemaBuilder from "@pothos/core";
import ValidationPlugin from "@pothos/plugin-validation";
import ErrorsPlugin from "@pothos/plugin-errors";
import { ZodError } from "zod";
import type { ZodFormattedError } from "zod";

// GraphQL schema builder by Pothos plugin
export const builder = new SchemaBuilder<{
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
    File: {
      Input: File;
      Output: File;
    };
  };
}>({
  plugins: [
    ErrorsPlugin,
    ValidationPlugin, // NOTE: always put it after ErrorsPlugin
  ],
  errorOptions: {
    defaultTypes: [Error, ZodError],
  },
  validationOptions: {
    // optionally customize how errors are formatted
    validationError: (zodError /*, args*/) => {
      // the default behavior is to just throw the zod error directly
      return zodError;
    },
  },
});

const ErrorInterface = builder.interfaceRef<Error>("Error").implement({
  fields: (t) => ({
    message: t.exposeString("message"),
  }),
});

builder.objectType(Error, {
  name: "BaseError",
  interfaces: [ErrorInterface],
});

// Util for flattening zod errors into something easier to represent in your Schema.
function flattenErrors(
  error: ZodFormattedError<unknown>,
  path: string[]
): { path: string[]; message: string }[] {
  // eslint-disable-next-line no-underscore-dangle
  const errors = error._errors.map((message) => ({
    path,
    message,
  }));

  Object.keys(error).forEach((key) => {
    if (key !== "_errors") {
      errors.push(
        ...flattenErrors(
          (error as Record<string, unknown>)[key] as ZodFormattedError<unknown>,
          [...path, key]
        )
      );
    }
  });

  return errors;
}

// A type for the individual validation issues
const ZodFieldError = builder
  .objectRef<{
    message: string;
    path: string[];
  }>("ZodFieldError")
  .implement({
    fields: (t) => ({
      message: t.exposeString("message"),
      path: t.exposeStringList("path"),
    }),
  });

// The actual error type
builder.objectType(ZodError, {
  name: "ZodError",
  interfaces: [ErrorInterface],
  fields: (t) => ({
    fieldErrors: t.field({
      type: [ZodFieldError],
      resolve: (err) => flattenErrors(err.format(), []),
    }),
  }),
});

// Define the default query type on the schema (required)
builder.queryType({
  fields: (t) => ({
    hello: t.string({
      errors: {},
      args: {
        name: t.arg.string({ required: false }),
      },
      validate: [
        (args) =>
          args.name?.slice(0, 1) === args.name?.slice(0, 1).toUpperCase(),
        { message: "Name must be capitalized" },
      ],
      resolve: async (parent, { name }) => {
        return `hello, ${name || "World"}`;
      },
    }),
  }),
});

// Define the default mutation type on the schema (required)
builder.mutationType({});
