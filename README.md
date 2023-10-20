# AxiosInterceptor 와 ReactQuery 의 병합 사용을 목적 테스팅 코드입니다.

## 이슈 사항

우선적으로 문제가 되었던 부분은 REST API가 3개여서 공통적인 부분으로 Axios Request Intercepter가 필요한 상황이었습니다.
하지만 ReactQuery의 사용으로 인해 Axios Response Interceptor의 Error Handling 기능을 사용하지 못 했기 때문에 조화롭게 사용해야 했습니다.

### 해결 방안


#### 1번 AxiosInstance 만들기
```ts
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
```
우선 MSA 구조의 특성 상 기능별로 REST API를 나누어 설계하기 때문에 REST API가 3개라고 가정한다면 이런 식으로 서로 다른 baseURL을 가지도록 했습니다. 여기서 저는 고민을 했는데 예를 들면
instance를 생성하는 메소드를 호출하는 과정을 거치는 함수를 만들어서 Axios 호출 메소드에 매개변수 형식으로 넣을까 했습니다. 

```ts
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
이러한 호출을 담당하는 메소드가 있을 때 그런 형식으로 변경한다면 


```ts
export const apiRequest = {
    get: {
        restAPI1: (APIConfig: APIProps) => {
            return apiConfigSetting('get', 'restAPI1', APIConfig , resourceUserAxiosInstance );
        },
        restAPI2: (APIConfig: APIProps) => {
            return apiConfigSetting('get', 'restAPI2', APIConfig , resourceUserAxiosInstance);
        },
        restAPI3: (APIConfig: APIProps) => {
            return apiConfigSetting('get', 'restAPI3', APIConfig , resourceUserAxiosInstance);
        },
    },
     ... get , post , patch , delete 구현해야함
};

```
이런 식으로 매개 변수를 추가해야하고 따로 추상화된 메소드 내에 env형식을 삼항연산자로 표시해야한다는 것 때문에 기능적으로 하나만 존재하면 되는 메소드를 고민하다가 3개로 나누었습니다.
```ts
stringAPI === 'restAPI1' ? process.env.restAPI1 : stringAPI === 'restAPI2' ? process.env.restAPI2
```
이런 형식으로 말이죠 그래서 어느 방향이 솔직히 나을지 몰라서 저는 그냥 한 개씩 구현하는 방향으로 선택하게 되었습니다.

아래는 이에 따른 instanceConfigSetting 입니다.
```ts
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
```
