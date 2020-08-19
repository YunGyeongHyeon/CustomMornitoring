import React, {
    useEffect,
    useState,
    useContext,
    useCallback,
    ReactElement,
} from "react";
import Styled from "styled-components";
import DashboardWrapContainer from "../DashboardWrapContainer";
import SubNavigation from "../../Components/Navigation/SubNavigation";
import { ROUTER_MENU_LIST } from "../../Common/routerset";
import InnerBodyContainer from "../InnerBodyContainer";
import Header from "../../Components/Text/Header";
import ReactShadowScroll from "react-shadow-scroll";
import OvertonTable from "../../Components/Table/OvertonTable";
import LineTable from "../../Components/Table/LineTable";
import {getRequest} from "../../Common/requestFunctions";
import {getToken} from "../../Common/tokenFunctions";
import {TOKEN_NAME} from "../../Common/configset";
import {API_URLS, getCluchData, getMoldData,} from "../../Api/pm/preservation";



const ScheduleContainer = () => {

    const [list, setList] = useState<any[]>([]);
    const [titleEventList, setTitleEventList] = useState<any[]>([]);
    const [eventList, setEventList] = useState<any[]>([]);
    const [detailList,setDetailList] = useState<any[]>([]);
    const [index, setIndex] = useState({manager_name:'계획자명'});
    const [selectPk, setSelectPk ]= useState<any>(null);
    const [selectMold, setSelectMold ]= useState<any>(null);
    const [selectValue, setSelectValue ]= useState<any>(null);

    const indexList = {
        schedule: {
            manager_name: '계획자',
            material_name: '품목(품목명)',
            schedule: '일정',
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
        {
            Name: '수정',
        },
        {
            Name: '취소',
        }
    ]

    const eventdummy = [
        {
            Name: '전표 이력',
        },
        {
            Name: '작업자 이력',
        }
    ]

    const detaildummy = [
        {
            pk: 'PK1',
            max_count: 100,
            current_count: 20
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

    const getData = useCallback( async(pk)=>{
        //TODO: 성공시
        const tempUrl = `${API_URLS['mold'].load}?pk=${pk}`
        const res = await getMoldData(tempUrl)

        setDetailList(res)

    },[detailList])

    const getList = useCallback(async ()=>{ // useCallback
        //TODO: 성공시
        const tempUrl = `${API_URLS['mold'].list}`
        const res = await getMoldData(tempUrl)

        setList(res)

    },[list])

    useEffect(()=>{
        // getList()
        setIndex(indexList["schedule"])
        setList(dummy)
        setTitleEventList(titleeventdummy)
        setEventList(eventdummy)
        setDetailList(detaildummy)
    },[])

    return (
        <div>
            <OvertonTable
                title={'생산 계획 관리 리스트'}
                calendar={true}
                titleOnClickEvent={titleEventList}
                indexList={index}
                valueList={list}
                clickValue={selectValue}
                EventList={eventList}
                checkBox={true}
                noChildren={true}
                mainOnClickEvent={onClick}>
            </OvertonTable>
        </div>
    );
}


export default ScheduleContainer;