import { Http } from "@/api/http";
import { provider } from "@/api/http/provider";
import axios from "axios";
import getConfig from "next/config";

class APIError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class APIClient {
  private http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  get = async <T>(url = "", params = {}) => {
    try {
      return await this.http.get<T>(url, params);
    } catch (err) {
      throw this.handle(err);
    }
  };

  put = async <T>(url = "", data = {}) => {
    try {
      return await this.http.put<T>(url, data);
    } catch (err) {
      throw this.handle(err);
    }
  };

  private handle = (err: unknown): APIError => {
    let message = "unable to reach the internet"
    if (axios.isAxiosError(err)) {
      switch (err.code) {
        case "ECONNREFUSED":
          message = "Failed to connect to the server. Are you sure it is running?";
          break;
        default:
          message = err.message;
      }
    }
    return new APIError(message);
  }
}

const { publicRuntimeConfig } = getConfig();
let apiUrl = publicRuntimeConfig.API_SERVER_PATH || process.env.API_SERVER_PATH;
const Client = new APIClient(new Http(provider(apiUrl)));

export default Client;
