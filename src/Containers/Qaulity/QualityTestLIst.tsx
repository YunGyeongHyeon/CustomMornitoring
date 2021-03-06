import React, {useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {API_URLS, getQualityList, postQualityRegister} from "../../Api/mes/quality";
import {transferCodeToName} from "../../Common/codeTransferFunctions";
import OvertonTable from "../../Components/Table/OvertonTable";
import LineTable from "../../Components/Table/LineTable";
import Styled from "styled-components";
import NumberPagenation from '../../Components/Pagenation/NumberPagenation';
import Notiflix from "notiflix";

Notiflix.Loading.Init({svgColor: "#1cb9df",});

const QualityTestList = () => {
    const [list, setList] = useState<any[]>([]);
    const [titleEventList, setTitleEventList] = useState<any[]>([]);
    const [eventList, setEventList] = useState<any[]>([]);
    const [detailList, setDetailList] = useState<any[]>([]);
    const [index, setIndex] = useState({process_name: "공정명"});
    const [subIndex, setSubIndex] = useState({worker: '작업자'})
    const [filter, setFilter] = useState(-1)
    const [isFirst, setIsFirst] = useState<boolean>(false)
    const [selectPk, setSelectPk] = useState<any>(null);
    const [selectMold, setSelectMold] = useState<any>(null);
    const [selectValue, setSelectValue] = useState<any>(null);
    const [page, setPage] = useState<PaginationInfo>({
        current: 1,
    });
    const history = useHistory()

    const indexList = {
        request: {
            process_name: "공정명",
            machine_name: "기계명",
            material_name: "품목(품목명)",
            request_time: "요청 시간",
            statement: "상태",
            worker: '작업자',
            worker_pk: '작업자 ID'
        }
    }


    const detaildummy = [
        {
            worker: '홍길동',
            total_count: '99,999',
            defective_count: '91',
            description: ['요청 내용이 입력되어 있습니다. 요청 내용이 입력되어 있습니다.', '요청 내용이 입력되어 있습니다. 요청 내용이 입력되어 있습니다.', '요청 내용이 입력되어 있습니다. 요청 내용이 입력되어 있습니다.']
        },
    ]

    const eventdummy = [
        {
            Name: '입고',
            Width: 60,
            Color: 'white',
            Link: (v) => history.push(`/stock/warehousing/register/${v.pk}/${v.material_name}`)
        },
        {
            Name: '출고',
            Width: 60,
            Color: 'white',
            Link: (v) => history.push(`/stock/release/register/${v.pk}/${v.material_name}`)
        },
    ]

    const titleeventdummy = [
        {
            Name: '등록하기',
            Width: 90,
            Link: () => history.push('/manageStock/register')
        },
        {
            Name: '삭제',
        }
    ]

    const onClick = useCallback((obj) => {
        history.push(`/quality/test/detail/inspection/${obj.request_pk}`)
    }, []);


    // const getData = useCallback( async(pk)=>{
    //     //TODO: 성공시
    //     const tempUrl = `${API_URLS['mold'].load}?pk=${pk}`
    //     const res = await getMoldData(tempUrl)
    //
    //     setDetailList(res)
    //
    // },[detailList])

    const getList = useCallback(async () => { // useCallback
        //TODO: 성공시
        Notiflix.Loading.Circle();
        const tempUrl = `${API_URLS['response'].requestList}?page=${page.current}&limit=15`
        const res = await getQualityList(tempUrl)
        if (res) {
            setList(res.info_list)
            setIsFirst(true)
            setPage({current: res.current_page, total: res.total_page})
            Notiflix.Loading.Remove()
        }
    }, [list, page])

    useEffect(() => {
        getList()
        setIndex(indexList["request"])
        // setList(dummy)
        setDetailList(detaildummy)
        setEventList(eventdummy)
        setTitleEventList(titleeventdummy)
    }, [])

    useEffect(() => {
        if (isFirst) {
            getList()
        }
    }, [page.current])

    return (
        <div>
            <OvertonTable
                title={'제품 검사 요청 리스트'}
                indexList={index}
                valueList={list}
                mainOnClickEvent={onClick}
                currentPage={page.current}
                totalPage={page.total}
                pageOnClickEvent={(event, i) => setPage({...page, current: i})}
                noChildren={true}>
                {
                    selectPk !== null ?
                        <LineTable title={'상세보기'} contentTitle={subIndex} contentList={detailList}>
                            <Line/>
                        </LineTable>
                        :
                        null
                }
            </OvertonTable>
        </div>
    )
}

const Line = Styled.hr`
    margin: 10px 20px 12px 0px;
    border-color: #353b48;
    height: 1px;
    background-color: #353b48;
`


export default QualityTestList
