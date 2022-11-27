import { builder } from "../builder";

builder.scalarType("Date", {
  serialize: (value) => new Date(value),
  parseValue: (value) => new Date(value as string | number | Date),
});

builder.scalarType("File", {
  serialize: () => {
    throw new Error("Uploads can only be used as input types");
  },
});
