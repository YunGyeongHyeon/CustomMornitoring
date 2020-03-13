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
import moment from 'moment';
import BasicDropdown from '../../Components/Dropdown/BasicDropdown';
import SubNavigation from '../../Components/Navigation/SubNavigation';
import { ROUTER_LIST } from '../../Common/routerset';
import InnerBodyContainer from '../../Containers/InnerBodyContainer';
import { getRequest, getParameter } from '../../Common/requestFunctions';
import WhiteBoxContainer from '../../Containers/WhiteBoxContainer';
import InputContainer from '../../Containers/InputContainer';
import PlaneInput from '../../Components/Input/PlaneInput';
import AddInput from '../../Components/Input/AddInput';
import TextList from '../../Components/List/TextList';
import SearchModalContainer from '../../Containers/SearchModalContainer';
import SearchInput from '../../Components/Input/SearchInput';
import AddList from '../../Components/List/AddList';
import SearchedList from '../../Components/List/SearchedList';
import NormalInput from '../../Components/Input/NormalInput';
import DateRangeInput from '../../Components/Input/DateRangeInput';
import MemberInput from '../../Components/Input/MemberInput';
import NormalFileInput from '../../Components/Input/NormalFileInput';
import RegisterButton from '../../Components/Button/RegisterButton';
import NormalNumberInput from '../../Components/Input/NormalNumberInput';
import { useUser } from '../../Context/UserContext';

// 작업 지시서 내역
const TaskList = () => {

  const User = useUser();
  const [pk, setPk] = useState<string>('');
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [option, setOption] = useState(0);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount]= useState<number>(0);
  const [end, setEnd] = useState<string>(moment().format('YYYY-MM-DD HH:mm'));
  const [start, setStart] = useState<string>(moment().format('YYYY-MM-DD HH:mm'));
  const [fileList, setFileList] = useState<any[]>([])
  const [oldFileList, setOldFileList] = useState<any[]>([])
  const [removefileList, setRemoveFileList] = useState<any[]>([])

 //검색관련
 const [isPoupup, setIsPoupup] = useState<boolean>(false);
 const [isPoupup2, setIsPoupup2] = useState<boolean>(false);
 const [isSearched, setIsSearched] = useState<boolean>(false);
 const [keyword, setKeyword] = useState<string>('');
 const [checkList, setCheckList] = useState<IMachineLine[]>([]);
 const [list, setList] = useState<IMachineLine[]>([]);
 const [searchList, setSearchList] = useState<IMachineLine[]>([]);
 const [searchList2, setSearchList2] = useState<IProduct[]>([]);
 const [checkList2, setCheckList2] = useState<IProduct[]>([]);
 const [list2, setList2] = useState<IProduct[]>([]);

  //사람 관련
  const [worker, setWorker] = useState<IMemberSearched | null>(null);
  const [referencerList, setReferencerList] = useState<IMemberSearched[]>([]);
  const [searchList4, setSearchList4] = useState<IMemberSearched[]>([]);
  const [check, setCheck] = useState<IMemberSearched | null>(null);
  const [searchList3, setSearchList3] = useState<IMemberSearched[]>([]);
  const [checkList4, setCheckList4] = useState<IMemberSearched[]>([]);
  const [isPoupup3, setIsPoupup3] = useState<boolean>(false);
  const [isPoupup4, setIsPoupup4] = useState<boolean>(false);

 const tabList = [
   "기계", "라인"
 ]
 const [tab, setTab] = useState<string>(tabList[0]);

  const optionList = [
    "등록순", "기계이름 순", "기계종류 순", "기계번호 순", "제조사 순", "제조사 번호 순", "제조사 상세정보 순"
  ]
  const index = {
    machine_name:'기계 이름',
    machine_label:'기계 종류',
    machine_code:'기계 번호',
    manufacturer:'제조사', 
    manufacturer_code:'제조사 번호', 
    manufacturer_detail:'제조사 상세정보'
  }

  /**
   * onClickFilter()
   * 리스트 필터 변경
   * @param {string} filter 필터 값
   * @returns X
   */
  const onClickFilter = useCallback((filter:number)=>{
    setOption(filter)
    alert(`선택 테스트 : 필터선택 - filter : ${filter}` )
    return;
    const results = getRequest(BASE_URL + '',getToken(TOKEN_NAME))

    if(results === false){
      //TODO: 에러 처리
    }else{
      if(results.status === 200){
       
      }else if(results.status === 1001 || results.data.status === 1002){
        //TODO:  아이디 존재 확인
      }else{
        //TODO:  기타 오류
      }
    }
  },[option])

  useEffect(()=>{

    setSearchList(dataSet.searchedItem.lines)
    setSearchList2(dataSet.products)
    setSearchList3(dataSet.searchedMemmber)
    const param = getParameter('pk');
      if(param !== ""){
          setPk(param)
          alert(`수정 페이지 진입 - pk :` + param)
          setIsUpdate(true)
      }

  },[])

 
  /**
   * onClickSearch()
   * 금형 키워드 검색
   * @param {string} url 요청 주소
   * @param {string} keyword 검색 키워드
   * @returns X 
   */
  const onClickSearch = useCallback(()=>{
  
   
    alert('테스트 : keyword - ' + keyword);
    return;
    if(keyword  === '' || keyword.length < 2){
      alert('2글자 이상의 키워드를 입력해주세요')

      return;
    } 
    setIsSearched(true)

    const res = getRequest(BASE_URL + '/api/v1/mold/search/' + keyword, getToken(TOKEN_NAME))

    if(res === false){
      //TODO: 에러 처리
    }else{
      if(res.status === 200){
         const results = res.results;
         setKeyword('')
         setSearchList(results);
      }else if(res.status === 1001){
        //TODO:  오류 처리 
      }else{
        //TODO:  기타 오류
      }
    }
  },[keyword])

  

  const onClickModify = useCallback((id)=>{

    console.log('--select id : ' + id)

  },[])
  /**
   * addFile()
   * 파일 등록
   * @param {object(file)} event.target.files[0] 파일
   * @returns X 
   */
  const addFile = (event: any): void => {
    console.log(event.target.files[0]);

    if(fileList.length + oldFileList.length > 7){
      alert('파일 업로드는 8개 이하로 제한되어있습니다.')
      return;
    }

    if(event.target.files[0] === undefined){
      return;
    }
    console.log(event.target.files[0].type);
    if(event.target.files[0].size < 10485760){ //이미지인지 판별
      let tempFileLsit = fileList.slice();
      tempFileLsit.push(event.target.files[0])
      setFileList(tempFileLsit)
    }else{
      alert('10MB 이하의 파일만 업로드 가능합니다.')
      return;
    }
    
  }
  return (
      <DashboardWrapContainer>
        <InnerBodyContainer>
          <div style={{position:'relative'}}>
            <Header title={'작업지시서 내역'}/>
          </div>
         

        </InnerBodyContainer>
      </DashboardWrapContainer>
      
  );
}



export default TaskList;