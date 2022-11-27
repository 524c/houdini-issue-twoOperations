import type { ObjectRef } from "@pothos/core";
import { builder } from "../builder";

interface User {
  id: string;
  pk: number;
  name: string;
}

const users: User[] = [
  {
    pk: 1,
    id: "60d89c23-487b-41c2-999c-8ec7e576915f",
    name: "Bruce Willis",
  },
  {
    pk: 2,
    id: "2417428b-6c2b-47a0-8bb5-262fa5aef439",
    name: "Al Pacino",
  },
  {
    pk: 3,
    id: "749d92d5-0d5e-4e2a-ad34-bc82fac227f8",
    name: "Jack Nicholson",
  },
  {
    pk: 4,
    id: "749d92d5-0d5e-4e2a-ad34-bc82fac227f8",
    name: "Jim Carrey",
  },
];

export const UserObject: ObjectRef<User, User> = builder
  .objectRef<User>("User")
  .implement({
    description: "User object type",
    fields: (t) => ({
      id: t.exposeID("id"),
      pk: t.exposeInt("pk"),
      name: t.exposeString("name"),
    }),
  });

builder.queryField("AllUsers", (t) =>
  t.field({
    type: [UserObject],
    description: "returns all users",
    errors: {},
    resolve: async () => {
      //
      return users;
    },
  })
);

builder.queryField("User", (t) =>
  t.field({
    type: UserObject,
    description: "returns user data",
    errors: {},
    args: { userPk: t.arg({ type: "Int", required: true }) },
    resolve: async (_, { userPk }: { userPk: number }) => {
      if (
        !(typeof userPk === "number" && userPk > 0 && userPk <= users.length)
      ) {
        throw new Error("Invalid userPk");
      }
      return users[userPk - 1];
    },
  })
);
