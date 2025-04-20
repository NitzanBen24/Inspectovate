import { getUserDetails } from "../lib/db/users";

// services/userService.ts
export async function fetchUserDetails(userId: string) {
    return await getUserDetails(userId);
}
  

  