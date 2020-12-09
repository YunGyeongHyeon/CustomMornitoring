import React, {useCallback, useEffect, useState} from 'react'
import KPIBasicBox from '../../Components/Box/KPIBasicBox'
import KPICompareBox from '../../Components/Box/KPICompareBox'
import KPIMenuBox from '../../Components/Box/KPIMenuBox'
import KPIResultBox from '../../Components/Box/KPIResultBox'
import TopHeader from '../../Components/Text/TopHeader'
import {API_URLS, getKPIData} from '../../Api/mes/KPI'
import moment from 'moment'

interface Menu {
  name: string,
  api: string,
  tip: string
}

const menuList: {
  name: string,
  api: string,
  tip: string
}[] = [
  {name: '설비가동률', api: 'facility_operational_improvement_rate', tip: '제조 원가를 낮출 수 있습니다.'}, // api key이름
  {name: '제조 리드타임', api: 'manufacturing_leadTime_reduced_rate', tip: '제조 원가를 낮출 수 있습니다.'},
  {name: '생산 품목', api: 'item_growth_rate', tip: '제조 원가를 낮출 수 있습니다.'},
  {name: '생산 목표 달성률', api: 'target_attainment_rate', tip: '제조 원가를 낮출 수 있습니다.'}
]

const subTitleList = {
  facility_operational_improvement_rate: {},
  manufacturing_leadTime_reduced_rate: {
    total: '총 리드타임',
    worked: '총 작업 이력 건 순'
  },
  item_growth_rate: {},
  target_attainment_rate: {
    total: '총 생산목표 수량',
    produced: '총 생산된 수량',
  }
}

const ProductionKPIContainer = () => {
  const [selectMenu, setSelectMenu] = useState<Menu>(menuList[0])
  const [type, setType] = useState<'month' | 'week' | 'day'>('day')
  const [compareView, setCompareView] = useState<boolean>(false)
  const [data, setData] = useState<any>({number: 100, increase: true})
  const [compareArr, setCompareArr] = useState<number[]>([0, 0])

  useEffect(() => {
    // getData();
  }, [selectMenu])

  const changeDate = (date: Date) => {
    return moment(date).format('YYYY-MM-DD')
  }

  const getData = async (from: Date, to: Date, index: number, pk?: string,) => {
    let tempUrl = ''
    if (selectMenu.api === 'manufacturing_leadTime_reduced_rate') {
      tempUrl = `${API_URLS['kpi'].production[selectMenu.api]}?material=${pk}`
    } else {
      tempUrl = `${API_URLS['kpi'].production[selectMenu.api]}?from=${changeDate(from)}&to=${changeDate(to)}`
    }
    const resultData = await getKPIData(tempUrl)
    if (resultData) {
      const tmpList = compareArr
      tmpList[index] = typeof resultData.data === 'string' ? Number(resultData.data.split(':')[0]) * 3600 + Number(resultData.data.split(':')[1]) * 60 + Number(resultData.data.split(':')[2]) : resultData
      setCompareArr([...tmpList])

      return resultData
    }
    return 0
  }

  useEffect(() => {
    setCompareView(false)
  }, [selectMenu])

  const onClose = () => {
    setCompareView(false)
    setData({})
  }

  return (
    <div style={{maxWidth: 1100}}>
      <TopHeader title={'생산지수(P)'} top={5} bottom={19}/>
      <KPIMenuBox menuList={menuList} onChangeEvent={(select: Menu) => setSelectMenu(select)} value={selectMenu}>
        <KPICompareBox type={type} setType={(type) => setType(type)} value={selectMenu}
                       getData={getData} index={0} subTitleList={subTitleList[selectMenu.api]}/>
        {
          compareView
            ? <>
              <KPICompareBox type={type} getData={getData} subTitleList={subTitleList[selectMenu.api]}
                             value={selectMenu} index={1}/>
              <KPIResultBox onCloseEvent={() => onClose()} data={compareArr}/>
            </>
            : <KPIBasicBox style={{justifyContent: 'center', alignItems: 'center'}}>
              <button onClick={() => setCompareView(true)}>비교하기</button>
            </KPIBasicBox>
        }
      </KPIMenuBox>
    </div>
  )
}

export default ProductionKPIContainer
