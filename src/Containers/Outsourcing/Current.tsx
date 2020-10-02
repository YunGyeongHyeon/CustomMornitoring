import React, {useCallback, useEffect, useState,} from "react";
import Styled from "styled-components";
import OvertonTable from "../../Components/Table/OvertonTable";
import {API_URLS, getOutsourcingList, postOutsourcingDelete} from "../../Api/mes/outsourcing";
import {useHistory} from "react-router-dom";
import {getCustomerData} from "../../Api/mes/customer";
import NumberPagenation from "../../Components/Pagenation/NumberPagenation";


const CurrentContainer = () => {

    const [list, setList] = useState<any[]>([]);
    const [titleEventList, setTitleEventList] = useState<any[]>([]);
    const [eventList, setEventList] = useState<any[]>([]);
    const [detailList, setDetailList] = useState<any[]>([]);
    const [contentsList, setContentsList] = useState<any[]>(['외주처명','대표자명'])
    const [option, setOption] = useState<number>(0)
    const [searchValue, setSearchValue] = useState<any>('')
    const [index, setIndex] = useState({ name: '외주처' });
    const [subIndex, setSubIndex] = useState({ writer: '작성자' })
    const [deletePk, setDeletePk] = useState<({keys: string[]})>({keys: []});
    const [selectPk, setSelectPk] = useState<any>(null);
    const [selectMold, setSelectMold] = useState<any>(null);
    const [selectValue, setSelectValue] = useState<any>(null);
    const [page, setPage] = useState<PaginationInfo>({
        current: 1,
    });
    const history = useHistory();

    const indexList = {
        current: {
            name: '외주처 명',
            telephone: '전화 번호',
            fax: '팩스 번호',
            ceo_name: '대표자 명',
            registered: '등록 날짜',
            /* safety_stock: '안전재고' */
        }
    }

    const detailTitle = {
        current: {
            writer: '작성자',
            sortation: '구분',
            stock_quantity: '수량',
            before_quantity: '변경전 재고량',
            date: '날짜',
        },
    }

    const allCheckOnClick = useCallback((list)=>{
        let tmpPk: string[] = []
        {list.length === 0 ?
            deletePk.keys.map((v,i)=>{
                deletePk.keys.pop()
            })
            :
            list.map((v, i) => {
                tmpPk.push(v.pk)
                deletePk.keys.push(tmpPk.toString())
            })
        }
    },[deletePk])

    const checkOnClick = useCallback((Data) => {
        let IndexPk = deletePk.keys.indexOf(Data.pk)
        {deletePk.keys.indexOf(Data.pk) !== -1 ?
            deletePk.keys.splice(IndexPk,1)
            :
            deletePk.keys.push(Data.pk)
        }
    },[deletePk])

    const optionChange = useCallback(async (filter:number)=>{
        setOption(filter)
        const tempUrl = `${API_URLS['outsourcing'].list}?type=${(filter)}&keyword=${(searchValue)}&page=${page.current}`
        const res = await getCustomerData(tempUrl)

        setList(res.info_list)
        setPage({ current: res.current_page, total: res.total_page })
    },[option,searchValue])


    const searchChange = useCallback(async (search)=>{
        setSearchValue(search)

    },[searchValue])

    const searchOnClick = useCallback(async () => {

        const tempUrl = `${API_URLS['outsourcing'].list}?type=${option}&keyword=${(searchValue)}&page=${page.current}`
        const res = await getCustomerData(tempUrl)

        setList(res.info_list)
        setPage({ current: res.current_page, total: res.total_page })

    },[searchValue,option])

    const onClick = useCallback((mold) => {
        console.log('dsfewfewf', mold.pk, mold.mold_name);
        if (mold.pk === selectPk) {
            setSelectPk(null);
            setSelectMold(null);
            setSelectValue(null);
        } else {
            setSelectPk(mold.pk);
            setSelectMold(mold.mold_name);
            setSelectValue(mold)
            //TODO: api 요청
            // getData(mold.pk)
        }



    }, [list, selectPk]);

    const eventdummy = [
        {
            Name: '수정',
            Width: 60,
            Color: 'white',
            Link: (v)=>history.push(`/outsourcing/register/${v.pk}`)
        },

    ]

    const titleeventdummy = [
        {
            Name: '등록하기',
            Width: 90,
            Link: ()=>history.push('/outsourcing/register')
        },
        {
            Name: '삭제',
            Link: () => postDelete()
        }
    ]

    // const getData = useCallback(async (pk) => {
    //     //TODO: 성공시
    //     const tempUrl = `${API_URLS['mold'].load}?pk=${pk}`
    //     const res = await getMoldData(tempUrl)
    //
    //     setDetailList(res)
    //
    // }, [detailList])
    const postDelete = useCallback(async () => {
        const tempUrl = `${API_URLS['outsourcing'].delete}`
        const res = await postOutsourcingDelete(tempUrl, deletePk)

        getList()
    },[deletePk])

    const getList = useCallback(async () => { // useCallback
        //TODO: 성공시
        const tempUrl = `${API_URLS['outsourcing'].list}?type=0&keyword=&page=${page.current}`
        const res = await getOutsourcingList(tempUrl)

        setList(res.info_list)

    }, [list])

    useEffect(() => {
        getList()
        setIndex(indexList["current"])
       // setList(dummy)
        setEventList(eventdummy)
        setTitleEventList(titleeventdummy)
        setSubIndex(detailTitle['current'])
    }, [])

    return (
        <div>
            <OvertonTable
                title={'외주처 현황'}
                titleOnClickEvent={titleEventList}
                allCheckbox={true}
                allCheckOnClickEvent={allCheckOnClick}
                dropDown={true}
                dropDownContents={contentsList}
                dropDownOption={option}
                dropDownOnClick={optionChange}
                searchBar={true}
                searchBarChange={searchChange}
                searchButtonOnClick={searchOnClick}
                indexList={index}
                valueList={list}
                EventList={eventList}
                checkBox={true}
                checkOnClickEvent={checkOnClick}
                /* clickValue={selectValue} */
                noChildren={true}
                mainOnClickEvent={onClick}>
            </OvertonTable>
            <NumberPagenation stock={page.total ? page.total : 0} selected={page.current} onClickEvent={(i: number) => setPage({...page, current: i})}/>
        </div>
    );
}

const Line = Styled.hr`
    margin: 10px 20px 12px 0px;
    border-color: #353b48;
    height: 1px;
    background-color: #353b48;
`

export default CurrentContainer
