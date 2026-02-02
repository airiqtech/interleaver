import { logger } from "../logger/logger";

type HttpClientOptions = {
  baseUrl: string;
  timeoutMs: number;
};

type RequestOptions = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export class HttpClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.timeoutMs = options.timeoutMs;
  }

  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    };

    const url =
      path.startsWith("http") || path.startsWith("https")
        ? path
        : `${this.baseUrl}${path}`;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: options.signal ?? controller.signal,
      });

      if (!response.ok) {
        const message = `HTTP ${response.status} from ${url}`;
        logger.warn(message);
        throw new Error(message);
      }

      const json = (await response.json()) as unknown;
      return json as T;
    } catch (error) {
      logger.error(`Request failed for ${url}`, error as Error);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
