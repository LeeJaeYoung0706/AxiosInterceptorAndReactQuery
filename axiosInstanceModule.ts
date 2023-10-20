import axios, {AxiosInstance, AxiosResponse} from "axios";

export const restAPI1AxiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_restAPI1_URL,
    timeout: 1000 * 10
})

export const restAPI2AxiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_restAPI2_URL,
    timeout: 1000 * 10
})

export const restAPI3AxiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_restAPI3_URL,
    timeout: 1000 * 10
})


const apiConfigSetting: (
    method: string,
    APIConfig: APIProps,
    instance: AxiosInstance
) => Promise<AxiosResponse<any>> = (method: string, APIConfig: APIProps , instance: AxiosInstance) => {
    const { url, param, multipartUse } = APIConfig;
    const config: any = {
        url: url, // + '?lang=' + nowLanguage()
        method: method,
    };

    multipartUse
        ? (config.headers = {
            'Content-Type': 'multipart/form-data; charset=utf-8',
        })
        : (config.headers = {
            'Content-Type': 'application/json; charset=utf-8',
        });
    method === 'get' || method === 'delete'
        ? (config.params = param)
        : (config.data = param);

    return instance(config);
}

export const apiRequest = {
    restAPI1: {
        get: (APIConfig: APIProps) => {
            return apiConfigSetting('get', APIConfig , resourceUserAxiosInstance );
        },
        post: (APIConfig: APIProps) => {
            return apiConfigSetting('post', APIConfig , resourceUserAxiosInstance);
        },
        patch: (APIConfig: APIProps) => {
            return apiConfigSetting('patch', APIConfig , resourceUserAxiosInstance);
        },
        delete: (APIConfig: APIProps) => {
            return apiConfigSetting('delete', APIConfig , resourceUserAxiosInstance);
        }
    },
    restAPI2: {
        get: (APIConfig: APIProps) => {
            return apiConfigSetting('get', APIConfig , resourceAASAxiosInstance);
        },
        post: (APIConfig: APIProps) => {
            return apiConfigSetting('post', APIConfig  ,resourceAASAxiosInstance);
        },
        patch: (APIConfig: APIProps) => {
            return apiConfigSetting('patch', APIConfig , resourceAASAxiosInstance);
        },
        delete: (APIConfig: APIProps) => {
            return apiConfigSetting('delete', APIConfig , resourceAASAxiosInstance);
        }
    },
    restAPI3: {
        get: (APIConfig: APIProps) => {
            return apiConfigSetting('get', APIConfig , authAxiosInstance );
        },
        post: (APIConfig: APIProps) => {
            return apiConfigSetting('post', APIConfig , authAxiosInstance);
        },
    }

};
