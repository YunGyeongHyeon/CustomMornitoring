import React, {useCallback, useEffect, useState,} from "react";
import Styled from "styled-components";
import OvertonTable from "../../Components/Table/OvertonTable";
import {API_URLS, getCustomerData, postCustomerDelete} from "../../Api/mes/customer";
import {useHistory} from "react-router-dom";
import {getRequest} from "../../Common/requestFunctions";
import {getToken} from "../../Common/tokenFunctions";
import {TOKEN_NAME} from "../../Common/configset";
import NumberPagenation from '../../Components/Pagenation/NumberPagenation'

const ClientContainer = () => {
    const [page, setPage] = useState<PaginationInfo>({
        current: 1,
    });

    const [list, setList] = useState<any[]>([]);
    const [eventList, setEventList] = useState<any[]>([]);
    const [index, setIndex] = useState({ name: "거래처 명" });
    const [titleEventList, setTitleEventList] = useState<any[]>([]);
    const [option, setOption] = useState<number>(0)
    const [contentsList, setContentsList] = useState<any[]>(['거래처명','대표자명'])
    const [searchValue, setSearchValue] = useState<any>('')
    const [deletePk, setDeletePk] = useState<({keys: string[]})>({keys: []});
    const history = useHistory();

    const indexList = {
        customer: {
            name: "거래처 명",
            telephone: "전화 번호",
            fax: "팩스 번호",
            ceo_name: "대표자",
            crn: "사업자 번호",
            registered: "등록 날짜",
        }
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
        const tempUrl = `${API_URLS['customer'].list}?keyword=${searchValue}&type=${(filter+1)}&page=${page.current}&limit=15`
        const res = await getCustomerData(tempUrl)

        setList(res.info_list)
        setPage({ current: res.current_page, total: res.total_page })
    },[option,searchValue,page])


    const searchChange = useCallback(async (search)=>{
        setSearchValue(search)

    },[searchValue])

    const searchOnClick = useCallback(async () => {

        const tempUrl = `${API_URLS['customer'].list}?keyword=${searchValue}&type=${(option+1)}&page=${page.current}&limit=15`
        const res = await getCustomerData(tempUrl)

        setList(res.info_list)
        setPage({ current: res.current_page, total: res.total_page })

    },[searchValue,option,page])

    const eventdummy = [
        {
            Name: '수정',
            Width: 60,
            Color: 'white',
            Link: (v)=>history.push(`/customer/register/${v.pk}`)
        },
    ]

    const titleeventdummy = [
        {
            Name: '등록하기',
            Width: 90,
            Link: ()=>history.push('/customer/register')
        },
        {
            Name: '삭제',
            Link: ()=> postDelete()
        }
    ]

    const postDelete = useCallback(async () => {
        const tempUrl = `${API_URLS['customer'].delete}`
        const res = await postCustomerDelete(tempUrl, deletePk)

        getList()
    },[deletePk])

    const getList = useCallback(async ()=>{ // useCallback
        //TODO: 성공시

        const tempUrl = `${API_URLS['customer'].list}?keyword=${searchValue}&type=${option+1}&page=${page.current}&limit=15`
        const res = await getCustomerData(tempUrl)

        console.log('response', res)
        setList(res.info_list)
        setPage({ current: res.current_page, total: res.total_page })
    },[searchValue,option,list,page])


    useEffect(()=>{
        getList()
    },[page.current])

    useEffect(()=>{
        getList()
        setIndex(indexList["customer"])
        // setList(dummy)
        // setDetailList(detaildummy)
        setTitleEventList(titleeventdummy)
        setEventList(eventdummy)
    },[])


    return (
        <div>
            <OvertonTable
                title={'거래처 리스트'}
                titleOnClickEvent={titleEventList}
                dropDownContents={contentsList}
                dropDownOption={option}
                dropDownOnClick={optionChange}
                searchBarChange={searchChange}
                searchButtonOnClick={searchOnClick}
                allCheckOnClickEvent={allCheckOnClick}
                indexList={index}
                valueList={list}
                EventList={eventList}
                currentPage={page.current}
                totalPage={page.total}
                pageOnClickEvent={(i: number) => setPage({...page, current: i}) }
                checkOnClickEvent={checkOnClick}
                noChildren={true}>
            </OvertonTable>
        </div>
    );
}

const CountingContainer = Styled.div`
   display: flex;
   flex-direction: row;
   margin-right: 20px;
   p {
    font-size: 14px;
      &:first-child{
      font-family: NotoSansCJKkr-Bold;
      }
   }
`
const MoldArrowContainer = Styled.div`
  margin-top: 1px;
  margin-left: 85px;
  width: 870px;
  height: 20px;
  border: 0;
  border-radius: 25px;
`

const MoldMaxBar = Styled.div`
  margin-top: 1px;
  margin-left: 85px;
  width: 870px;
  height: 20px;
  border: 0;
  border-radius: 25px;
  background-color: #1b2333;
  div {
    height: 20px;
    border: 0;
    border-radius: 25px;
    background-color: #fd6b00;
  }
`

const CountingNum = Styled.p`
   margin-left: 85px;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   span {
      font-size: 14px;
   }
`

const BottomBox = Styled.div`
    display: inline-block;
    p {
        font-size: 20px;
         &:first-child{
            font-size: 40px;
            }
    }
`

export default ClientContainer;
