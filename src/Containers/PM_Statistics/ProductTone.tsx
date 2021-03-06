import React, {useCallback, useEffect, useState,} from 'react'
import Styled from 'styled-components'
import {API_URLS, getProductData, postProductData} from '../../Api/pm/statistics'
import HalfTalbe from '../../Components/Table/HalfTable'
import {API_URLS as MACHINE_URLS, getSearchMachine} from '../../Api/mes/process'
import moment from 'moment'
import OvertonTable from '../../Components/Table/OvertonTable'
import CalendarDropdown from '../../Components/Dropdown/CalendarDropdown'
import {transferCodeToName} from '../../Common/codeTransferFunctions'
import Notiflix from 'notiflix'
import {esES} from '@material-ui/core/locale'

Notiflix.Loading.Init({svgColor: '#1cb9df',})


const DummyMachine = [
  {
    pk: '',
    name: ''
  }
]

const ProductToneContainer = () => {

  const [list, setList] = useState<any[]>([])
  const [detailList, setDetailList] = useState<any[]>([])
  const [detailTonList, setDetailTonList] = useState<any[]>([])
  const [index, setIndex] = useState({material_name: '품목명'})
  const [subIndex, setSubIndex] = useState({low: '최저'})
  const [sub2Index, setSub2Index] = useState({ton: '톤'})
  const [machinePk, setMachinePk] = useState<string>('all')
  const [materialPage, setMaterialPage] = useState<PaginationInfo>({
    current: 1,
  })
  const [minPage, setMinPage] = useState<PaginationInfo>({
    current: 1,
  })
  const [tonPage, setTonPage] = useState<PaginationInfo>({
    current: 1,
  })
  const [selectPk, setSelectPk] = useState<any>(null)
  const [selectMachine, setSelectMachine] = useState<any>(null)
  const [selectValue, setSelectValue] = useState<any>(null)
  const [historyArr, setHistoryArr] = useState<string[]>([])

  const [machineList, setMachineList] = useState(DummyMachine)
  const [searchName, setSearchName] = useState<string>('')

  const [selectDate, setSelectDate] = useState(moment().subtract(1, 'days').format('YYYY-MM-DD'))
  const [page, setPage] = useState<PaginationInfo>({
    current: 1,
  })
  // const ref = useOnclickOutside(() => {
  //     setIsOpen(false);
  // });

  // const getMachineList = useCallback(async () => {
  //   const tempUrl = `${MACHINE_URLS['machine'].list}?keyword=${searchName}&page=${page.current}&limit=1000`
  //   const resultData = await getSearchMachine(tempUrl)
  //   setMachineList(resultData.info_list)
  //   console.log(resultData.info_list)
  // }, [searchName])
  //
  // useEffect(() => {
  //   getMachineList()
  // }, [])

  const indexList = {
    productTone: {
      material_name: '품목명',
      material_code: '품번',
      location_name: '기본 위치',
    }
  }

  const subIndexList = {
    productTone: {
      low: '최저',
      high: '최고',
      avg: '평균',
    }
  }

  const sub2IndexList = {
    productTone: {
      ton: '톤',
      date: '날짜',
      machine_name: '기계명'
    }
  }

  const onClick = useCallback((product, index) => {
    setTonPage({...tonPage, current: 1})
    if (selectPk === index) {
      setSelectPk(null)
      setSelectMachine(null)
      setSelectValue(null)
      setHistoryArr([])
    } else {
      setSelectPk(index)
      setSelectMachine(product.mold_name)
      setSelectValue(product)
      setHistoryArr([...product.histories])
      // TODO: api 요청
      // getData(product.mold_pk, product.process_pk, product.product_pk)
    }

  }, [list, selectPk])

  const getData = async (mold, process, product) => {
    //TODO: 성공시
    const tempUrl = `${API_URLS['product'].load}?mold_pk=${mold}&product_pk=${product}&process_pk=${process}&date=${selectDate}&page=${tonPage.current}&limit=15`
    const res = await getProductData(tempUrl)

    if (res) {
      const getTonDetail = {
        avg: res.avg ? res.avg.toFixed(1) : 0,
        current_page: res.current_page,
        high: res.high,
        info_list: res.info_list,
        low: res.low,
        total_number: res.total_number,
        total_page: res.total_page,
      }

      setDetailList(!res.low ? [] : [getTonDetail])
      setTonPage({current: res.current_page, total: res.total_page})
      setDetailTonList(res.info_list)
    }
  }

  const getDataPaginatoin = async () => {
    //TODO: 성공시
    if (selectValue !== null && selectValue.mold_pk !== null && selectValue.product_pk !== null && selectValue.process_pk !== null) {
      Notiflix.Loading.Circle()
      const tempUrl = `${API_URLS['product'].load}?filter=${machinePk}&date=${selectDate}&page=${tonPage.current}&limit=15`
      const res = await postProductData(tempUrl, {histories: historyArr})
      if (res) {
        const getTonDetail = {
          avg: res.avg ? res.avg.toFixed(1) : 0,
          current_page: res.current_page,
          high: res.max,
          info_list: res.info_list,
          low: res.min,
          total_number: res.total_number,
          total_page: res.total_page,
        }


        setDetailList([getTonDetail])
        setTonPage({current: res.current_page, total: res.total_page})
        setDetailTonList(res.info_list)
        Notiflix.Loading.Remove()
      }
    }
  }

  const getList = useCallback(async (pk) => { // useCallback
    //TODO: 성공시
    Notiflix.Loading.Circle()
    const tempUrl = `${API_URLS['product'].list}?filter=${pk}&page=${materialPage.current}&limit=15&date=${selectDate}`
    const res = await getProductData(tempUrl)
    if (res) {
      setList(res.info_list)
      console.log(res)

      setMachineList([...res.machines])

      setMaterialPage({current: res.current_page, total: res.total_page})
      Notiflix.Loading.Remove()
    }
  }, [machinePk, materialPage, selectDate])

  useEffect(() => {
    // getList()
    setIndex(indexList['productTone'])
    setSubIndex(subIndexList['productTone'])
    setSub2Index(sub2IndexList['productTone'])
    // setList(dummy)
    // setDetailList(detaildummy)
  }, [])

  useEffect(() => {
    getList(machinePk)
  }, [materialPage.current, selectDate])

  useEffect(() => {
    if (selectValue) {
      getDataPaginatoin()
    }
  }, [tonPage.current, selectDate, selectValue, machinePk])

  useEffect(() => {
    setDetailList([])
    setDetailTonList([])
  }, [selectValue])

  return (
    <div>
      <div style={{width: '1107px', height: 30, marginTop: 41, borderRadius: 10, display: 'flex'}}>
        <div style={{marginLeft: '65%'}}>
          <CalendarDropdown type={'single'} select={selectDate}
                            onClickEvent={(i) => {
                              setTonPage({...tonPage, current: 1})
                              setSelectDate(i)
                            }}/>
        </div>
        <div style={{display: 'flex', marginLeft: 20}}>
          <p style={{marginRight: 10, marginBottom: 2}}>기계 :</p>
          <select style={{
            width: '130px',
            height: '98%',
            borderRadius: 5,
            backgroundColor: '#353b48',
            color: '#ffffff',
            paddingLeft: 10,
          }} onChange={(e) => {
            setTonPage({...tonPage, current: 1})
            setMachinePk(e.target.value)
          }}>
            <option value={'all'}>전체</option>
            {
              machineList.map((v, i) => {
                return (
                  <option value={v.pk} key={`${v.pk}machine${i}`}>{v.name}</option>
                )
              })}
          </select>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{marginRight: 40}}>
          <HalfTalbe
            title={'제품 별 톤'}
            indexList={index}
            valueList={list}
            clickValue={selectValue}
            mainOnClickEvent={onClick}
            currentPage={materialPage.current}
            totalPage={materialPage.total}
            pageOnClickEvent={(event, i: number) => {
              setTonPage({...tonPage, current: 1})
              setMaterialPage({...materialPage, current: i})
            }}
            noChildren={true}>
          </HalfTalbe>
        </div>
        <div>
          <HalfTalbe
            indexList={subIndex}
            valueList={detailList}
            currentPage={minPage.current}
            totalPage={minPage.total}
            pageOnClickEvent={(event, i: number) => setMinPage({...minPage, current: i})}
            noChildren={true}>
          </HalfTalbe>
          <HalfTalbe
            indexList={sub2Index}
            valueList={detailTonList}
            currentPage={tonPage.current}
            totalPage={tonPage.total}
            pageOnClickEvent={(event, i: number) => setTonPage({...tonPage, current: i})}
            noChildren={true}>
          </HalfTalbe>
        </div>
      </div>
    </div>
  )
}

const ChartDiv = Styled.div`
    width: 95%;
    height: 250px;
    background-color: #111319;
    margin: 0;
    padding: 0; 
    clear: both;
    .apexcharts-marker{
    border: 0;
    }
`

export default ProductToneContainer
