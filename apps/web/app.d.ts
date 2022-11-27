/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  interface Locals {
    user: IUser;
    issuers: Issuers;
  }
  //interface Platform {}
  // interface Session {}
  // interface Stuff {}
  interface Error {
    message: string;
    code?: string;
  }

  interface PageData {
    [key: string]: any;
  }

  interface Window {
    handleCaptchaCallback: (token: string) => Promise<void>;
    resetCaptcha: () => void;
    handleCaptchaError: () => void;
  }
}
