import React, { useEffect, useRef, useState, useContext , useCallback} from 'react';
import Styled, { withTheme } from 'styled-components'
import {BASE_URL, BG_COLOR, BG_COLOR_SUB, SYSTEM_NAME, BG_COLOR_SUB2, COMPANY_LOGO, POINT_COLOR, MAX_WIDTH, TOKEN_NAME} from '../../Common/configset'
import Axios from 'axios';
import DashboardWrapContainer from '../../Containers/DashboardWrapContainer';
import Header from '../../Components/Text/Header';
import { getToken } from '../../Common/tokenFunctions';
import NormalTable from '../../Components/Table/NormalTable';
import 'react-dropdown/style.css'
import {dataSet} from '../../Common/dataset'
import BasicDropdown from '../../Components/Dropdown/BasicDropdown';
import SubNavigation from '../../Components/Navigation/SubNavigation';
import { ROUTER_LIST, ROUTER_MENU_LIST } from '../../Common/routerset';
import InnerBodyContainer from '../../Containers/InnerBodyContainer';
import { getRequest, postRequest } from '../../Common/requestFunctions';
import AddInput from '../../Components/Input/AddInput';
import SmallButtonLink from '../../Components/Button/SmallButtonLink';
import SearchInputSmall from '../../Components/Input/SearchInputSmall';
import InfoTable from '../../Components/Table/InfoTable';
import { machineStringToCode, machineCodeToName } from '../../Common/codeTransferFunctions';

// 기계 리스트
const MachineList = () => {

  const [list, setList] = useState<IMachine[]>([]);
  const [option, setOption] = useState(0);
  const [keyword, setKeyword] = useState<string>('');

  const optionList = [
    "등록순", "기계이름 순", "기계종류 순", "기계번호 순", "제조사 순"
  ]
  const index = {
    machine_name:'기계 이름',
    machine_label:'기계 종류',
    manufacturer:'제조사', 
    manufacturer_code:'제조 번호', 
  }


   /**
   * getSearchList()
   * 목록 검색
   * @param {string} url 
   * @returns X
   */
  const getSearchList = useCallback(async (e)=>{
    e.preventDefault();
    const results = await getRequest('http://211.208.115.66:8091/api/v1/machine/list?keyword='+ keyword +'&orderBy=' + option, getToken(TOKEN_NAME))

    if(results === false){
      alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
    }else{
      if(results.status === 200){
        setList(results.results)
        setKeyword('')
      }else{
        alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
      }
    }
  },[list, option, keyword])


   /**
   * getList()
   * 목록 불러오기
   * @param {string} url 
   * @returns X
   */
  const getList = useCallback(async ()=>{
   
    const results = await getRequest('http://211.208.115.66:8091/api/v1/machine/list?keyword='+ keyword +'&orderBy=' + option, getToken(TOKEN_NAME))

    
    if(results === false){
      alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
    }else{
      if(results.status === 200){
        setList(results.results)
      }else{
        alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
      }
    }
  },[list, keyword, option])



  /**
   * onClickFilter()
   * 리스트 필터 변경
   * @param {string} filter 필터 값
   * @returns X
   */
  const onClickFilter = useCallback(async (filter:number)=>{
    setOption(filter)
    //alert(`선택 테스트 : 필터선택 - filter : ${filter}` )
    
    const results = await getRequest('http://211.208.115.66:8091/api/v1/machine/list?keyword='+ keyword +'&orderBy=' + option, getToken(TOKEN_NAME))

    if(results === false){
      alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
    }else{
      if(results.status === 200){
        setList(results.results)
      }else{
        alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
      }
    }
  },[option, list, keyword])

  useEffect(()=>{
    getList()

  },[])
 
  

  const onClickModify = useCallback((id)=>{

    console.log('--select id : ' + id)
    window.location.href=`/update/machine?pk=${id}`
  
  },[])


  const onClickDelete = useCallback(async (id)=>{

    const results = await postRequest('http://211.208.115.66:8091/api/v1/machine/delete', {pk:id}, getToken(TOKEN_NAME))
    const tg = id;
    console.log('--select id : ' + id)
    if(results === false){
      alert('요청을 처리 할 수없습니다. 잠시후 다시 이용하세요.')
    }else{
      if(results.status === 200 || results.status === "200"){
        alert('해당 데이터가 성공적으로 삭제되었습니다.')
        setList(list.filter(v => v.pk !== tg))
      }else{
        alert('요청을 처리 할 수없습니다. 잠시후 다시 이용하세요.')
      }
    }
    
  
  },[list])

  return (
      <DashboardWrapContainer index={0}>
        <SubNavigation list={ROUTER_MENU_LIST[0]}/>
        <InnerBodyContainer>     
          <div style={{position:'relative'}}>
            <Header title={`기계 기본정보 (${list.length})`}/>
            <div style={{position:'absolute',display:'inline-block',top:0, right:0, zIndex:4}}>           
              <SmallButtonLink name="+ 등록하기" link="/register/machine"/> 
              <BasicDropdown select={optionList[option]} contents={optionList} onClickEvent={onClickFilter}/>
            </div>
          </div>
          <SearchInputSmall 
                description={'검색어 입력'} 
                value={keyword} 
                onChangeEvent={(e)=>{console.log('load...');setKeyword(e.target.value)}}
                onClickEvent={getSearchList}
                />
          <InfoTable indexList={index} type={'machine'} pkKey={'pk'} typeKey={'machine_label'} typeChanger={machineCodeToName} onClickLinkUrl="/update/machine?pk=" contents={list} onClickRemove={onClickDelete}/>
        </InnerBodyContainer>
      </DashboardWrapContainer>
      
  );
}



export default MachineList;

