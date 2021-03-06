import React, {useCallback, useEffect, useState} from 'react'
import 'react-dropdown/style.css'
import {API_URLS, deleteBasicList, getBasicList} from '../../Api/mes/basic'
import {transferCodeToName, transferStringToCode} from '../../Common/codeTransferFunctions'
import Notiflix from 'notiflix'
import OptimizedHeaderBox from '../../Components/Box/OptimizedHeaderBox'
import {useHistory} from 'react-router-dom'
import OptimizedTable from '../../Components/Table/OptimizedTable'


interface Props {
  type: string
  onClickRegister: () => void
}

const optionList = [
  '등록순',
]

Notiflix.Loading.Init({svgColor: '#1cb9df',})
Notiflix.Report.Init({
  Failure: {
    svgColor: '#ff5549'
  }
})

const regExp = /[\{\}\[\]\?.,;:|\)*~`!^\_+<>@\#$%&\\\=\(\'\"]/gi

// 리스트 부분 컨테이너
const BasicMaterialContainer = () => {
  const history = useHistory()
  const [page, setPage] = useState<PaginationInfo>({
    current: 1,
  })
  const [titleEventList, setTitleEventList] = useState<any[]>([])
  const [list, setList] = useState<any>([])
  const [eventList, setEventList] = useState<any[]>([])
  const [option, setOption] = useState(0)
  const [isFirst, setIsFirst] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [filter, setFilter] = useState<number>(-1)
  const [saveKeyword, setSaveKeyword] = useState<string>('')
  const [deletePk, setDeletePk] = useState<string>('')
  // const [page, setPage] = useState<number>(0);

  const titleEvent = [
    {
      Name: '등록하기',
      Width: 90,
      Link: () => history.push('/basic/material/register'),
    },
    // {
    //     Name: '삭제',
    //     Link: () => null
    // }
  ]

  useEffect(() => {
    getList()
    setTitleEventList(titleEvent)
    setEventList(eventdummy)
  }, [])

  const eventdummy = [
    {
      Name: '삭제',
      Width: '180px',
      Color: 'white',
      buttonWidth: '70px',
      Link: (v) => setDeletePk(v.pk)
    },
  ]

  const AddComma = (num) => {
    let tmpNum = num.toString().split('.')
    let regexp = /\B(?=(\d{3})+(?!\d))/g
    return tmpNum[0].replace(regexp, ',') + (tmpNum[1] ? `.${tmpNum[1]}` : '')
  }


  /**
   * getList()
   * 목록 불러오기
   */
  const getList = useCallback(async (isSearch?: boolean) => {
    Notiflix.Loading.Circle()
    console.log(filter)
    const tempUrl = `${API_URLS['material'].list}?page=${isSearch ? 1 : page.current}&keyword=${saveKeyword}&type=${option}&limit=15${filter !== -1 ? `&filter=${filter}` : ''}`
    const resultList = await getBasicList(tempUrl)
    if (resultList) {
      const getBasic = resultList.info_list.map((v, i) => {

        const Type = transferCodeToName('material', v['material' + '_type'])
        return {...v, ['material' + '_type']: Type}
      })

      const materialBasic = getBasic.map((material, index) => {

        const stock = AddComma(material.stock)

        return {...material, stock: stock}
      })
      setList(materialBasic)

      setIsFirst(true)
      setPage({current: resultList.current_page, total: resultList.total_page})
      Notiflix.Loading.Remove()
    }
  }, [list, keyword, option, page, saveKeyword, filter])

  useEffect(() => {
    if (isFirst) {
      getList()
    }
  }, [page.current])

  useEffect(() => {
    console.log(filter)
    if (isFirst) {
      getList(true)
    }
  }, [saveKeyword, filter])

  useEffect(() => {
    if (deletePk) {
      onClickDelete(deletePk)
    }
  }, [deletePk])

  /**
   * onClickDelete()
   * 리스트 항목 삭제
   */
  const onClickDelete = async (id) => {
    console.log(filter)
    const tempUrl = `${API_URLS['material'].delete}`
    const result = await deleteBasicList(tempUrl, id)
    if (result) {
      getList().then(() => Notiflix.Loading.Remove(300))
    }

  }


  return (
    <>
      <div style={{position: 'relative'}}>
        <OptimizedHeaderBox title={'품목 기본정보'}
                            searchBarChange={(e) => {
                              if (!e.match(regExp)) setKeyword(e)
                            }}
                            dropDownOption={option}
                            dropDownOnClick={(e) => {
                              setKeyword('')
                              setSaveKeyword('')
                              setOption(e)
                            }}
                            dropDownContents={['품목명', '', '품번']}
                            searchBarValue={keyword}
                            searchButtonOnClick={() => setSaveKeyword(keyword)}
                            titleOnClickEvent={titleEventList}/>
      </div>
      <OptimizedTable widthList={LIST_INDEX['material'].width}
                      indexList={LIST_INDEX['material'].index}
                      valueList={list}
                      EventList={eventList}
                      selectBoxChange={(e) => {
                        console.log(e)
                        setFilter(transferStringToCode('material', e))
                      }}
                      mainOnClickEvent={(v) => history.push(`/basic/material/register?pk=${v.pk}`)}
                      currentPage={page.current}
                      totalPage={page.total}
                      pageOnClickEvent={(event, i) => setPage({...page, current: i})}/>
    </>
  )
}

export const LIST_INDEX = {
  machine: {
    title: '기계 기본정보',
    width: ['220px', '220px', '220px', '220px'],
    index: {
      machine_name: '기계명',
      machine_type: '기계종류',
      manufacturer_code: '제조번호',
      location_name: '공장명'
    }
  },
  device: {
    title: '주변장치 기본정보',
    width: ['220px', '220px', '220px', '220px'],
    index: {
      device_name: '장치명',
      device_type: '장치종류',
      manufacturer_code: '제조번호',
      location_name: '공장명',
    }
  },
  material: {
    title: '품목 기본정보',
    width: ['320px', '206px', '307px',],
    index: {
      material_name: '품목명',
      material_type: ['품목 종류', '원자재', '부자재', '반제품', '완제품'],
      material_code: '품번',
    }
  },
  mold: {
    title: '금형 기본 정보',
    width: ['184px', '184px', '184px', '184px', '184px'],
    index: {
      mold_name: '금형명',
      mold_type: '금형 종류',
      limit: '최대타수',
      current: '현재타수',
      location_name: '기본위치'
    }
  },
  factory: {
    title: '공장 기본정보',
    width: ['180px', '450px', '80px', '120px'],
    index: {
      name: '공장명',
      roadAddress: '주소',
      postcode: '우편 번호',
      detail: '상세 주소',
    }
  },
  subdivided: {
    title: '공장 세분화',
    width: ['366px', '536px'],
    index: {
      subdivided_name: '부속 공장명',
      factory_name: '공장명',
    }
  },
  parts: {
    title: '부품 기본정보',
    width: ['184px', '184px', '184px', '184px', '184px'],
    index: {
      parts_name: '부품명',
      parts_type_name: '부품 종류 명',
      location_name: '공장명',
      parts_cost: '부품원가',
      parts_stock: '재고'
    }
  },
  barcode: {
    title: '바코드 표준',
    width: ['184px', '184px', '184px', '184px', '184px'],
    index: {
      barcode_name: '이름',
      main_type: '품목(품목명)',
      detail_type: '상세 품목',
      barcode_number: '바코드 번호',
      registered: '등록 날짜'
    }
  },
}


export default BasicMaterialContainer

