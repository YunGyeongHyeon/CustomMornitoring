import client from '../configs/basic';
import React, {useReducer, useCallback} from 'react';
import * as _ from 'lodash';

/**
 * postProcessRegister()
 * 공정 등록하기
 * @param {string} url 링크 주소
 * @param {Object} bodyData 공정 등록 정보 객체
 * @returns {Boolean} 성공 실패 여부 true/false 리턴
 * @author 준희
 */
export const postProcessRegister = async( url: string, bodyData: object) =>{
    const temp: IServerData = await client.get(url, bodyData);
    return temp
}

/**
 * getSearchMachine()
 * 기계 검색하기
 * @param {string} url 링크 주소
 * @param {Object} keyword 기계명
 * @returns {Object} 기게정보 리스트
 * @author 준희
 */

export const getSearchMachine = async( url: string) =>{
    const temp: IServerData = await client.get(url);
    return temp
}

export const API_URLS = {
    process:{
        register: `/process/register`,
        update: `/process/update`,
        load: `/process/load`,
        list: `/process/list`,
        delete: `/process/delete`,
    },
    machine: {
        list: `/machine/search`
    }

}

