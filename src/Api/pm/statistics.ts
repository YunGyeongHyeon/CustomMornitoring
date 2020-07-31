import client from '../configs/basic';
import React, {useReducer, useCallback} from 'react';
import * as _ from 'lodash';

/**
 * getPowerList()
 * 전력 통계 정보 불러오기
 * @param {string} url 링크 주소
 * @returns {object} data object
 * @author 준희
 * @version 0.1
 */
export const getPowerList = async( url: string) =>{
    const temp: IServerData = await client.get(url);
    console.log(temp.results);
    return temp.results!;
}

/**
 * getAbilityList()
 * 능력 통계 정보 불러오기
 * @param {string} url 링크 주소
 * @returns {object} data object
 * @author 준희
 * @version 0.1
 */
export const getAbilityList = async( url: string) =>{
    const temp: IServerData = await client.get(url);
    console.log(temp.results);
    return temp.results!;
}

/**
 * getOilSupplyData()
 * 오일공급 통계 정보 불러오기
 * @param {string} url 링크 주소
 * @returns {object} data object
 * @author 준희
 * @version 0.1
 */
export const getOilSupplyData = async( url: string) =>{
    const temp: IServerData = await client.get(url);
    console.log(temp.results);
    return temp.results!;
}

/**
 * getReadyTimeData()
 * 비가동시간 통계 정보 불러오기
 * @param {string} url 링크 주소
 * @returns {object} data object
 * @author 준희
 * @version 0.1
 */
export const getReadyTimeData = async( url: string) =>{
    const temp: IServerData = await client.get(url);
    console.log(temp.results);
    return temp.results!;
}

/**
 * getCapacityTimeData()
 * 생산 통계 정보 불러오기
 * @param {string} url 링크 주소
 * @returns {object} data object
 * @author 준희
 * @version 0.1
 */
export const getCapacityTimeData = async( url: string) =>{
    const temp: IServerData = await client.get(url);
    console.log(temp.results);
    return temp.results!;
}

/**
 * getErrorData()
 * 에러 통계 정보 불러오기
 * @param {string} url 링크 주소
 * @returns {object} data object
 * @author 정민
 * @version 0.1
 */

export const getErrorData = async( url: string) =>{
    const temp: IServerData = await client.get(url);
    console.log(temp.results);
    return temp.results!;
}

export const API_URLS = {
    power: {
        list:`/v1/Statistics/press/electric`
    },
    error: {
        list:   `/v1/statistics/press/error/list`,
        load:   `/v1/statistics/press/error/detail`
    },
    ability: {
        load:`/v1/statistics/press/ability`
    },
    oilSupply: {
        load:`/v1/statistics/press/oil`
    },
    readyTime: {
        load:`/v1/statistics/press/downtime`
    },
    capacity: {
        load:`/v1/statistics/press/production`
    }

}

