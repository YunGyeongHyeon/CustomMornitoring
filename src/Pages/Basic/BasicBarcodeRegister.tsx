import React, { useEffect, useState, useContext , useCallback} from 'react';
import Styled, { withTheme } from 'styled-components'
import {BASE_URL, BG_COLOR, BG_COLOR_SUB, SYSTEM_NAME, BG_COLOR_SUB2, COMPANY_LOGO, POINT_COLOR, MAX_WIDTH, TOKEN_NAME} from '../../Common/configset'
import DashboardWrapContainer from '../../Containers/DashboardWrapContainer';
import Header from '../../Components/Text/Header';
import WhiteBoxContainer from '../../Containers/WhiteBoxContainer';
import NormalInput from '../../Components/Input/NormalInput';
import RegisterButton from '../../Components/Button/RegisterButton';
import { getToken } from '../../Common/tokenFunctions';
import SubNavigation from '../../Components/Navigation/SubNavigation';
import InnerBodyContainer from '../../Containers/InnerBodyContainer';
import {    ROUTER_MENU_LIST, MES_MENU_LIST } from '../../Common/routerset';
import DropdownInput from '../../Components/Input/DropdownInput';
import { getParameter, getRequest, postRequest } from '../../Common/requestFunctions';
import FullAddInput from '../../Components/Input/FullAddInput';
import {getMachineTypeList, getBarcodeTypeList} from '../../Common/codeTransferFunctions';
import ListHeader from '../../Components/Text/ListHeader';
import SelectDocumentForm from '../../Containers/Basic/SelectDocumentForm';
import DocumentFormatInputList from '../../Containers/Basic/DocumentFormatInputList';
import * as _ from 'lodash';
import useObjectInput from '../../Functions/UseInput';
import { JsonStringifyList } from '../../Functions/JsonStringifyList';
import {useHistory} from 'react-router-dom';
import BarcodeRulesInput from '../../Components/Input/BarcodeRulesInput';
import { API_URLS, loadBasicItem } from '../../Api/basic';

// 바코드 등록 페이지
// 주의! isUpdate가 true 인 경우 수정 페이지로 사용

const initialData = {
  pk:'',
  name:'',
  description:'',
  type: 0,
  rules: [],
}
const indexList = getBarcodeTypeList('kor');

const BasicBarcodeRegister = () => {

  const history = useHistory();
  const [document, setDocument] = useState<any>({id:'', value:'(선택)'});
  const [essential,setEssential] = useState<any[]>([]);
  const [optional,setOptional] = useState<any[]>([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [pk, setPk] = useState<string>('');
  const [inputData, setInputData] = useObjectInput('CHANGE', initialData);

  useEffect(()=>{
    
    if(getParameter('pk')){
      setPk(getParameter('pk'))
      setIsUpdate(true)
      getData()
    }

  },[])

  /**
   * getData()
   * 기존 데이터 불러오기
   */
  const getData = useCallback(async()=>{
    
    const tempUrl = `${API_URLS['barcode'].load}?pk=${getParameter('pk')}`
    
    const result = await loadBasicItem(tempUrl);

    if(result){
      const data = result;
      setInputData('pk', data.pk)
      setInputData('name', data.name)
      setInputData('rules', data.rules)
      setInputData('type', data.type)
      setInputData('description', data.description)
    }
  
  },[pk, optional, essential, inputData ])

  
  const onsubmitFormUpdate = useCallback(async(e)=>{
    e.preventDefault();
    
    if(inputData.rules.includes(null) || inputData.rules.name == '' ){
      alert('바코드 이름과 규칙을 반드시 입력해주세요.');
      return;
    }

    const data = {
      pk: getParameter('pk'),
      name: inputData.name,
      rules: inputData.rules,
      type: inputData.type,
      description: inputData.description,
      info_list: JsonStringifyList(essential, optional)
    };
    const res = await postRequest('http://211.208.115.66:8099/api/v1/barcode/standard/update', data, getToken(TOKEN_NAME))

    if(res === false){
      alert('[SERVER ERROR] 요청을 처리 할 수 없습니다.')

    }else{
      if(res.status === 200){
          alert('성공적으로 수정 되었습니다');
          history.push('/basic/list/barcode')
      }else{
        alert('요청을 처리 할 수 없습니다 다시 시도해주세요.')
      }
    }

  },[pk, optional, essential, inputData ])

  const onsubmitForm = useCallback(async(e)=>{
    e.preventDefault();

    if(inputData.rules.includes(null) || inputData.rules.name == '' )
      return alert('바코드 이름과 규칙을 반드시 입력해주세요.');


    const data = {
      document_pk: document.pk,
      name: inputData.name,
      rules: inputData.rules,
      type: inputData.type,
      description: inputData.description,
      info_list: JsonStringifyList(essential, optional)
    };

    const res = await postRequest('http://211.208.115.66:8099/api/v1/barcode/standard/register', data, getToken(TOKEN_NAME))

    
    if(res === false){
      alert('[SERVER ERROR] 요청을 처리 할 수 없습니다.')

    }else{
      if(res.status === 200){
          alert('성공적으로 등록 되었습니다');
          history.push('/basic/list/barcode')
      }else{
        alert('요청을 처리 할 수 없습니다 다시 시도해주세요.')
      }
    }

  },[pk, optional, essential, inputData , document])




  return (
    <DashboardWrapContainer index={'basic'}>
     <SubNavigation list={MES_MENU_LIST.basic}/>
        <InnerBodyContainer>
            <Header title={isUpdate ? '바코드 기준정보 수정' : '바코드 기준정보 등록'}/>
            <WhiteBoxContainer>
              {
                document.id !== '' || isUpdate == true?
                <form onSubmit={isUpdate ? onsubmitFormUpdate : onsubmitForm} >
                <ListHeader title="필수 항목"/>
                <NormalInput title={'바코드명'} value={inputData.name} onChangeEvent={(input)=>setInputData(`name`, input)} description={'바코드 이름을 입력해주세요.'}/>
                <DropdownInput title={'바코드 종류'} target={indexList[inputData.type]} contents={indexList} onChangeEvent={(input)=>setInputData(`type`, input)}/>
                
                {
                    inputData.rules.length > 0 && inputData.rules[0] !== null &&
                    <BarcodeText><br/><span>현재 규칙</span><br/>{inputData.rules.map(v=>{if(v !== null)return v + `-`}).join().replace(/,/g,'')}</BarcodeText>
                }
                <FullAddInput title={'바코드 규칙'} onChangeEvent={()=>{
                  let temp = _.cloneDeep(inputData.rules); 
                  temp.push(null);
                  setInputData(`rules`, temp)
                }}>
                  
                  {
                    inputData.rules.map((v, i)=>{
                      return(
                        <BarcodeRulesInput title={`규칙 ${i+1}`} value={v} 
                        onRemoveEvent={()=>{
                          let temp = _.cloneDeep(inputData.rules); 
                          temp.splice(i, 1)
                          setInputData(`rules`, temp)
                        }} 
                        onChangeEvent={(input)=>{ 
                          let temp = _.cloneDeep(inputData.rules); 
                          temp.splice(i, 1, input);
                          setInputData(`rules`, temp)
                        }} 
                        />
                      )
                    })
                  }
                  </FullAddInput>
    
               <br/>
                <ListHeader title="선택 항목"/>
                <NormalInput title={'설명'}  value={inputData.description} onChangeEvent={(input)=>setInputData(`description`, input)} description={'(비고)'}/>
                <br/>
                <DocumentFormatInputList 
                  
                  pk={!isUpdate ? document.pk : undefined}
                  loadDataUrl={isUpdate? `http://211.208.115.66:8099/api/v1/barcode/standard/load?pk=${pk}` :''} 
                  onChangeEssential={setEssential} onChangeOptional={setOptional}
                  />

                <RegisterButton name={isUpdate ? '수정하기' : '등록하기'} />   
              </form>
                :
                <SelectDocumentForm category={6} onChangeEvent={setDocument}/>
            }
            </WhiteBoxContainer>
            
        </InnerBodyContainer>
      
      </DashboardWrapContainer>
      
  );
}

const BarcodeText = Styled.p`
  text-align: center;
  color: #555555;
  font-size: 16px;
  span{
    font-weight: bold;
    font-size: 13px;
    padding-top: 14px;
    color: #252525;
  }

`

export default BasicBarcodeRegister;