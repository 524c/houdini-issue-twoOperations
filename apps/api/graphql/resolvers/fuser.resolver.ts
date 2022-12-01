import { builder } from "../builder";
import type { UserInput } from "./user.resolver";
import { OauthProviders } from "../../types";
import type { ObjectRef } from "@pothos/core";

// fake interfaces/data for reproduce a bug in Insomnia

export interface FUserInput {
  userId: string;
  subject: string;
  provider: OauthProviders;
}

interface FUserResult {
  success: boolean;
  fuser: FederatedUser;
  token: string;
}

interface FederatedUser {
  id: string;
  pk: number;
  name: string;
  provider: string;
  subject: string;
}

builder.enumType(OauthProviders, { name: "OauthProviders" });

export const FUserObject: ObjectRef<FederatedUser, FederatedUser> = builder
  .objectRef<FederatedUser>("FUserObject")
  .implement({
    description: "User object type",
    fields: (t) => ({
      id: t.exposeID("id"),
      pk: t.exposeInt("pk"),

      provider: t.exposeString("provider"),
      subject: t.exposeString("subject"),
    }),
  }) as ObjectRef<FederatedUser, FederatedUser> & null;

const FUserResultObject: ObjectRef<FUserResult, FUserResult> = builder
  .objectRef<FUserResult>("FUserResult")
  .implement({
    description: "Response object for authentication queries",
    fields: (t) => ({
      user: t.field({
        type: FUserObject,
        resolve: (result) => result.fuser as FederatedUser,
      }),
      token: t.exposeString("token"),
    }),
  });

const UserInput = builder.inputType("UserInput", {
  fields: (t) => ({
    email: t.string({
      required: true,
    }),
    name: t.string({
      required: true,
    }),
    password: t.string({
      required: true,
    }),
  }),
});

const FUserInput = builder.inputType("FUserInput", {
  fields: (t) => ({
    userId: t.string({
      required: true,
      //validate: ZodValidateEmail,
    }),
    subject: t.string({
      required: true,
      //validate: ZodValidateName,
    }),
    provider: t.field({
      type: OauthProviders,
      required: true,
      //validate: ZodValidatePassword,
    }),
  }),
});

builder.mutationField("FederatedSignup", (t) =>
  t.field({
    type: FUserResultObject,
    description: "Create Federated User",
    errors: {},
    args: {
      UserInput: t.arg({ type: UserInput, required: true }),
      FUserInput: t.arg({ type: FUserInput, required: true }),
    },
    resolve: async (
      _parent: any,
      {
        UserInput,
        FUserInput,
      }: { UserInput: UserInput; FUserInput: FUserInput }
    ) => {
      // fake response
      const fuser = {
        id: "c137fef7-5749-4498-95f3-2c123e141f1b",
        pk: 1,
        name: "Roger",
        provider: "GOOGLE",
        subject: "fakeemail@gmail.com",
      };

      return { success: true, fuser: fuser, token: "" };
    },
  })
);
