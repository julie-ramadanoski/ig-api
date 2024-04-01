import {AxiosInstance} from "axios";
import {create, setHeaderTokens} from "./axios";

type Headers = {
    Version: number;
    _method?: string;
};

interface Config {
    params?: any;
    data?: any;

    [key: string]: any;
}

export default class IG {
    private api: AxiosInstance;

    constructor(apiKey: string, isDemo: boolean) {
        this.api = create(apiKey, isDemo);
    }

    async request(method: string, path: string, version: number, config: Config) {
        try {
            const headers: Headers = {Version: version || 1};
            const response = await this.api.request({
                ...config,
                method,
                url: path,
                headers,
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    get(path: string, version: number, params: any) {
        return this.request("get", path, version, {params});
    }

    post(path: string, version: number, data: any) {
        return this.request("post", path, version, {data});
    }

    put(path: string, version: number, data: any) {
        return this.request("put", path, version, {data});
    }

    delete(path: string, version: number, data: any) {
        return this.request("delete", path, version, {data});
    }

    login(username: string, password: string) {
        return this.post("session", 3, {
            identifier: username,
            password,
        }).then((response) => {
            setHeaderTokens(this.api, response);
            return response;
        });
    }

    logout() {
        return this.delete("session", 1, null);
    }
}
