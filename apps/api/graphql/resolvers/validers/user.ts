import type { ValidationOptions } from "@pothos/plugin-validation";

const ZodValidateEmail: ValidationOptions<string> = {
  email: [true, { message: "E-mail inválido" }],
};

const ZodValidatePassword: ValidationOptions<string> = {
  minLength: [6, { message: "A senha precisa ter no mínimo 6 caracteres" }],
  maxLength: [18, { message: "A senha deve ter no máximo 18 caracteres" }],
};

const ZodValidateName: ValidationOptions<string> = {
  minLength: [6, { message: "O nome precisa ter no mínimo 2 letras" }],
  maxLength: [20, { message: "O nome deve ter no máximo 20 letras" }],
};

export { ZodValidateEmail, ZodValidatePassword, ZodValidateName };
