/**
 * API 요청시 보낼 객체를 생성하는 클래스
 */
export class ApiConfig {
    public url: string;
    public param: paramInterface | null;
    public multipartUse: boolean;

    private constructor(
        url: string,
        param: paramInterface | null,
        multipartUse: boolean
    ) {
        this.param = param;
        this.url = url;
        this.multipartUse = multipartUse;
    }

    static Builder = class {
        private _url = '';
        private _param = null;
        private _multipartUse = false;

        setUrl(value: string) {
            this._url = value;
            return this;
        }

        setParam(value: any) {
            this._param = value;
            return this;
        }

        setMultipartUse(value: boolean) {
            this._multipartUse = value;
            return this;
        }

        build() {
            return Object.freeze(new ApiConfig(this._url, this._param, this._multipartUse));
        }

    };
}
