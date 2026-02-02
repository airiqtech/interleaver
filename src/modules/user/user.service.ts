import { UserClient } from "../../clients/user.client";
import { UserAdapter } from "./user.adapter";
import { UserDTO } from "./user.types";

/**
 * Services orchestrate backend calls and aggregate data.
 * Keep logic thin—no domain rules or persistence.
 */
export class UserService {
  constructor(private readonly userClient: UserClient) {}

  async getUser(id: string): Promise<UserDTO> {
    const backendUser = await this.userClient.fetchUserById(id.toString());
    return UserAdapter.toUser(Number(id), backendUser);
  }
}
