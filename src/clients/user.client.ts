import { HttpClient } from "../core/http/httpClient";
import { UserBackendDTO } from "../modules/user/user.types";
import { config } from "../config";

/**
 * Downstream HTTP client for user data.
 * All backend calls must go through a client to keep controllers/services slim.
 */
export class UserClient {
  private readonly httpClient: HttpClient;

  constructor(private readonly baseUrl: string = config.env.USER_SERVICE_BASE_URL) {
    this.httpClient = new HttpClient({
      baseUrl: this.baseUrl,
      timeoutMs: config.constants.REQUEST_TIMEOUT_MS,
    });
  }

  async fetchUserById(id: string): Promise<UserBackendDTO> {
    const path = `/users/${encodeURIComponent(id)}`;
    return this.httpClient.get<UserBackendDTO>(path);
  }
}
