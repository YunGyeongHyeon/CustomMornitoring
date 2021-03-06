import React, {useCallback, useEffect, useState,} from 'react'
import Styled from 'styled-components'
import OvertonTable from '../../Components/Table/OvertonTable'
import LineTable from '../../Components/Table/LineTable'
import {useHistory} from 'react-router-dom'
import {API_URLS, getStockList} from '../../Api/mes/manageStock'
import {transferCodeToName} from '../../Common/codeTransferFunctions'
import Notiflix from 'notiflix'

Notiflix.Loading.Init({svgColor: '#1cb9df',})

const regExp = /[\{\}\[\]\?.,;:|\)*~`!^\_+<>@\#$%&\\\=\(\'\"]/gi
const FinishMaterialContainer = () => {

  const [list, setList] = useState<any[]>([])
  const [titleEventList, setTitleEventList] = useState<any[]>([])
  const [eventList, setEventList] = useState<any[]>([])
  const [detailList, setDetailList] = useState<any[]>([])
  const [index, setIndex] = useState({material_name: '품목(품목명)'})
  const [subIndex, setSubIndex] = useState({registerer: '작성자'})
  const [isFirst, setIsFirst] = useState<boolean>(false)
  const [contentsList, setContentsList] = useState<any[]>(['품목명', '품번', '보관장소'])
  const [filter, setFilter] = useState(30)
  const [selectPk, setSelectPk] = useState<any>(null)
  const [selectMold, setSelectMold] = useState<any>(null)
  const [selectValue, setSelectValue] = useState<any>(null)
  const [keyword, setKeyword] = useState<string>('')
  const [saveKeyword, setSaveKeyword] = useState<string>('')
  const [option, setOption] = useState<number>(0)
  const [page, setPage] = useState<PaginationInfo>({
    current: 1,
  })
  const [detailPage, setDetailPage] = useState<PaginationInfo>({
    current: 1,
  })
  const history = useHistory()

  const indexList = {
    quality: {
      material_name: '품목(품목명)',
      material_code: '품번',
      material_type: '자재 종류',
      current_stock: '재고량',
      location_name: '보관장소',
      safe_stock: '안전재고',
    }
  }


  const detailTitle = {
    quality: {
      registerer: '작성자',
      type: '구분',
      amount: '수량',
      before_amount: '변경전 재고량',
      date: '입/출고 날짜',
      registered: '등록일자'
    },
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
      buttonWidth: 60,
      Width: '60%',
      Color: 'white',
      Link: (v) => history.push(`/stock/warehousing/register/${v.pk}/${encodeURIComponent(v.material_name)}`)
    },
    {
      Name: '출고',
      buttonWidth: 60,
      Width: '60%',
      Color: 'white',
      Link: (v) => {
        if (Number(v.current_stock.split(',').join('')) > 0) {
          history.push(`/stock/release/register/${v.pk}/${encodeURIComponent(v.material_name)}`)
        } else {
          alert('출고할 수 있는 재고가 없습니다.')
        }
      }
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


  const onClick = useCallback((mold) => {
    setDetailPage({...detailPage, current: 1})
    if (mold.pk === selectPk) {
      setSelectPk(null)
      setSelectMold(null)
      setSelectValue(null)
    } else {
      setSelectPk(mold.pk)
      setSelectMold(mold.mold_name)
      setSelectValue(mold)
      //TODO: api 요청
      getData(mold.pk)
    }


  }, [list, selectPk])

  const AddComma = (num) => {
    let tmpNum = num.toString().split('.')
    let regexp = /\B(?=(\d{3})+(?!\d))/g
    return tmpNum[0].replace(regexp, ',') + (tmpNum[1] ? `.${tmpNum[1]}` : '')
  }

  const getData = useCallback(async (pk) => {
    Notiflix.Loading.Circle()

    //TODO: 성공시
    if (pk === null) {
      return
    }
    const tempUrl = `${API_URLS['stock'].loadDetail}?pk=${pk}&page=${detailPage.current}&limit=6`
    const res = await getStockList(tempUrl)
    if (res) {
      const getStock = res.info_list.map((v, i) => {
        const amount = AddComma(v.amount)
        const before_amount = AddComma(v.before_amount)

        return {...v, amount: amount, before_amount: before_amount,}
      })

      setDetailList(getStock)

      setDetailPage({current: res.current_page, total: res.total_page})
    }
    Notiflix.Loading.Remove()

  }, [detailList, detailPage])

  const getList = useCallback(async (isSearch?: boolean, searchOption?: number) => { // useCallback
    //TODO: 성공시
    Notiflix.Loading.Circle()
    const tempUrl = `${API_URLS['stock'].list}?type=30&filter=${filter}&page=${isSearch ? 1 : page.current}&limit=5&keyword=${searchOption !== undefined ? '' : saveKeyword}&st=${searchOption ? searchOption : option}`
    const res = await getStockList(tempUrl)
    if (res) {
      const getStock = res.info_list.map((v, i) => {
        const material_type = transferCodeToName('material', v.material_type)
        const safe_stock = AddComma(v.safe_stock)
        const current_stock = AddComma(v.current_stock)
        return {...v, material_type: material_type, safe_stock: safe_stock, current_stock: current_stock}
      })
      setIsFirst(true)
      setSelectPk(null)
      setList(getStock)
      setPage({current: res.current_page, total: res.total_page})
      Notiflix.Loading.Remove()
    }
  }, [list, page, keyword, saveKeyword])

  useEffect(() => {
    setDetailPage({...detailPage, current: 1})
    if (isFirst) {
      getList()
    }
  }, [page.current])

  useEffect(() => {
    if (selectPk !== null) {
      getData(selectPk)
    }
  }, [detailPage.current])

  useEffect(() => {
    getList()
    setIndex(indexList['quality'])
    // setList(dummy)
    setDetailList(detaildummy)
    setEventList(eventdummy)
    setTitleEventList(titleeventdummy)
    setSubIndex(detailTitle['quality'])
  }, [])

  useEffect(() => {
    if (isFirst) {
      getList(true)
    }
  }, [saveKeyword])

  const optionChange = useCallback(async (filter: number) => {
    setOption(filter)
    getList(true, filter)
    setKeyword('')
    setSaveKeyword('')
  }, [option, keyword, page, saveKeyword])

  return (
    <div>
      <OvertonTable
        title={'완제품 관리'}
        indexList={index}
        valueList={list}
        clickValue={selectValue}
        EventList={eventList}
        dropDownContents={contentsList}
        dropDownOnClick={optionChange}
        dropDownOption={option}
        searchValue={keyword}
        searchBarChange={(e) => {
          if (!e.match(regExp)) setKeyword(e)
        }}
        searchButtonOnClick={() => setSaveKeyword(keyword)}
        currentPage={page.current}
        totalPage={page.total}
        mainOnClickEvent={onClick}
        pageOnClickEvent={(event, i) => setPage({...page, current: i})}
      >
        {
          selectPk !== null ?
            <LineTable title={'상세보기'} contentTitle={subIndex} contentList={detailList}
                       currentPage={detailPage.current}
                       totalPage={detailPage.total}
                       pageOnClickEvent={(event, i) => setDetailPage({...detailPage, current: i})}>
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

export default FinishMaterialContainer
