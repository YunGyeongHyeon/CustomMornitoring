import React, {useCallback, useEffect, useState,} from "react";
import Styled from "styled-components";
import OvertonTable from "../../Components/Table/OvertonTable";
import LineTable from "../../Components/Table/LineTable";
import {API_URLS, getMoldList} from "../../Api/mes/manageMold";


const RepairContainer = () => {

    const [list, setList] = useState<any[]>([]);
    const [titleEventList, setTitleEventList] = useState<any[]>([]);
    const [eventList, setEventList] = useState<any[]>([]);
    const [detailList,setDetailList] = useState<any[]>([]);
    const [index, setIndex] = useState({ mold_name: '금형 이름' });
    const [subIndex, setSubIndex] = useState({    manager: "작업자" })
    const [selectPk, setSelectPk ]= useState<any>(null);
    const [selectMold, setSelectMold ]= useState<any>(null);
    const [selectValue, setSelectValue ]= useState<any>(null);
    const [page, setPage] = useState<PaginationInfo>({
        current: 1,
    });

    const indexList = {
        repair: {
            mold_name: '금형 이름',
            manager: '수리 담당자',
            complete_date: '완료 예정 날짜',
            registered: '수리 등록 날짜',
            status: "상태"
        }
    }


    const detailTitle = {
        repair: {
            manager: "작업자",
            repair_content: '수리 내용',
            status: '상태',
            complete_date: '완료 날짜'
        },
    }

    const dummy = [
        {
            mold_name: '금형이름00',
            mold_location: '창고01',
            charge_name: '김담당',
            registered_date: '2020.07.07',
            complete_date: '2020.08.09',
            status: '완료'
        },
        {
            mold_name: '금형이름00',
            mold_location: '창고01',
            charge_name: '김담당',
            registered_date: '2020.07.07',
            complete_date: '2020.08.09',
            status: '완료'
        },
        {
            mold_name: '금형이름00',
            mold_location: '창고01',
            charge_name: '김담당',
            registered_date: '2020.07.07',
            complete_date: '2020.08.09',
            status: '완료'
        },
        {
            mold_name: '금형이름00',
            mold_location: '창고01',
            charge_name: '김담당',
            registered_date: '2020.07.07',
            complete_date: '2020.08.09',
            status: '완료'
        },
        {
            mold_name: '금형이름00',
            mold_location: '창고01',
            charge_name: '김담당',
            registered_date: '2020.07.07',
            complete_date: '2020.08.09',
            status: '완료'
        },
    ]

    const detaildummy = [
        {
            part_name: '부품명00',
            repair_content: '부품명00에 대한 수리내용은 본 내용과 같습니다.',
            repair_status: '완료',
            complete_date: '2020.08.09'
        },
    ]

    const eventdummy = [
        {
            Name: '입고',
            Width: 60,
            Color: 'white'
        },
        {
            Name: '출고',
            Width: 60,
            Color: 'white'
        },
    ]

    const titleeventdummy = [
        {
            Name: '삭제',
        }
    ]


    const onClick = useCallback((mold) => {
        console.log('dsfewfewf',mold.pk,mold.mold_name);
        if(mold.pk === selectPk){
            setSelectPk(null);
            setSelectMold(null);
            setSelectValue(null);
        }else{
            setSelectPk(mold.pk);
            setSelectMold(mold.mold_name);
            setSelectValue(mold)
            //TODO: api 요청
            getData(mold.pk)
        }



    }, [list, selectPk]);

    const getData = useCallback( async(pk)=>{
        //TODO: 성공시
        console.log(pk)
        const tempUrl = `${API_URLS['repair'].detail}?pk=${pk}`
        const res = await getMoldList(tempUrl)

        console.log([res])

        const Detail = [res].map((v,i)=>{
            const status = v.status === 'WAIT' ? "진행중" : "완료"

            return {...v, status: status}
        })

        setDetailList(Detail)

    },[detailList, selectPk])

    const getList = useCallback(async ()=>{ // useCallback
        //TODO: 성공시
        const tempUrl = `${API_URLS['repair'].completeList}?page=${page.current}&keyword=&type=0&limit=15`

        const res = await getMoldList(tempUrl)

        setList(res.info_list)

        setPage({ current: res.current_page, total: res.total_page })
    },[list,page])

    useEffect(()=>{
        getList()
    },[page.current])

    useEffect(()=>{
        getList()
        setIndex(indexList["repair"])
        // setList(dummy)
        setDetailList(detaildummy)
        setEventList(eventdummy)
        setTitleEventList(titleeventdummy)
        setSubIndex(detailTitle['repair'])
    },[])

    return (
        <div>
            <OvertonTable
                title={'금형 수리 완료'}
                indexList={index}
                valueList={list}
                clickValue={selectValue}
                currentPage={page.current}
                totalPage={page.total}
                pageOnClickEvent={(i: number) => setPage({...page, current: i}) }
                mainOnClickEvent={onClick}
                noChildren={true}
            >
                {
                    selectPk !== null ?
                        <LineTable title={'수리 현황'} contentTitle={subIndex} contentList={detailList}>
                            <Line/>
                        </LineTable>
                        :
                        null
                }
            </OvertonTable>
        </div>
    );
}

const Line = Styled.hr`
    margin: 10px 20px 12px 0px;
    border-color: #353b48;
    height: 1px;
    background-color: #353b48;
`

export default RepairContainer
