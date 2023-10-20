import React, { Dispatch } from "react";
import { QueryKey, useQuery } from "react-query";
import { useAppDispatch } from "../../../store/hooks";
import { useTranslation } from "react-i18next";
import { onErrorFun } from "./reactQueryUtils";
import { AxiosResponse } from "axios";
import { AnyAction } from "@reduxjs/toolkit";

type testType = boolean | undefined;

const useSelectQuery = (queryKey: QueryKey, callBack: () => Promise<AxiosResponse<any, any>>, enabled?: testType) => {
    const dispatch: Dispatch<AnyAction> = useAppDispatch(); // redux alert 상태 값
    const { t } = useTranslation<"error", undefined>(); // 국제화
    return useQuery(queryKey, callBack, {
        onError: (error?: unknown) => onErrorFun(error, dispatch, t), // error 발생 할 경우 타는 function
        select: (data: any) => data?.data?.response, // data result 변환처리
        retry: false, // 실패시 재 요청 횟수
        enabled: enabled !== undefined ? enabled : true
    });
};

export default useSelectQuery;
