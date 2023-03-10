import type { TokenSet } from "openid-client";
import "sst/node/future/auth";

declare module "sst/node/future/auth" {
  export interface SessionTypes {
    user: {
      user: {
        id: string;
        provider: "github";
        profileImageUrl: string;
        emailAddress: string | null;
        firstName: string | null;
        lastName: string | null;
      };
    };
  }
}
