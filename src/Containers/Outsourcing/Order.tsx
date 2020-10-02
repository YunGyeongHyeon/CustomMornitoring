import React, {useCallback, useEffect, useState,} from "react";
import Styled from "styled-components";
import OvertonTable from "../../Components/Table/OvertonTable";
import LineTable from "../../Components/Table/LineTable";
import {API_URLS, getOutsourcingList, postOutsourcingDelete, postOutsourcingList} from "../../Api/mes/outsourcing";
import {useHistory} from "react-router-dom";
import {getCustomerData} from "../../Api/mes/customer";
import NumberPagenation from "../../Components/Pagenation/NumberPagenation";


const OrderContainer = () => {

    const [list, setList] = useState<any[]>([]);
    const [detailEventList, setDetaileventList] = useState<any[]>([])
    const [titleEventList, setTitleEventList] = useState<any[]>([]);
    const [eventList, setEventList] = useState<any[]>([]);
    const [detailList, setDetailList] = useState<any[]>([]);
    const [contentsList, setContentsList] = useState<any[]>(['거래처명','제품명'])
    const [option, setOption] = useState<number>(0)
    const [searchValue, setSearchValue] = useState<any>('')
    const [index, setIndex] = useState({ name: '외주처' });
    const [subIndex, setSubIndex] = useState({ manager: '작성자' })
    const [deletePk, setDeletePk] = useState<({keys: string[]})>({keys: []});
    const [selectPk, setSelectPk] = useState<any>(null);
    const [selectMaterial, setSelectMaterial] = useState<any>(null);
    const [selectValue, setSelectValue] = useState<any>(null);
    const [page, setPage] = useState<PaginationInfo>({
        current: 1,
    });
    const history = useHistory();

    const indexList = {
        order: {
            name: '외주처 명',
            material_name: '제품 명',
            quantity: '수량',
            unpaid_quantity: '미납 수량',
            ceo_name: '대표자 명',
            registered: '등록 날짜',
        }
    }


    const detailTitle = {
        order: {
            manager: '작성자',
            due_date: '납기일',
            address: '회사 주소',
            payment_condition: '대금 지급 조건',
            status: '상태',
        },
    }


    const detaildummy = [
        {
            writer: '김담당',
            delivery_date: '2020.08.09',
            address: '회사시 회사구 회사동 123-456 A동 01',
            payment_condition: '납품 후 100일 내 잔금',
            statement: '대기중',
        },
    ]

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
        const tempUrl = `${API_URLS['order'].list}?keyword=${searchValue}&type=${filter}&page=${page.current}`
        const res = await getCustomerData(tempUrl)

        setList(res.info_list)
        setPage({ current: res.current_page, total: res.total_page })
    },[option,searchValue])


    const searchChange = useCallback(async (search)=>{
        setSearchValue(search)

    },[searchValue])

    const searchOnClick = useCallback(async () => {

        const tempUrl = `${API_URLS['order'].list}?keyword=${searchValue}&type=${option}&page=${page.current}`
        const res = await getCustomerData(tempUrl)

        setList(res.info_list)
        setPage({ current: res.current_page, total: res.total_page })

    },[searchValue,option])

    const onClick = useCallback((mold) => {
        console.log('dsfewfewf', mold.pk, mold.mold_name);
        if (mold.pk === selectPk) {
            setSelectPk(null);
            setSelectMaterial(null);
            setSelectValue(null);
        } else {
            setSelectPk(mold.pk);
            setSelectMaterial(mold.name);
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
            Link: (v)=>history.push(`'/outsourcing/order/register/${v.pk}`)
        }
    ]

    const titleeventdummy = [
        {
            Name: '등록하기',
            Width: 90,
            Link: ()=>history.push('/outsourcing/order/register')
        },
        {
            Name: '삭제',
            Link: ()=>postDelete()
        }
    ]

    const detaileventdummy = [
        {
            Name: '완료하기',
            Width: 90,
        },
    ]

    const postDelete = useCallback(async () => {
        const tempUrl = `${API_URLS['order'].delete}`
        const res = await postOutsourcingDelete(tempUrl, deletePk)

        getList()
    },[deletePk])

    const getData = useCallback(async (pk) => {
        //TODO: 성공시
        const tempUrl = `${API_URLS['order'].load}`
        const res = await postOutsourcingList(tempUrl,pk)

        setDetailList(res)

    }, [detailList])

    const getList = useCallback(async () => { // useCallback
        //TODO: 성공시
        const tempUrl = `${API_URLS['order'].list}?keyword=${searchValue}&type=${option}&page=${page.current}`
        const res = await getOutsourcingList(tempUrl)

        setList(res.info_list)

    }, [list])

    useEffect(() => {
        getList()
        setIndex(indexList["order"])
        // setList(dummy)
        setDetailList(detaildummy)
        setEventList(eventdummy)
        setTitleEventList(titleeventdummy)
        setDetaileventList(detaileventdummy)
        setSubIndex(detailTitle['order'])
    }, [])

    return (
        <div>
            <OvertonTable
                title={'외주처 발주 리스트'}
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
                clickValue={selectValue}
                mainOnClickEvent={onClick}>
                {
                    selectPk !== null ?
                        <LineTable title={`${selectMaterial} 자세히 보기`} contentTitle={subIndex} contentList={detailList}>
                            <Line />
                        </LineTable>
                        :
                        null
                }
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

export default OrderContainer
