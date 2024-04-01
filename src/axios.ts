import axios, {AxiosInstance} from "axios";

interface OAuthToken {
    access_token: string;
    token_type: string;
}

interface ResponseData {
    oauthToken: OAuthToken;
    accountId: string;
}

const accessToken = (response: ResponseData) =>
    response?.oauthToken?.access_token;
const tokenType = (response: ResponseData) => response?.oauthToken?.token_type;
const accountId = (response: ResponseData) => response?.accountId;

export function create(apiKey: string, isDemo: boolean): AxiosInstance {
    return axios.create({
        baseURL: `https://${isDemo ? "demo-" : ""}api.ig.com/gateway/deal/`,
        headers: {
            Accept: "application/json; charset=UTF-8",
            "Content-Type": "application/json; charset=UTF-8",
            "X-IG-API-KEY": apiKey,
        },
    });
}

export function setHeaderTokens(
    instance: AxiosInstance,
    response: ResponseData,
): void {
    instance.defaults.headers.Authorization = `${tokenType(response)} ${accessToken(response)}`;
    instance.defaults.headers["IG-ACCOUNT-ID"] = accountId(response);
}

export default create;
