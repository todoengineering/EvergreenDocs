import { z } from "zod";

import { User } from "../../users/users.schema";

const fakeUser: z.infer<typeof User> = {
  id: "fake-user-id",
  email: "fake@email.com",
};

export default fakeUser;
