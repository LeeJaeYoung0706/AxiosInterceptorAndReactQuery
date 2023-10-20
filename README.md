# AxiosInterceptor 와 ReactQuery 의 병합 사용을 목적 테스팅 코드입니다.

## 이슈 사항

우선적으로 문제가 되었던 부분은 REST API가 3개여서 공통적인 부분으로 Axios Request Intercepter가 필요한 상황이었습니다.
하지만 ReactQuery의 사용으로 인해 Axios Response Interceptor의 Error Handling 기능을 사용하지 못 했기 때문에 조화롭게 사용해야 했습니다.

### 해결 방안


#### 1번 AxiosInstance 만들기
```ts
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
```

이러한 형식으로 만들었습니다. 예를 들면 REST API가 1, 2, 3이 있을 때 호출해야하는 상황이 서로 다르기 때문에 export Method를 만들어서 간편하게 호출할 수 있도록 instance를 모듈화하였습니다.
또한 FormData형식과 get형식의 Request 요청을 분할하여 Header를 동적으로 사용해야하는 상황이었기에 매개 변수로 사용할 수 있도록 설계하였습니다.

