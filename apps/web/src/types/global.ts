import { Clerk } from "@clerk/types";

export {};
declare global {
  interface Window {
    Clerk: Clerk;
  }
}
