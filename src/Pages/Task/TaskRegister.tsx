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

// 작업 지시서 등록
const TaskRegister = () => {

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
  const onClickFilter = useCallback(async(filter:number)=>{
    setOption(filter)
    alert(`선택 테스트 : 필터선택 - filter : ${filter}` )
    return;
    const results = await getRequest(BASE_URL + '',getToken(TOKEN_NAME))

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
  const onClickSearch = useCallback(async()=>{
  
   
    alert('테스트 : keyword - ' + keyword);
    return;
    if(keyword  === '' || keyword.length < 2){
      alert('2글자 이상의 키워드를 입력해주세요')

      return;
    } 
    setIsSearched(true)

    const res = await getRequest(BASE_URL + '/api/v1/mold/search/' + keyword, getToken(TOKEN_NAME))

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
            <Header title={ isUpdate ? '작업지시서 수정' :'작업지시서 등록'}/>
          </div>
          <WhiteBoxContainer>
            <div style={{borderBottom:'solid 0.5px #d3d3d3'}}>
              <PlaneInput value={title} description={'작업지시서 제목 입력'} onChangeEvent={setTitle} fontSize={'26px'}/>
              <PlaneInput value={description} description={'상세 업무내용 작성 (200자 미만)'} onChangeEvent={setDescription} fontSize={'14px'}/>
            </div>
             {/* 팝업 여는 버튼 + 기계추가 */}
             <AddInput icType={'solo'} title={'기계 / 라인 선택'} onChangeEvent={()=>{
                  setIsPoupup(true);  
                  setCheckList(list); 
                  setKeyword('')}
                  }> 
                   
                {
                  list.map((v, i)=>{ 
                    return ( 
                        <SearchedList key={i} 
                          pk={v.pk}  option={v.end_date !== '' ? '작업완료 : ' + v.end_date : ''} widths={['15%', '60%']} type={'remove'} contents={[v.group, v.name]} isIconDimmed={false} isSelected={false }
                          onClickEvent={()=>{
                          const tempList = list.slice()
                          const idx = list.indexOf(v)
                          tempList.splice(idx, 1)
                          setList(tempList)
                        }} 
                        />                    
                    )
                  })
                }
     
                </AddInput>
         
              {/* 팝업 여는 버튼 + 생상품 추가 */}
              <AddInput icType={'solo'} title={'생산제품'} onChangeEvent={()=>{
                  setIsPoupup2(true);  
                  setCheckList2(list2); 
                  setKeyword('')}
                  }> 
                   
                {
                  list2.map((v, i)=>{ 
                    return ( 
                        <SearchedList key={i} 
                          pk={v.pk} widths={['15%', '15%', '70%']} contents={[v.product_code, v.molds, v.product_name]} type={'remove'} isIconDimmed={false} isSelected={false }
                          onClickEvent={()=>{
                          const tempList = list2.slice()
                          const idx = list2.indexOf(v)
                          tempList.splice(idx, 1)
                          setList2(tempList)
                        }} 
                        />                    
                    )
                  })
                }
     
                </AddInput>
                <NormalNumberInput title={'생산목표량'} value={amount} onChangeEvent={setAmount} description={'생산목표량을 입력하세요'} />
                <DateRangeInput title={'작업 목표 기간'} end={end} start={start} onChangeEventEnd={setEnd} onChangeEventStart={setStart}/>
                <MemberInput
                    title={'등록자'}
                    isMultiRegistered={false}
                    target={{
                      pk: 'me',
                      name: User.name,
                      image: User.profile_img
                    }}
                />
                <MemberInput
                    title={'작업자'}
                    onChangeEvent={()=>{
                      setIsPoupup3(true);  
                      setWorker(check); 
                  
                      setKeyword('')
                    }}
                    isMultiRegistered={true}
                    target={worker!== null ? {
                      pk: worker.pk,
                      name: worker.name + ' ' + worker.appointment,
                      image: worker.profile_img
                    } : undefined}

                />
                <MemberInput
                    title={'공유자'}
                    onRemoveEvent={(idx: number)=>{
                        const tempList = referencerList.slice()
                        tempList.splice(idx, 1)
                        setReferencerList(tempList)
                    }}
                    onChangeEvent={()=>{
                      setIsPoupup4(true);  
                      setCheckList4(referencerList); 
                      setKeyword('')
                    }}
                    isMultiRegistered={false}
                    type={''}
                    contents={referencerList.map((v, i)=>{
                      return(
                        {
                          pk: v.pk,
                          name: v.name + ' ' + v.appointment,
                          image: v.profile_img
                        }
                      )
                    })}

                />
                <hr style={{border:'solid 0.5px #d3d3d3', marginBottom:14}}/>
                <NormalFileInput title={'파일 첨부'} name={''} thisId={'machinePhoto'} onChangeEvent={addFile} description={'(최대 8개, 10MB 미만의 파일)'} >
                {
                  fileList.map((v, i)=>{ 
                    return ( 
                        <SearchedList key={i} 
                          pk={v.pk} widths={['100%']} contents={[v.name]} type={'remove'} isIconDimmed={false} isSelected={false }
                          onClickEvent={()=>{
                          const tempList = fileList.slice()
                          const idx = fileList.indexOf(v)
                          tempList.splice(idx, 1)
                          setFileList(tempList)
                        }} 
                        />                    
                    )
                  })
                }
                {
                  oldFileList.map((v, i)=>{ 
                    return ( 
                        <SearchedList key={i} 
                          pk={v.pk} widths={['100%']} contents={[v.name]} type={'remove'} isIconDimmed={false} isSelected={false }
                          onClickEvent={()=>{
                          const tempList = fileList.slice()
                          const tempRemoveList = removefileList.slice()
                          const idx = fileList.indexOf(v)
                          tempList.splice(idx, 1)
                          tempRemoveList.push(v.pk)
                          setRemoveFileList(tempRemoveList)
                          setOldFileList(tempList)
                        }} 
                        />                    
                    )
                  })
                }
                </NormalFileInput>
                <RegisterButton name={isUpdate ? '수정하기' : '등록하기'} />   
          </WhiteBoxContainer>

           {/* 기계 라인 검색창 */}
           <SearchModalContainer 
              onClickEvent={ //닫혔을 때 이벤트 
                ()=>{
                setIsPoupup(false); 
                setList(checkList); 
                setKeyword('')}
            }
            isVisible={isPoupup} onClickClose={()=>{setIsPoupup(false)}} title={''} >
              <>
              <div className="p-bold" style={{width:'100%', position:'absolute', marginBottom:20, display:'flex', zIndex:4, top:0, left:0,  color:'black', justifyItems:'center', alignItems:'center',textAlign:'center', fontSize:14}}>
                  <div style={{ width:'50%', padding:9, backgroundColor: `${tab === tabList[0] ? '#f4f6fa' : POINT_COLOR} `}} onClick={()=>setTab(tabList[0])}>
                      <p>{tabList[0]}</p>
                  </div>
                  <div style={{ width:'50%', padding:9, backgroundColor: `${tab === tabList[1] ? '#f4f6fa' : POINT_COLOR} `}} onClick={()=>setTab(tabList[1])}>
                      <p>{tabList[1]}</p>
                  </div>
              </div>
              <br/> <br/> <br/>
              <SearchInput description={'키워드로 검색해주세요'} value={keyword} onChangeEvent={(e)=>setKeyword(e.target.value)} onClickEvent={()=>onClickSearch()}/>
                <div style={{width: '100%', marginTop:20}}>

                  {
                    !isSearched ?
                    searchList.map((v: IMachineLine, i)=>{ 
                      return ( 
                        
                          <SearchedList key={i} pk={v.pk} option={v.end_date !== '' ? '작업완료 : ' + v.end_date : ''} widths={['15%', '60%']} contents={[v.group, v.name]} isIconDimmed={false} isSelected={checkList.find((k)=> k.pk === v.pk)? true : false } 
                            onClickEvent={()=>{
                              const tempList = checkList.slice()
                              if(checkList.find((k, index)=> k.pk === v.pk) ){
                                  const idx = checkList.indexOf(v)
                                  tempList.splice(idx, 1)
                                  setCheckList(tempList)
                              }else{
                                  tempList.splice(0, 0, v)
                                  setCheckList(tempList)
                              }
                            }} 
       
                          />
                        )
                    })
                    :
                    null
                  }
                </div>
                </>
            </SearchModalContainer>
            {/* 생산제품 검색창 */}
           <SearchModalContainer 
              onClickEvent={ //닫혔을 때 이벤트 
                ()=>{
                setIsPoupup2(false); 
                setList2(checkList2); 
                setIsSearched(false);
                setKeyword('')}
            }
            isVisible={isPoupup2} onClickClose={()=>{setIsPoupup2(false)}} title={'생산제품 선택'} >
              <>
              <SearchInput description={'생산제품을 검색해주세요'} value={keyword} onChangeEvent={(e)=>setKeyword(e.target.value)} onClickEvent={()=>onClickSearch()}/>
                <div style={{width: '100%', marginTop:20}}>
                  {
                    !isSearched ?
                    searchList2.map((v: IProduct, i)=>{ 
                      return ( 
                        
                          <SearchedList key={i} pk={v.pk} widths={['15%', '15%', '70%']} contents={[v.product_code, v.molds, v.product_name]} isIconDimmed={false} isSelected={checkList2.find((k)=> k.pk === v.pk)? true : false } 
                            onClickEvent={()=>{
                              const tempList = checkList2.slice()
                              if(checkList2.find((k, index)=> k.pk === v.pk) ){
                                  const idx = checkList2.indexOf(v)
                                  tempList.splice(idx, 1)
                                  setCheckList2(tempList)
                              }else{
                                  tempList.splice(0, 0, v)
                                  setCheckList2(tempList)
                              }
                            }} 
       
                          />
                        )
                    })
                    :
                    null
                  }
                </div>
                </>
            </SearchModalContainer>


            {/* 작업자 검색창 */}
           <SearchModalContainer 
              onClickEvent={ //닫혔을 때 이벤트 
                ()=>{
                setIsPoupup3(false); 
                setWorker(check); 
                setIsSearched(false);
                setKeyword('')}
            }
            isVisible={isPoupup3} onClickClose={()=>{setIsPoupup3(false)}} title={'작업자 선택'} >
              <>
              <SearchInput description={'작업자를 검색해주세요'} value={keyword} onChangeEvent={(e)=>setKeyword(e.target.value)} onClickEvent={()=>onClickSearch()}/>
                <div style={{width: '100%', marginTop:20}}>
                  {
                    !isSearched ?
                    searchList3.map((v: IMemberSearched, i)=>{ 
                      return ( 
                        
                          <SearchedList key={i} pk={v.pk} widths={['100%']} contents={[v.name + ' ' + v.appointment]} isIconDimmed={false} isSelected={check === v ? true : false } 
                            onClickEvent={()=>{
                              check === v ?
                              setCheck(null)
                              :
                              setCheck(v)
                            }} 
       
                          />
                        )
                    })
                    :
                    null
                  }
                </div>
                </>
            </SearchModalContainer>

            {/* 참조자 검색창 */}
           <SearchModalContainer 
              onClickEvent={ //닫혔을 때 이벤트 
                ()=>{
                setIsPoupup4(false); 
                setReferencerList(checkList4);
                setIsSearched(false);
                setKeyword('')}
            }
            isVisible={isPoupup4} onClickClose={()=>{setIsPoupup4(false)}} title={'공유자 선택'} >
              <>
              <SearchInput description={'공유자를 검색해주세요'} value={keyword} onChangeEvent={(e)=>setKeyword(e.target.value)} onClickEvent={()=>onClickSearch()}/>
                <div style={{width: '100%', marginTop:20}}>
                  {
                    !isSearched ?
                    searchList3.filter((f)=>worker == null  || f.pk !== worker.pk).map((v: IMemberSearched, i)=>{ 
                      return ( 
                        
                          <SearchedList key={i} pk={v.pk} widths={['100%']} contents={[v.name + ' ' + v.appointment]} isIconDimmed={false}  isSelected={checkList4.find((k)=> k.pk === v.pk)? true : false } 
                           onClickEvent={()=>{
                              const tempList = checkList4.slice()
                              if(checkList4.find((k, index)=> k.pk === v.pk) ){
                                  const idx = checkList4.indexOf(v)
                                  tempList.splice(idx, 1)
                                  setCheckList4(tempList)
                              }else{
                                  tempList.splice(0, 0, v)
                                  setCheckList4(tempList)
                              }
                            }} 
       
                          />
                        )
                    })
                    :
                    null
                  }
                </div>
                </>
            </SearchModalContainer>


        </InnerBodyContainer>
      </DashboardWrapContainer>
      
  );
}



export default TaskRegister;