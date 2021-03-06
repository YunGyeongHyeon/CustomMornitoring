import React, {useCallback, useEffect, useState,} from 'react'
import Styled from 'styled-components'
import OvertonTable from '../../Components/Table/OvertonTable'
import LineTable from '../../Components/Table/LineTable'
import {API_URLS, getMoldList, postMoldRegister, postMoldState} from '../../Api/mes/manageMold'
import NumberPagenation from '../../Components/Pagenation/NumberPagenation'
import {useHistory} from 'react-router-dom'
import {postCustomerDelete} from '../../Api/mes/customer'
import Notiflix from "notiflix";

Notiflix.Loading.Init({svgColor: "#1cb9df",});

const MoldRepairCompleteListContainer = () => {

    const history = useHistory()
    const [list, setList] = useState<any[]>([])
    const [titleEventList, setTitleEventList] = useState<any[]>([])
    const [eventList, setEventList] = useState<any[]>([])
    const [detailList, setDetailList] = useState<any[]>([])
    const [index, setIndex] = useState({mold_name: '금형 이름'})
    const [isFirst, setIsFirst] = useState<boolean>(false)
    const [deletePk, setDeletePk] = useState<({ pk: string[] })>({pk: []})
    const [subIndex, setSubIndex] = useState({part_name: '부품명'})
    const [selectPk, setSelectPk] = useState<any>(null)
    const [selectMold, setSelectMold] = useState<any>(null)
    const [selectValue, setSelectValue] = useState<any>(null)
    const [page, setPage] = useState<PaginationInfo>({
        current: 1,
    })


    const arrayDelete = () => {
        while (true) {
            deletePk.pk.pop()
            if (deletePk.pk.length === 0) {
                break
            }
        }
    }

    const allCheckOnClick = useCallback((list) => {
        let tmpPk: string[] = []

        {
            list.length === 0 ?
                arrayDelete()
                :
                list.map((v, i) => {
                    arrayDelete()

                    if (deletePk.pk.indexOf(v.pk) === -1) {
                        tmpPk.push(v.pk)
                    }

                    tmpPk.map((vi, index) => {
                        if (deletePk.pk.indexOf(v.pk) === -1) {
                            deletePk.pk.push(vi)
                        }
                    })

                    if (tmpPk.length < deletePk.pk.length) {
                        deletePk.pk.shift()
                    }

                })
        }
    }, [deletePk])

    const checkOnClick = useCallback((Data) => {
        let IndexPk = deletePk.pk.indexOf(Data.pk)
        {
            deletePk.pk.indexOf(Data.pk) !== -1 ?
                deletePk.pk.splice(IndexPk, 1)
                :
                deletePk.pk.push(Data.pk)
        }
    }, [deletePk])


    const indexList = {
        repair: {
            mold_name: '금형 명',
            manager_name: '수리 담당자',
            complete_date: '완료 예정 날짜',
            registered: '수리 등록 날짜',
            status: '상태',
        }
    }


    const detailTitle = {
        repair: {
            part_name: '부품명',
            repair_content: '수리 내용',
            repair_status: '수리 상태',
            complete_date: '완료 날짜',
        },
    }


    const titleeventdummy = [
        {
            Name: '삭제',
            Link: () => postDelete()
        }
    ]

    const postDelete = useCallback(async () => {
        if (deletePk.pk.length <= 0) {
            alert('삭제하실 항목을 선택해 주세요.')
            return
        }
        const tempUrl = `${API_URLS['making'].delete}`
        const res = await postCustomerDelete(tempUrl, deletePk)

        arrayDelete()
        getList()
    }, [deletePk])

    const getList = useCallback(async () => { // useCallback
        //TODO: 성공시
        Notiflix.Loading.Circle();
        const tempUrl = `${API_URLS['repair'].completeList}?page=${page.current}&limit=15&keyword=&type=0`
        const res = await getMoldList(tempUrl)
        if (res) {
            const Detail = res.info_list.map((v, i) => {
                const status = v.status === 'WAIT' ? '진행중' : '완료'

                return {...v, status: status}
            })

            setList(Detail)
            setIsFirst(true)
            setPage({current: res.current_page, total: res.total_page})
            Notiflix.Loading.Remove()
        }
    }, [list, page])

    useEffect(() => {
        if (isFirst) {
            getList()
        }
    }, [page.current])

    useEffect(() => {
        getList()
        setIndex(indexList['repair'])
        // setList(dummy)
        setTitleEventList(titleeventdummy)
    }, [])

    return (
        <div>
            <OvertonTable
                title={'금형 수리 완료'}
                indexList={index}
                valueList={list}
                clickValue={selectValue}
                currentPage={page.current}
                totalPage={page.total}
                pageOnClickEvent={(event, i) => setPage({...page, current: i})}
                noChildren={true}>
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
    )
}

const Line = Styled.hr`
    margin: 10px 20px 12px 0px;
    border-color: #353b48;
    height: 1px;
    background-color: #353b48;
`

export default MoldRepairCompleteListContainer
