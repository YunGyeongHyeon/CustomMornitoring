import React, { useCallback, useEffect, useState } from 'react'
import Styled from 'styled-components'
import ReactApexChart from 'react-apexcharts'
import CalendarDropdown from '../../Components/Dropdown/CalendarDropdown'
import ListRadioButton from '../../Components/Button/ListRadioButton'
import LoadtoneBox from '../../Components/Box/LoadtoneBox'
import { API_URLS, getCapacityTimeData } from '../../Api/pm/analysis'
import { API_URLS as API_URLS2 } from '../../Api/pm/statistics'
import tempImage from '../../Assets/Images/temp_machine.png'
import moment from 'moment'
import NoDataCard from '../../Components/Card/NoDataCard'
import { SF_ENDPOINT_RESOURCE } from '../../Api/SF_endpoint'

const ChartInitOptions = {
  chart: {
    type: 'bar',
    toolbar: {
      show: true,
      tools: {
        download: false,
        selection: true,
        zoom: false,
        zoomin: true,
        zoomout: true
      }
    },
    events: {
      click: function (chart, w, e) {
        console.log(chart, w, e)
      }
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '55%',
      distributed: false
    }
  },
  stroke: {
    width: 2
  },
  grid: {
    borderColor: '#42444b',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  fill: {
    // type: "gradient",
    // gradient: {
    //     type: "vertical",
    //     shadeIntensity: 0,
    //     opacityFrom: 1,
    //     opacityTo: .20,
    //     stops:[0, 90, 100]
    // }
  },
  colors: [ '#dd4bbe' ],
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  }
}

const ChartOptionDetailLable = {
  yaxis: {
    min: 0,
    labels: {
      formatter: (value, index) => {
        return value
      }
    }
  },
  xaxis: {
    tickAmount: 24,
    categories: [
      '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'
    ],
    labels: {
      style: {
        fontSize: '12px'
      }
    }
  }
}

const MachineInitData: IPressLoadTonSatistics[] = []

const LoadtonContiner = () => {
  const [ series, setSeries ] = useState<{ name: string, data: number[][] }[]>([])

  const [ selectMachine, setSelectMachine ] = useState<string>()

  const [ pressList, setPressList ] = useState<IPressMachineType[]>([])

  const [ selectDate, setSelectDate ] = useState<string>(moment().subtract(1, 'days').format('YYYY-MM-DD'))

  const [ overTon, setOverTon ] = useState<IOverTonStatistics>({
    pressPk: '',
    maxLoadton: '',
    minLoadton: '',
    x_hour: [],
    y_average: []
  })

  const [ selectType, setSelectType ] = useState([ true, false, false ])

  /**
   * getData()
   * 생산량 분석 데이터 로드
   * @param {string} pk 프레스 pk
   * @param {string} date 요청 날짜
   * @returns X
   */
  const getData = useCallback(async () => {
    const tempUrl = `${API_URLS2['loadTon'].load}?pk=${selectMachine}&date=${selectDate}`
    const resultData = await getCapacityTimeData(tempUrl)
    setOverTon(resultData)

    const seriesList = resultData.y_average.map((v, i) => {
      return Number(v).toFixed(1)
    })


    setSeries([ { name: 'Loadton', data: seriesList } ])
  }, [ selectMachine, selectDate ])

  const getList = useCallback(async () => {
    const tempUrl = `${API_URLS['pressList'].list}`
    const resultData = await getCapacityTimeData(tempUrl)
    setPressList(resultData)

  }, [])

  useEffect(() => {
    if (selectMachine) {
      getData()
    }
  }, [ selectMachine, selectDate ])

  useEffect(() => {
    getList()
  }, [])

  return (
    <div>
      <div style={{ marginTop: 87, marginBottom: 19 }}>
        <p style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'left' }}>프레스 로드톤</p>
      </div>
      <ChartListBox>
        <div style={{ marginTop: 25, marginBottom: 23 }}>
          <p style={{ textAlign: 'left', fontSize: 20, fontWeight: 'bold' }}>프레스 선택</p>
        </div>
        {
          pressList.length === 0
            ? <div
              style={{
                width: '100%',
                height: '80%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <div style={{ flex: 1 }}><p style={{ textAlign: 'center' }}>데이터가 없습니다.</p></div>
            </div>
            : pressList.map((v, i) => {
              if (selectMachine === v.pk) {
                return (<ChartBorderMiniBox>
                  <div style={{
                    width: 114,
                    height: 100,
                    marginLeft: 8,
                    display: 'inline-block',
                    float: 'left',
                    paddingTop: 10
                  }}>
                    <img
                      src={(v.machine_img && v.machine_img.startsWith('resource')) ? `${SF_ENDPOINT_RESOURCE}${v.machine_img}` : tempImage}
                      style={{ width: 114, height: 104, objectFit: 'cover' }}/>
                  </div>
                  <div style={{
                    width: 150,
                    height: 100,
                    float: 'left',
                    display: 'inline-block',
                    marginTop: 10,
                    marginLeft: 21
                  }}>
                    <p style={{
                      fontWeight: 'bold',
                      textAlign: 'left'
                    }}>{v.machine_name + '(' + v.machine_ton + 't)'}</p>
                    <p style={{ textAlign: 'left' }}>{v.manufacturer_code}</p>
                  </div>
                </ChartBorderMiniBox>)
              } else {
                return (<ChartMiniBox onClick={() => {
                  setSelectMachine(v.pk)
                }}>
                  <div style={{
                    width: 114,
                    height: 100,
                    marginLeft: 8,
                    display: 'inline-block',
                    float: 'left',
                    paddingTop: 10
                  }}>
                    <img
                      src={(v.machine_img && v.machine_img.startsWith('resource')) ? `${SF_ENDPOINT_RESOURCE}${v.machine_img}` : tempImage}
                      style={{ width: 114, height: 104, objectFit: 'cover' }}/>
                  </div>
                  <div style={{
                    width: 150,
                    height: 100,
                    float: 'left',
                    display: 'inline-block',
                    marginTop: 10,
                    marginLeft: 21
                  }}>
                    <p style={{
                      fontWeight: 'bold',
                      textAlign: 'left'
                    }}>{v.machine_name + '(' + v.machine_ton + 't)'}</p>
                    <p style={{ textAlign: 'left' }}>{v.manufacturer_code}</p>
                  </div>
                </ChartMiniBox>)
              }
            })

        }
      </ChartListBox>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ marginLeft: 20 }}>
          <LoadtoneBox title={'로드톤'} width={690}>
            <div style={{ paddingTop: 25, paddingBottom: 27, marginLeft: 180 }}>
              <BottomBox>
                <div>
                  <p style={{ marginBottom: 10 }}>최소값</p>
                  <p>{overTon ? overTon.minLoadton ? overTon.minLoadton : '-' : '-'}</p>
                </div>
              </BottomBox>
              <BottomBox>
                <div>
                  <p style={{ marginBottom: 10 }}>최대값</p>
                  <p>{overTon ? overTon.maxLoadton ? overTon.maxLoadton : '-' : '-'}</p>
                </div>
              </BottomBox>
            </div>
          </LoadtoneBox>
        </div>
        {/*<LoadtoneBox title={'금일 로드톤'}>*/}
        {/*    <div style={{paddingTop: 25, paddingBottom: 27}}>*/}
        {/*        <BottomBox>*/}
        {/*            <div>*/}
        {/*                <p>최소값</p>*/}
        {/*                <p>-</p>*/}
        {/*            </div>*/}
        {/*        </BottomBox>*/}
        {/*        <BottomBox>*/}
        {/*            <div>*/}
        {/*                <p>최대값</p>*/}
        {/*                <p>-</p>*/}
        {/*            </div>*/}
        {/*        </BottomBox>*/}
        {/*    </div>*/}
        {/*</LoadtoneBox>*/}
      </div>
      <ChartDetailBox>
        <div style={{ marginTop: 25, paddingBottom: 5 }}>
          <div>
            <div style={{ float: 'left', display: 'inline-block' }}>
              <p style={{ textAlign: 'left', fontSize: 20, fontWeight: 'bold' }}>장비별 로드톤</p>
            </div>
            <CalendarDropdown type={'single'} select={selectDate}
                              onClickEvent={(i) => setSelectDate(i)}></CalendarDropdown>
            {/*<ListRadioButton nameList={['일']} data={selectType} onClickEvent={(i) => {*/}
            {/*  if (i === 0) {*/}
            {/*    setSelectType([true, false, false])*/}
            {/*  } else if (i === 1) {*/}
            {/*    setSelectType([false, true, false])*/}
            {/*  } else {*/}
            {/*    setSelectType([false, false, true])*/}
            {/*  }*/}
            {/*}}/>*/}
            <div style={{ width: 30, height: 30 }}></div>
          </div>
          <div>
            <p style={{ textAlign: 'left', color: 'rgba(255, 255, 255, .4)' }}>그래프 값은 시간당 평균값입니다.</p>
          </div>
        </div>
        {overTon.pressPk === '' ?
          <NoDataCard contents={'프레스를 선택해 주세요'} height={390} color={'#000000'}/>
          :
          <div style={{
            width: 640,
            height: 419,
            backgroundColor: '#000000',
            margin: 0,
            padding: 0,
            clear: 'both',
            marginTop: 10
          }}>
            <ReactApexChart options={{
              ...ChartInitOptions, ...ChartOptionDetailLable,
              yaxis: {
                ...ChartOptionDetailLable.yaxis,
                max: Math.ceil(Number(overTon.maxLoadton) / 100) * 100,
                tickAmount: (Math.ceil(Number(overTon.maxLoadton) / 100) * 100) / 100
              }
            }} series={series} type={'line'} height={'98%'}/>
          </div>
        }
      </ChartDetailBox>
    </div>
  )
}

const ChartListBox = Styled.div`
    display: inline-block;
    width: 340px;
    height: 724px;
    padding: 0 21px 0 21px;
    background-color: #353b48;
    border-radius: 6px;
    float: left;
    overflow-y:scroll;
`

const ChartDetailBox = Styled.div`
    display: inline-block;
    width: 640px;
    height: 524px;
    padding: 0 25px 0 25px;
    background-color: #000000;
    border-radius: 6px;
    float: left;
    margin-left: 20px;
    margin-top: 20px;
    .apexcharts-tooltip{
        color: #000000;
    }
`

const ChartMiniBox = Styled.div`
    margin-bottom: 20px;
    width: 340px;
    height: 120px;
    border-radius: 6px;
    background-color: #111319;
`

const ChartBorderMiniBox = Styled.div`
    margin-bottom: 20px;
    width: 340px;
    height: 120px;
    border-radius: 6px;
    background-color: #111319;
    border: 4px solid #19b9df;
`
const BottomBox = Styled.div`
    width: 164px;
    height: 78px;
    float: left;
    display: inline-block;
    &:first-child{
            border-right: 1px solid #ffffff;
            }
    p {
        font-size: 36px;
        font-weight: bold;
         &:first-child{
            font-size: 15px;
            }
    }
`

const Line = Styled.hr`
    margin: 10px 20px 12px 0px;
    border-color: #353b48;
    width: 1px;
    background-color: #ffffff;
`

export default LoadtonContiner
