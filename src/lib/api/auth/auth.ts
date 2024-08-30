import { janitorAuth } from "../instances";
import { OptionsSignIn, ResponseSignIn } from "./types";

export const signIn = ({ body }: OptionsSignIn) => {
  return janitorAuth<ResponseSignIn>("/token", {
    body: {
      ...body,
      gotrue_meta_security: {},
    },
    params: { grant_type: "password" },
    method: "POST",
  });
};
