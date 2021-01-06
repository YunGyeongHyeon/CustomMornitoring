import React, {useEffect, useState} from 'react'
import Styled from 'styled-components'
import DateTypeCalendar from '../Modal/DateTypeCalendar'
import moment from 'moment'
import ProductionPickerModal from '../Modal/ProductionPickerModal'
import {Textfit} from 'react-textfit'

// KPI
interface IProps {
  // data: { number: number, increase: boolean }
  type: 'month' | 'week' | 'day'
  setType?: (type: 'month' | 'week' | 'day') => void
  getData?: (from: Date, to: Date, index: number, pk?: string) => Promise<any>
  index?: number
  value?: any
  subTitleList?: { total?: string, comply?: string, error?: string }
}

const unitArray = {
  percent: ['target_attainment_rate', 'facility_operational_improvement_rate', 'defective_items_reduced_rate', 'delivery_compliance_improvement_rate', 'stock_accuracy_improvement_rate',],
  kw: ['electric_saving_rate']
}

const KPICompareBox = ({type, setType, getData, index, value, subTitleList}: IProps) => {
  const [data, setData] = useState<any>({})
  const [isFirst, setIsFirst] = useState<boolean>(true)

  const [selectDate, setSelectDate] = useState<Date>(moment().subtract(1, 'days').toDate())
  const [selectDates, setSelectDates] = useState<{ from: Date, to: Date }>({
    from: moment().subtract(2, 'day').toDate(),
    to: moment().subtract(1, 'day').toDate(),
  })

  const [selectMaterial, setSelectMaterial] = useState<{ name: string, pk: string }>()

  useEffect(() => {
    if (isFirst) {
      setSelectMaterial(undefined)
      setIsFirst(false)
      return
    } else {
      if (!value || value.api !== 'manufacturing_leadTime_reduced_rate') {
        if (value.api === 'average_production_per_hour') {
          if (selectMaterial) {
            if (getData) {
              if (type === 'day') {
                getData(selectDate, selectDate, index ? index : 0, selectMaterial.pk).then((ratio) => {
                  setData(ratio)
                })
              } else {
                getData(selectDates.from, selectDates.to, index ? index : 0, selectMaterial.pk).then((ratio) => {
                  setData(ratio)
                })
              }
            }
          } else {
            setData({})
          }
        } else {
          if (getData) {
            if (type === 'day') {
              getData(selectDate, selectDate, index ? index : 0).then((ratio) => {
                setData(ratio)
              })
            } else {
              getData(selectDates.from, selectDates.to, index ? index : 0).then((ratio) => {
                setData(ratio)
              })
            }
          }
        }
      } else {
        setData({})
      }
    }
  }, [selectDate, selectDates, isFirst])

  useEffect(() => {
    setIsFirst(true)
  }, [value])

  const AddComma = (num) => {
    let tmpNum = num.toString().split('.')
    let regexp = /\B(?=(\d{3})+(?!\d))/g
    return tmpNum[0].replace(regexp, ',') + (tmpNum[1] ? `.${tmpNum[1]}` : '')
  }

  React.useEffect(() => {
    if (type === 'day') {
      setSelectDate(moment().subtract(1, 'days').toDate())
    } else if (type === 'week') {
      const nowDate = moment().subtract(7, 'days')
      setSelectDates({
        from: nowDate.startOf('isoWeek').toDate(),
        to: nowDate.endOf('isoWeek').toDate()
      })
    } else if (type === 'month') {
      const nowDate = moment().subtract(1, 'month')
      setSelectDates({
        from: nowDate.startOf('month').toDate(),
        to: nowDate.endOf('month').toDate()
      })
    }

  }, [type])

  React.useEffect(() => {
    if (selectMaterial && index !== undefined) {
      getData && getData(selectDate, selectDate, index, selectMaterial.pk).then((ratio) => {
        setData(ratio)
      })
    }
  }, [selectMaterial])

  return (
    <Container>
      <div>

        {
          value && value.api === 'manufacturing_leadTime_reduced_rate' ? <React.Fragment>
              <div style={{width: 371}}>
                {
                  <ProductionPickerModal filter={30} innerWidth={371} onClickEvent={(e) => {
                    setSelectMaterial(e)
                  }}
                                         select={{name: selectMaterial?.name, pk: selectMaterial?.pk}}
                                         text={'품목을 선택해주세요'}/>
                }
              </div>
            </React.Fragment>
            : <React.Fragment>
              <FlexBox>
                <DateTypeCalendar type={type} selectDate={selectDate} selectDates={selectDates}
                                  style={{zIndex: setType !== undefined ? 100 : 1}}
                                  onChangeSelectDate={(v, type) => {
                                    if (type === 'day') {
                                      setSelectDate(v)
                                    } else {
                                      setSelectDates(v)
                                    }
                                  }}/>
                {
                  setType !== undefined &&
                  <div style={{marginTop: 8}}>
                      <input type="radio" id="day" name="type"
                             checked={type === 'day'}
                             onClick={() => {
                               setType('day')
                             }}/>
                      <label htmlFor="day"><span style={{marginLeft: 25}}>일</span></label>

                      <input type="radio" id="week" name="type"
                             checked={type === 'week'}
                             onClick={() => {
                               setType('week')
                             }}/>
                      <label htmlFor="week"><span style={{marginLeft: 25}}>주</span></label>

                      <input type="radio" id="month" name="type"
                             checked={type === 'month'}
                             onClick={() => {
                               setType('month')
                             }}/>
                      <label htmlFor="month"><span style={{marginLeft: 25}}>월</span></label>
                  </div>
                }
              </FlexBox>
            </React.Fragment>
        }

        <div style={{display: 'flex', justifyContent: 'row'}}>
          {
            value.api === 'average_production_per_hour'
              ? <div style={{height: 100, paddingLeft: 20}}>
                <ProductionPickerModal filter={30} innerWidth={371} onClickEvent={(e) => {
                  setSelectMaterial(e)
                }}
                                       select={{name: selectMaterial?.name, pk: selectMaterial?.pk}}
                                       text={'품목을 선택해주세요'}/>
              </div>
              : Object.keys(data).map((v) => {
                if (v === 'data') {
                  return
                } else if (v === 'materials') {
                  return (
                    <div style={{height: 100, width: 400, marginRight: 16}}>
                      <div style={{width: 400, height: 20}}>
                        <p
                          style={{
                            fontSize: 14,
                            textAlign: 'left',
                            paddingLeft: 10
                          }}>{subTitleList && subTitleList[v]}</p>
                      </div>
                      <div
                        style={{
                          width: 400,
                          height: 80,
                          overflow: 'scroll',
                          border: '0.5px solid #b3b3b3',
                          marginLeft: 10,
                          marginTop: 10,
                          padding: 5
                        }}>
                        {
                          data[v].map((v, i) => {
                            return (
                              <>
                                <p style={{
                                  textAlign: 'left',
                                  fontSize: 20,
                                }}>{v}</p>
                              </>
                            )
                          })
                        }
                      </div>
                    </div>
                  )
                }
                return (
                  <div style={{height: 65, width: 160, marginRight: 16}}>
                    <div style={{width: 112, height: 20}}>
                      <p style={{fontSize: 14}}>{subTitleList && subTitleList[v]}</p>
                    </div>
                    <div style={{width: 160, height: 41}}>
                      <p style={{
                        textAlign: 'right',
                        fontSize: 20
                      }}>
                        {
                          !isNaN(Number(data[v])) ? Math.round(Number(data[v]) * 10) / 10 : data[v]
                        }
                      </p>
                    </div>
                  </div>
                )
              })
          }
        </div>
      </div>
      <div>
        {
          value.api === 'average_production_per_hour' && selectMaterial &&
          <div style={{height: 30}}>
              <p>{selectMaterial.name}</p>
              <p>오차율() (공회전, 초품검사)</p>
          </div>
        }
        <div>
          <Textfit mode={'single'} style={{
            textAlign: 'right',
            fontSize: 128,
            fontWeight: 'bold',
          }}>{
            (value.api === 'amount_of_on_process_material' || value.api === 'stock_cost')
              ? !isNaN(Number(data.data)) && AddComma(Math.round(Number(data.data) * 10) / 10)
              : (value.api === 'defective_items_reduced_rate' || value.api === 'target_attainment_rate')
              ? !isNaN(Number(data.data)) ? Math.round(Number(data.data) * 100000) / 1000 : data.data
              : (value.api === 'average_production_per_hour')
                ? data.data
                : !isNaN(Number(data.data)) ? Math.round(Number(data.data) * 10) / 10 : data.data
          }
            <span style={{fontSize: 40, paddingLeft: '4pt'}}>
              {
                unitArray.percent.indexOf(value.api) !== -1 && '%'
              }
              {
                unitArray.kw.indexOf(value.api) !== -1 && 'KW'
              }
            </span>
          </Textfit>
        </div>
      </div>
    </Container>
  )
}

const Container = Styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 224px;
    padding: 16px;
    background-color: #111319;
    border-radius: 0px 0px 6px 6px;
    margin-bottom: 8px;
    box-sizing: border-box;
    *{box-sizing: border-box;}
    &>div{
        width: 50%;
        &:first-child{
            position: relative;
            &>div{
                &:nth-child(2){
                    position: absolute;
                    bottom: 29px;
                    left: 0;
                    font-size: 30px;
                    font-weight: bold;
                }
            }
        }
        &:nth-child(2){
            padding-right: 60px;
        }
    }
`

const FlexBox = Styled.div`
    display: flex;
    &>div{
        &:first-child{
            margin-right: 24px;
            cursor: pointer;
            // 달력 붙이면 지우기(시작)
            border-radius: 6px;
            background-color: #b3b3b3;
            color: #111319;
            padding: 4px 12px;
            font-size: 15px;
            font-weight: bold;
            // 달력 붙이면 지우기(끝)
        }
        &:nth-child(2){
            &>input{
                cursor: pointer;
            }
            &>label{
                cursor: pointer;
                margin-right: 32px;
                &>span{
                    margin: 0 0 0 8px;
                    opacity: 0.7;
                    font-size: 18px;
                    font-weight: bold;
                }
            }
        }
    }
`

export default KPICompareBox
