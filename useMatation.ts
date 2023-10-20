import { QueryKey, useMutation, useQueryClient } from "react-query";
import { useAppDispatch } from "../../../store/hooks";
import { useTranslation } from "react-i18next";
import { AxiosResponse } from "axios";
import { onErrorFun } from "./reactQueryUtils";
import { Dispatch } from "react";
import { AnyAction } from "@reduxjs/toolkit";

const useUpdateQuery = (
    callBack: (value: any) => Promise<AxiosResponse<any, any>>, // update query
    queryKey?: QueryKey // query key 여기는 리프레쉬할 리스트 api 요청을 할 때 넣었던 키를 넣습니다.
) => {
    const dispatch: Dispatch<AnyAction> = useAppDispatch(); // Redux
    const { t } = useTranslation<"error", undefined>("error"); // 국제화
    const queryClient = useQueryClient(); //  invalidateQueries 처리를 위한 선언
    return useMutation(callBack, {
        onError: (error?: unknown) => onErrorFun(error, dispatch, t), // error 발생 시 처리할 function
        onSuccess: () => {
            // 성공 후 function
            queryKey !== undefined && queryClient.invalidateQueries(queryKey); // mutation을 성공하면 querykey 에 있는 useQuery 를 재 호출 합니다.
        },
        retry: false // 실패시 재 요청 횟수
    });
};

export default useUpdateQuery;
