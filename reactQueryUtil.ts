import { TFunction } from "i18next";
import { QueryKey } from "react-query";
import { alertOpen } from "../../../store/slices/alertSlice";
import { Dispatch } from "react";
import { AnyAction } from "@reduxjs/toolkit";

export const queryKey = (key: string) => {
    return {
        defaultKey: [`${key}`] as QueryKey,
        addKey: (...args: any[]) => {
            const array = [`${key}`];
            return array.concat(...args) as QueryKey;
        }
    };
};

const excludeStatus = [0];
/**
 * HTTP status 가 200 이 아닐 경우 error 처리 하기 위한 Function
 * @param error
 * @param dispatch
 * @param t
 */
export const onErrorFun = (error: any, dispatch: Dispatch<AnyAction>, t: TFunction<"error", undefined, "error">) => {
    let status = error.request.status;
    if (excludeStatus.includes(status)) status = 500;

    const title = `error:${status}:title` as string; // 국제화 파일 변수 이름
    const message = `error:${status}:message` as string; // 국제화 파일 변수 이름

    dispatch(
        alertOpen({
            title: t(title),
            items: 1,
            message: t(message),
            text1: "확인"
        })
    );
};
