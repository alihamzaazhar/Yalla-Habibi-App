import axios, {
  AxiosAdapter,
  AxiosError,
  AxiosInstance,
} from "axios";
import * as rax from "retry-axios";
import { v4 as uuidv4 } from "uuid";

import JwtTokenManager from "./jwt-token-manager";
import { ResponsePromise } from "./typings";

export interface Config {
  baseUrl: string;
  maxRetries: number;
  apiKey?: string;
  publishableApiKey?: string;
  customHeaders?: Record<string, any>;
  axiosAdapter?: AxiosAdapter;
}

export interface RequestOptions {
  timeout?: number;
  numberOfRetries?: number;
}

export type RequestMethod = "DELETE" | "POST" | "GET";

const defaultConfig = {
  maxRetries: 0,
  baseUrl: "http://localhost:9000",
};

class Client {
  private axiosClient: AxiosInstance;
  private config: Config;

  constructor(config: Config) {
    this.axiosClient = this.createClient({ ...defaultConfig, ...config });
    this.config = { ...defaultConfig, ...config };
  }

  shouldRetryCondition(
    err: AxiosError,
    numRetries: number,
    maxRetries: number
  ): boolean {
    // Obviously, if we have reached max. retries we stop
    if (numRetries >= maxRetries) {
      return false;
    }

    // If no response, we assume a connection error and retry
    if (!err.response) {
      return true;
    }

    // Retry on conflicts
    if (err.response.status === 409) {
      return true;
    }

    // All 5xx errors are retried
    // OBS: We are currently not retrying 500 requests, since our core needs proper error handling.
    //      At the moment, 500 will be returned on all errors, that are not of type MedusaError.
    if (err.response.status > 500 && err.response.status <= 599) {
      return true;
    }

    return false;
  }

  // Stolen from https://github.com/stripe/stripe-node/blob/fd0a597064289b8c82f374f4747d634050739043/lib/utils.js#L282
  normalizeHeaders(obj: object): Record<string, any> {
    if (!(obj && typeof obj === "object")) {
      return obj;
    }

    return Object.keys(obj).reduce((result, header) => {
      //@ts-ignore
      result[this.normalizeHeader(header)] = obj[header];
      return result;
    }, {});
  }

  // Stolen from https://github.com/marten-de-vries/header-case-normalizer/blob/master/index.js#L36-L41
  normalizeHeader(header: string): string {
    return header
      .split("-")
      .map(
        (text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
      )
      .join("-");
  }

  async setHeaders(
    userHeaders: RequestOptions,
    method: RequestMethod,
    path: string,
    customHeaders: Record<string, any> = {}
  ) {
    let defaultHeaders: Record<string, any> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    };

    let existingToken = null;
    try {
      existingToken = await JwtTokenManager.getJwtAsync();
    } catch (e) {}

    if (existingToken) {
      defaultHeaders = {
        ...defaultHeaders,
        Authorization: `Bearer ${existingToken}`,
      };
    }

    // only add idempotency key, if we want to retry
    if (this.config.maxRetries > 0 && method === "POST") {
      defaultHeaders["Idempotency-Key"] = uuidv4();
    }

    return Object.assign(
      {},
      defaultHeaders,
      this.normalizeHeaders(userHeaders),
      customHeaders
    );
  }

  createClient(config: Config): AxiosInstance {
    const client = axios.create({
      baseURL: config.baseUrl,
      adapter: config.axiosAdapter,
    });

    rax.attach(client);

    client.defaults.raxConfig = {
      instance: client,
      retry: config.maxRetries,
      backoffType: "exponential",
      shouldRetry: (err: AxiosError): boolean => {
        const cfg = rax.getConfig(err);
        if (cfg) {
          return this.shouldRetryCondition(
            err,
            cfg.currentRetryAttempt ?? 1,
            cfg.retry ?? 3
          );
        } else {
          return false;
        }
      },
    };

    return client;
  }

  async request<T>(
    method: RequestMethod,
    path: string,
    payload: Record<string, any> = {},
    options: RequestOptions = {},
    customHeaders: Record<string, any> = {},
  ): ResponsePromise<T> {
    customHeaders = { ...this.config.customHeaders, ...customHeaders };
    const reqOpts = {
      method,
      withCredentials: false,
      url: path,
      json: true,
      headers: await this.setHeaders(options, method, path, customHeaders),
    };
    if (["POST", "DELETE"].includes(method)) {
      //@ts-ignore
      reqOpts["data"] = payload;
    }
    const { data, ...response } = await this.axiosClient(reqOpts);
    // e.g. data = { cart: { ... } }, response = { status, headers, ... }

    // e.g. would return an object like of this shape { cart, response }
    return { ...data, response };
  }
}

export default Client;
