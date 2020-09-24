import client from '../configs/basic';

/**
 * getItemSearch()
 * 품목 입력
 * @param {string} url 링크 주소
 * @param {string} item_name 품목명
 * @returns {Array} 품목 리스트
* @author 준희
*/
export const getItemSearch = async( url: string) =>{
    const temp: IServerData = await client.get(url);
    return temp
}

/**
 * getStockList()
 * 재고 관리 리스트
 * @param {string} url 링크 주소
 * @returns {Array} 품목 리스트
 * @author 정민
 */
export const getStockList = async( url: string) =>{
    const temp: IServerData = await client.get(url);
    return temp.results
}

export const API_URLS = {
    stock: {
        list: `/v1/stock/list`,
        loadFilter: `/v1/stock/load/filters`,
        loadDetail: `/v1/stock/load/details`,
        warehousingRegister: `/v1/stock/warehousing/register`,
        releaseRegister: `/v1/stock/release/register`,
    },
    parts:{
        list: `/v1/stock/parts/list`,
        detail: `/v1/stock/parts/load`,
        warehousingRegister: `/v1/stock/parts/warehousing/register`,
        releaseRegister: `/v1/stock/parts/release/register`,
    },
    searchItem:{
        list: `/manageStock/searchItem`,
    },
}


