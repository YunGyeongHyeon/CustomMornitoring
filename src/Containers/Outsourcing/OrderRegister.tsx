import React, {useCallback, useEffect, useState} from 'react'
import {POINT_COLOR, TOKEN_NAME} from '../../Common/configset'
import Header from '../../Components/Text/Header'
import WhiteBoxContainer from '../../Containers/WhiteBoxContainer'
import NormalInput from '../../Components/Input/NormalInput'
import RegisterButton from '../../Components/Button/RegisterButton'
import {getToken} from '../../Common/tokenFunctions'
import {getParameter, getRequest, postRequest} from '../../Common/requestFunctions'
import {uploadTempFile} from '../../Common/fileFuctuons'
import ListHeader from '../../Components/Text/ListHeader'
import {useHistory} from 'react-router-dom'
import ColorCalendarDropdown from '../../Components/Dropdown/ColorCalendarDropdown'
import InputContainer from '../InputContainer'
import Styled from 'styled-components'
import ProductionPickerModal from '../../Components/Modal/ProductionPickerModal'
import NormalAddressInput from '../../Components/Input/NormalAddressInput'
import useObjectInput from '../../Functions/UseInput'
import OutsourcingPickerModal from '../../Components/Modal/OutsourcingRegister'
import NormalNumberInput from '../../Components/Input/NormalNumberInput'
import {SF_ENDPOINT} from '../../Api/SF_endpoint'
import {API_URLS, getOutsourcingList, postOutsourcingRegister} from '../../Api/mes/outsourcing'
import DateInput from '../../Components/Input/DateInput'
import moment from 'moment'

// 발주 등록 페이지
// 주의! isUpdate가 true 인 경우 수정 페이지로 사용
interface Props {
  match: any;
  // chilren: string;
}

const OutsourcingRegister = ({match}: Props) => {
  const history = useHistory()

  const [selectDate, setSelectDate] = useState<string>(moment().format('YYYY-MM-DD'))
  const [pk, setPk] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [no, setNo] = useState<number>()
  const [type, setType] = useState<number>(0) //0: 법인, 1:개인
  const [phone, setPhone] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [fax, setFax] = useState<string>('')
  const [phoneM, setPhoneM] = useState<string>('')
  const [emailM, setEmailM] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [manager, setManager] = useState<string>('')
  const [ceo, setCeo] = useState<string>('')
  const [infoList, setInfoList] = useState<IInfo[]>([])

  const [paths, setPaths] = useState<any[1]>([null])
  const [oldPaths, setOldPaths] = useState<any[1]>([null])

  const [date, setDate] = useState<string>(moment().format('YYYY-MM-DD'))

  const [selectMaterial, setSelectMaterial] = useState<{ name?: string, pk?: string }>()
  const [selectOutsource, setSelectOutsource] = useState<{ name?: string, pk?: string }>()
  const [quantity, setQuantity] = useState<number>()
  const [unpaid, setUnpaid] = useState<number>()
  const [paymentCondition, setPaymentCondition] = useState('')
  const [inputData, setInputData] = useObjectInput('CHANGE', {
    name: '',
    description: '',
    location: {
      postcode: '',
      roadAddress: '',
      detail: '',
    },

  })

  const [isUpdate, setIsUpdate] = useState<boolean>(false)


  useEffect(() => {
    if (match.params.pk) {
      ////alert(`수정 페이지 진입 - pk :` + param)
      setIsUpdate(true)
      getData()
    }
  }, [])


  /**
   * getData()
   * 기계 정보 수정을 위한 조회
   * @param {string} url 요청 주소
   * @param {string} pk 기계 pk
   * @returns X
   */
  const getData = useCallback(async () => {

    const tempUrl = `${API_URLS['order'].load}?pk=${match.params.pk}`
    const res = await getOutsourcingList(tempUrl)


    if (res) {
      //TODO: 에러 처리
      const data = res
      setSelectOutsource({name: data.company_name, pk: data.company_pk})
      setSelectMaterial({name: data.product, pk: data.product_pk})
      setInputData('location', data.address)
      setQuantity(data.quantity)
      setUnpaid(data.unpaid)
      setSelectDate(data.due_date)
      setPaymentCondition(data.payment_condition)
    }
  }, [pk, selectOutsource, selectMaterial, selectDate, quantity, unpaid, paymentCondition, inputData])

  /**
   * onsubmitFormUpdate()
   * 기계 정보 수정 요청
   * @param {string} url 요청 주소
   * @param {string} pk 기계 pk
   * @param {string} name 이름
   * @param {string} no 넘버
   * @param {object(file)} file 사진 파일
   * @param {string} info 상세정보
   * @param {string} made 제조정보
   * @param {string} type 종류
   * @param {string} madeNo 제조사넘버
   * @returns X
   */
  const onsubmitFormUpdate = useCallback(async () => {

      if (selectOutsource?.pk === '') {
        alert('외주처는 필수 항목입니다. 반드시 선택해주세요.')
        return
      } else if (selectMaterial?.pk === '') {
        alert('품목은 필수 항목입니다. 반드시 선택해주세요.')
        return
      } else if (!quantity || quantity === 0) {
        alert('수량은 필수 항목입니다. 반드시 입력해주세요.')
        return
      } else if (unpaid !== 0 && !unpaid) {
        alert('미납 수량은 필수 항목입니다. 반드시 입력해주세요.')
        return
      } else if (paymentCondition === '') {
        alert('대급 지불조건은 필수 항목입니다. 반드시 입력해주세요.')
        return
      } else if (selectDate === '') {
        alert('납기일은 필수 항목입니다. 반드시 선택주세요.')
        return
      } else if (inputData.location.postcode === '') {
        alert('공장 주소는 필수 항목입니다. 반드시 입력해주세요.')
        return
      }


      const data = {
        pk: match.params.pk,
        company: selectOutsource?.pk,
        product: selectMaterial?.pk,
        quantity: quantity.toString(),
        unpaid: String(unpaid),
        due_date: selectDate,
        payment_condition: paymentCondition,
        address: inputData.location
        //info_list : infoList.length > 0 ? JSON.stringify(infoList) : null,

      }
      const tempUrl = `${API_URLS['order'].update}`
      const res = await postOutsourcingRegister(tempUrl, data)

      if (res) {
        history.push('/outsourcing/order/list')
      }
    }

    ,
    [pk, selectOutsource, selectMaterial, selectDate, quantity, unpaid, paymentCondition, inputData]
  )

  /**
   * onsubmitForm()
   * 기계 정보 등록
   * @param {string} url 요청 주소
   * @param {string} name 이름
   * @param {string} no 넘버
   * @param {string} info 상세정보
   * @param {string} made 제조정보
   * @param {string} type 종류
   * @param {string} madeNo 제조사넘버
   * @returns X
   */
  const onsubmitForm = useCallback(async () => {

    ////alert(JSON.stringify(infoList))
    if (selectOutsource?.pk === '') {
      alert('외주처는 필수 항목입니다. 반드시 선택해주세요.')
      return
    } else if (selectMaterial?.pk === '') {
      alert('품목은 필수 항목입니다. 반드시 선택해주세요.')
      return
    } else if (!quantity || quantity === 0) {
      alert('수량은 필수 항목입니다. 반드시 입력해주세요.')
      return
    } else if (unpaid !== 0 && !unpaid) {
      alert('미납 수량은 필수 항목입니다. 반드시 입력해주세요.')
      return
    } else if (paymentCondition === '') {
      alert('대급 지불조건은 필수 항목입니다. 반드시 입력해주세요.')
      return
    } else if (selectDate === '') {
      alert('납기일은 필수 항목입니다. 반드시 선택주세요.')
      return
    } else if (inputData.location.postcode === '') {
      alert('공장 주소는 필수 항목입니다. 반드시 입력해주세요.')
      return
    }

    const data = {
      company: selectOutsource?.pk,
      product: selectMaterial?.pk,
      quantity: quantity.toString(),
      unpaid: String(unpaid),
      due_date: selectDate.toString(),
      payment_condition: paymentCondition,
      address: inputData.location
    }

    const tempUrl = `${API_URLS['order'].register}`
    const res = await postOutsourcingRegister(tempUrl, data)


    if (res) {
      //TODO: 에러 처리
      history.push('/outsourcing/order/list')
    }

  }, [selectOutsource, selectMaterial, selectDate, quantity, unpaid, paymentCondition, inputData])


  return (
    <
      div>
      <Header
        title={isUpdate ? '발주 수정' : '발주 등록'}
      />
      <WhiteBoxContainer>
        <ListHeader title="필수 항목"/>
        <InputContainer title={'외주처 명'} width={120}>
          <OutsourcingPickerModal select={selectOutsource}
                                  onClickEvent={(e) => {
                                    setSelectOutsource({...selectOutsource, ...e})
                                  }} text={'외주처 명을 검색해주세요.'}/>
        </InputContainer>
        <InputContainer title={'품목(품목명)'} width={120}>
          <ProductionPickerModal select={selectMaterial}
                                 onClickEvent={(e) => {
                                   setSelectMaterial({...selectMaterial, ...e})
                                 }} text={'품목명을 검색해주세요.'} type={1}/>
        </InputContainer>
        <NormalNumberInput title={'수량'} value={quantity} onChangeEvent={setQuantity}
                           description={'수량을 입력하세요.'} width={120}/>
        <NormalNumberInput title={'미납 수량'} value={unpaid} onChangeEvent={setUnpaid}
                           description={'미납 수량을 입력하세요.'} width={120}/>
        <NormalInput title={'대금 지불조건'} value={paymentCondition} onChangeEvent={setPaymentCondition}
                     description={'대금 지불조건을 입력해 주세요.'} width={120}/>
        <DateInput title={'납기일'} description={''} value={selectDate} onChangeEvent={setSelectDate} width={135}
                   style={{width: '100%'}} inputStyle={{boxSizing: 'border-box'}}/>
        <NormalAddressInput title={'공장 주소'} value={inputData.location} titleWidth={'120px'}
                            onChangeEvent={(input) => setInputData(`location`, input)}/>
        {/* 자유항목 입력 창
             <FullAddInput title={'자유 항목'} onChangeEvent={()=>{
              const tempInfo = infoList.slice();
              tempInfo.push({title:`자유 항목 ${infoList.length + 1}`, value:""});
              setInfoList(tempInfo)
            }}>
              {
                infoList.map((v: IInfo, i)=>{
                  return(
                      <CustomIndexInput index={i} value={v}
                      onRemoveEvent={()=>{
                        const tempInfo = infoList.slice();
                        tempInfo.splice(i, 1)
                        setInfoList(tempInfo)
                      }}
                      onChangeEvent={(obj: IInfo)=>{
                        const tempInfo = infoList.slice();
                        tempInfo.splice(i, 1, obj)
                        setInfoList(tempInfo)
                      }}
                      />
                  )
                })
              }
              </FullAddInput>

            */}
        {isUpdate ?
          <div style={{marginTop: 40, marginLeft: 340}}>
            <ButtonWrap onClick={async () => {
              await onsubmitFormUpdate()
            }}>
              <div style={{width: 360, height: 40}}>
                <p style={{fontSize: 18, marginTop: 15}}>수정하기</p>
              </div>
            </ButtonWrap>
          </div>
          :
          <div style={{marginTop: 40, marginLeft: 340}}>
            <ButtonWrap onClick={async () => {
              await onsubmitForm()
            }}>
              <div style={{width: 360, height: 40}}>
                <p style={{fontSize: 18, marginTop: 15}}>등록하기</p>
              </div>
            </ButtonWrap>
          </div>
        }
      </WhiteBoxContainer>
    </div>
  )
}

const InputText = Styled.p`
    color: #b3b3b3;
    font-size: 15px;
    text-align: left;
    vertical-align: middle;
    font-weight: regular;
    `

const ButtonWrap = Styled.button`
    padding: 4px 12px 4px 12px;
    margin-bottom: 20px;
    border-radius: 5px;
    color: black;
    background-color: ${POINT_COLOR};
    border: none;
    font-weight: bold;
    font-size: 13px;
    img {
    margin-right: 7px;
    width: 14px;
    height: 14px;
    }
    `

export default OutsourcingRegister
