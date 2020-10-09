import React, {useCallback, useEffect, useState,} from "react";
import OvertonTable from "../../Components/Table/OvertonTable";
import {API_URLS, getProjectList, postProjectDelete} from "../../Api/mes/production";
import NumberPagenation from '../../Components/Pagenation/NumberPagenation'
import moment from "moment";
import {useHistory} from "react-router-dom";


const ScheduleManageContainer = () => {
    const [page, setPage] = useState<PaginationInfo>({
        current: 1,
    });

    const [list, setList] = useState<any[]>([]);
    const [titleEventList, setTitleEventList] = useState<any[]>([]);
    const [eventList, setEventList] = useState<any[]>([]);
    const [deletePk, setDeletePk] = useState<({keys: string[]})>({keys: []});
    const [index, setIndex] = useState({manager_name:'계획자명'});
    const [selectValue, setSelectValue ]= useState<any>(null);
    const [selectDate, setSelectDate] = useState({start: moment().format("YYYY-MM-DD"), end: moment().format("YYYY-MM-DD")})
    const [selectPk, setSelectPk ]= useState<any>(null);
    const [selectMold, setSelectMold ]= useState<any>(null);
    const history = useHistory();

    const indexList = {
        scheduleManage: {
            manager_name: '계획자',
            material_name: '품목(품목명)',
            // schedule: '일정', 잘려서 뺌
            amount: '총 수량',
            current_amount: '현재 수량',
        }
    }

    const dummy = [
        {
            manager_name: '홍길동',
            material_name: '품목(품목명)',
            schedule: '2000.00.00~2000.00.00',
            amount: '99,999,999',
            current_amount: '1,000,000',
        },
        {
            manager_name: '계획자',
            material_name: '품목(품목명)',
            schedule: '일정',
            amount: '총 수량',
            current_amount: '현재 수량',
        },
        {
            manager_name: '계획자',
            material_name: '품목(품목명)',
            schedule: '일정',
            amount: '총 수량',
            current_amount: '현재 수량',
        },
        {
            manager_name: '계획자',
            material_name: '품목(품목명)',
            schedule: '일정',
            amount: '총 수량',
            current_amount: '현재 수량',
        },
        {
            manager_name: '계획자',
            material_name: '품목(품목명)',
            schedule: '일정',
            amount: '총 수량',
            current_amount: '현재 수량',
        },
    ]

    const titleeventdummy = [
        // {
        //     Name: '수정',
        // },
        {
            Name: '삭제',
            Link: () => postDelete()
        }
    ]

    const eventdummy = [
        {
            Name: '전표 이력',
            Link: (v)=>history.push(`/project/voucher/list/${v.pk}`)
        },
        {
            Name: '작업자 이력',
            Link: (v)=>history.push(`/project/work/history/${v.pk}`)
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
            // getData(mold.pk)
        }



    }, [list, selectPk]);

    const checkOnClick = useCallback((Data) => {
        let IndexPk = deletePk.keys.indexOf(Data.pk)
        {deletePk.keys.indexOf(Data.pk) !== -1 ?
            deletePk.keys.splice(IndexPk,1)
            :
            deletePk.keys.push(Data.pk)
        }
    },[deletePk])


    const calendarOnClick = useCallback(async (start, end)=>{
        setSelectDate({start: start, end: end ? end : ''})

        const tempUrl = `${API_URLS['production'].list}?from=${start}&to=${end}&page=${page.current}&limit=15`
        const res = await getProjectList(tempUrl)
        const getScheduleMange = res.info_list.map((v,i)=>{

            const amount = v.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            const current_amount = v.current_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            return {...v, amount: amount, current_amount: current_amount}
        })

        setPage({ current: res.current_page, total: res.total_page })

        setList(getScheduleMange)
    },[selectDate,page])

    const getList = useCallback(async ()=>{ // useCallback
        //TODO: 성공시

        const tempUrl = `${API_URLS['production'].list}?from=${selectDate.start}&to=${selectDate.end}&page=${page.current}&limit=15`

        const res = await getProjectList(tempUrl)

        const getScheduleMange = res.info_list.map((v,i)=>{

            const amount = v.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            const current_amount = v.current_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            return {...v, amount: amount, current_amount: current_amount}
        })

        setPage({ current: res.current_page, total: res.total_page })

        setList(getScheduleMange)

    },[list,page])

    const postDelete = useCallback(async () => {
        const tempUrl = `${API_URLS['production'].delete}`
        const res = await postProjectDelete(tempUrl, deletePk)
        console.log(res)

    },[deletePk])

    useEffect(()=>{
        getList()
    },[page.current])


    useEffect(()=>{
        getList()
        setIndex(indexList["scheduleManage"])
        // setList(dummy)
        setTitleEventList(titleeventdummy)
        setEventList(eventdummy)
    },[])

    return (
        <div>
            <OvertonTable
                title={'생산 계획 관리 리스트'}
                selectDate={selectDate}
                calendarOnClick={calendarOnClick}
                titleOnClickEvent={titleEventList}
                indexList={index}
                valueList={list}
                clickValue={selectValue}
                EventList={eventList}
                checkOnClickEvent={checkOnClick}
                currentPage={page.current}
                totalPage={page.total}
                pageOnClickEvent={(i: number) => setPage({...page, current: i}) }
                noChildren={true}>
            </OvertonTable>
        </div>
    );
}


export default ScheduleManageContainer;
