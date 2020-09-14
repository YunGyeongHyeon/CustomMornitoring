import React, { useEffect, useState, useContext , useCallback} from 'react';
import Styled, { withTheme } from 'styled-components'
import WelcomeNavigation from '../../Components/Navigation/WelcomNavigation'
import WelcomeFooter from '../../Components/Footer/WelcomeFooter'
import {BASE_URL, BG_COLOR, BG_COLOR_SUB, SYSTEM_NAME, BG_COLOR_SUB2, COMPANY_LOGO, POINT_COLOR, MAX_WIDTH, TOKEN_NAME} from '../../Common/configset'
import ButtonBox from '../../Components/Button/BasicButton'
import DashboardWrapContainer from '../../Containers/DashboardWrapContainer';
import Header from '../../Components/Text/Header';
import WhiteBoxContainer from '../../Containers/WhiteBoxContainer';
import NormalInput from '../../Components/Input/NormalInput';
import RegisterButton from '../../Components/Button/RegisterButton';
import NormalFileInput from '../../Components/Input/NormalFileInput';
import { getToken } from '../../Common/tokenFunctions';
import BasicModal from '../../Containers/SearchModalContainer';
import SubNavigation from '../../Components/Navigation/SubNavigation';
import InnerBodyContainer from '../../Containers/InnerBodyContainer';
import {    ROUTER_MENU_LIST, MES_MENU_LIST } from '../../Common/routerset';
import DropdownInput from '../../Components/Input/DropdownInput';
import { getParameter, getRequest, postRequest } from '../../Common/requestFunctions';
import IcButton from '../../Components/Button/IcButton';
import InputContainer from '../../Containers/InputContainer';
import FullAddInput from '../../Components/Input/FullAddInput';
import CustomIndexInput from '../../Components/Input/CustomIndexInput';
import { uploadTempFile } from '../../Common/fileFuctuons';
import {getMachineTypeList} from '../../Common/codeTransferFunctions';
import DateInput from '../../Components/Input/DateInput';
import moment from 'moment';
import ListHeader from '../../Components/Text/ListHeader';
import OldFileInput from '../../Components/Input/OldFileInput';
import DropdownCode from '../../Components/Input/DropdownCode';
import SelectDocumentForm from '../../Containers/Basic/SelectDocumentForm';
import DocumentFormatInputList from '../../Containers/Basic/DocumentFormatInputList';
import * as _ from 'lodash';
import useObjectInput from '../../Functions/UseInput';
import NormalAddressInput from '../../Components/Input/NormalAddressInput';
import { JsonStringifyList } from '../../Functions/JsonStringifyList';
import {useHistory} from 'react-router-dom';

// 공장 등록 페이지
// 주의! isUpdate가 true 인 경우 수정 페이지로 사용
const BasicFactoryRegister = () => {
  const history = useHistory();
  const [document, setDocument] = useState<any>({id:'', value:'(선택)'});

  const [essential,setEssential] = useState<any[]>([]);
  const [optional,setOptional] = useState<any[]>([]);

  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [pk, setPk] = useState<string>('');

  const [inputData, setInputData] = useObjectInput('CHANGE', {
    name:'',
    description:'',
    location: {
      postcode: '',
      roadAddress:'',
      detail:'',
    },

  });
  useEffect(()=>{

    if(getParameter('pk') !== "" ){
      setPk(getParameter('pk'))
      setIsUpdate(true)
      getData()
    }

  },[])

  const getData = useCallback(async()=>{

    const res = await getRequest(`http://203.234.183.22:8299/api/v1/factory/load?pk=` + getParameter('pk'), getToken(TOKEN_NAME))

    if(res === false){
      //TODO: 에러 처리

    }else{
      if(res.status === 200 || res.status === "200"){
          const data = res.results;
          setInputData('name', data.name)
          setInputData('location', data.location)
          setInputData('description', data.description)
      }else{
        //TODO:  기타 오류
      }
    }
  },[pk, optional, essential, inputData ])


  const onsubmitFormUpdate = useCallback(async(e)=>{
    e.preventDefault();

    const data = {
      pk: getParameter('pk'),
      address: inputData.location,
      name: inputData.name,
      description: inputData.description,
      info_list: JsonStringifyList(essential, optional)
    };
    const res = await postRequest('http://203.234.183.22:8299/api/v1/factory/update', data, getToken(TOKEN_NAME))

    if(res === false){
     ////alert('////alert('[SERVER ERROR] 요청을 처리 할 수 없습니다.')')

    }else{
      if(res.status === 200){
          //alert('성공적으로 수정 되었습니다');
          history.goBack()
      }else{
        ////alert('요청을 처리 할 수 없습니다 다시 시도해주세요.')
      }
    }

  },[pk, optional, essential, inputData ])

  const onsubmitForm = useCallback(async(e)=>{
    e.preventDefault();



    const data = {
      document_pk: document.pk,
      name: inputData.name,
      address: inputData.location,
      description: inputData.description,
      info_list: JsonStringifyList(essential, optional)
    };

    const res = await postRequest('http://203.234.183.22:8299/api/v1/factory/register', data, getToken(TOKEN_NAME))


    if(res === false){
     ////alert('////alert('[SERVER ERROR] 요청을 처리 할 수 없습니다.')')

    }else{
      if(res.status === 200){
          //alert('성공적으로 등록 되었습니다');
          history.push('/basic/list/factory')
      }else{
        ////alert('요청을 처리 할 수 없습니다 다시 시도해주세요.')
      }
    }

  },[pk, optional, essential, inputData , document])




  return (
    <DashboardWrapContainer index={'basic'}>

        <InnerBodyContainer>
            <Header title={isUpdate ? '공장 정보수정' : '공장 정보등록'}/>
            <WhiteBoxContainer>
              {
                // document.id !== '' || isUpdate == true?
                <form onSubmit={isUpdate ? onsubmitFormUpdate : onsubmitForm} >
                  <ListHeader title="필수 항목"/>
                  <NormalInput title={'공장명'}  value={inputData.name} onChangeEvent={(input)=>setInputData(`name`, input)} description={'공장 이름을 입력해주세요.'}/>
                  <NormalAddressInput title={'공장 주소'} value={inputData.location} onChangeEvent={(input)=>setInputData(`location`, input)}  />
                  <br/>
                  <ListHeader title="선택 항목"/>
                  <NormalInput title={'설명'}  value={inputData.description} onChangeEvent={(input)=>setInputData(`description`, input)} description={'(비고)'}/>
                  {/*<br/>*/}
                  {/*<DocumentFormatInputList*/}
                  {/*    pk={!isUpdate ? document.pk : undefined}*/}
                  {/*    loadDataUrl={isUpdate? `http://203.234.183.22:8299/api/v1/factory/load?pk=${pk}` :''}*/}
                  {/*    onChangeEssential={setEssential} onChangeOptional={setOptional}*/}
                  {/*/>*/}

                  <RegisterButton name={isUpdate ? '수정하기' : '등록하기'} />
                </form>
                // :
                // <SelectDocumentForm category={5} onChangeEvent={setDocument}/>
              }
            </WhiteBoxContainer>

        </InnerBodyContainer>

      </DashboardWrapContainer>

  );
}
const FullPageDiv = Styled.div`
  width: 100%;
  height: 100%;
  color: white;
  background-color: ${BG_COLOR_SUB2}
`


export default BasicFactoryRegister;
