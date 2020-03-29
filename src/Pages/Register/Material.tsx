import React, { useEffect, useState, useContext , useCallback} from 'react';
import Styled, { withTheme } from 'styled-components'
import {BASE_URL, BG_COLOR, BG_COLOR_SUB, SYSTEM_NAME, BG_COLOR_SUB2, COMPANY_LOGO, POINT_COLOR, MAX_WIDTH, TOKEN_NAME} from '../../Common/configset'
import DashboardWrapContainer from '../../Containers/DashboardWrapContainer';
import Header from '../../Components/Text/Header';
import WhiteBoxContainer from '../../Containers/WhiteBoxContainer';
import NormalInput from '../../Components/Input/NormalInput';
import RegisterButton from '../../Components/Button/RegisterButton';
import NormalFileInput from '../../Components/Input/NormalFileInput';
import { getToken } from '../../Common/tokenFunctions';
import SubNavigation from '../../Components/Navigation/SubNavigation';
import { ROUTER_REGISTER, ROUTER_LIST } from '../../Common/routerset';
import InnerBodyContainer from '../../Containers/InnerBodyContainer';
import { getParameter, postRequest, getRequest } from '../../Common/requestFunctions';
import InputContainer from '../../Containers/InputContainer';
import DropdownInput from '../../Components/Input/DropdownInput';
import CustomIndexInput from '../../Components/Input/CustomIndexInput';
import SmallButton from '../../Components/Button/SmallButton';
import AddInput from '../../Components/Input/AddInput';
import FullAddInput from '../../Components/Input/FullAddInput';
import NormalNumberInput from '../../Components/Input/NormalNumberInput';
import TextList from '../../Components/List/TextList';
import SearchModalContainer from '../../Containers/SearchModalContainer';
import SearchInput from '../../Components/Input/SearchInput';
import AddList from '../../Components/List/AddList';
import { dataSet } from '../../Common/dataset';
import SearchedList from '../../Components/List/SearchedList';
interface IInfo {
  title: string,
  value: string,
}

// 자재등록 페이지
// 주의! isUpdate가 true 인 경우 수정 페이지로 사용
const RegisterMaterial = () => {

  const [pk, setPk] = useState<string>('');
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [made, setMade] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [spec, setSpec] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [info, setInfo] = useState<IInfo[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [molds, setMolds] = useState<IMold[]>([]);
  const [type, setType] = useState<string>('원재료');
  const indexList = [
    '원재료','최종생산품','중간제품','기타'
  ]

  //검색관련
  const [isPoupup, setIsPoupup] = useState<boolean>(false);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [checkList, setCheckList] = useState<IMold[]>([]);
  const [list, setList] = useState<IMold[]>([]);
  const [searchList, setSearchList] = useState<IMold[]>([]);

  useEffect(()=>{
    //setIsSearched(true)
    //setSearchList(dataSet.moldList);
    if(getParameter('pk') !== "" ){
        setPk(getParameter('pk'))
        //alert(`수정 페이지 진입 - pk :` + param)
        setIsUpdate(true)
        getData()
    }

  },[]) 

  /**
   * getData()
   * 자재 정보 수정을 위한 조회
   * @param {string} url 요청 주소
   * @param {string} pk 자재 pk
   * @returns X 
   */
  const getData = useCallback(async()=>{
    
    const res = await getRequest('http://211.208.115.66:8088/api/v1/material/view?pk=' + getParameter('pk'), getToken(TOKEN_NAME))

    if(res === false){
      //TODO: 에러 처리
    }else{
      if(res.status === 200){
         const data = res.results;
         
          if(data.material_type === 0){
            setType('원재료');
          }else if(data.material_type === 1){
            setType('최종생산품');
          }else if(data.material_type === 2){
            setType('중간제품');
          }else {
            setType('기타');
          }

         setName(data.material_name);
         setMade(data.distributor);
         setCode(data.material_code);
         setSpec(data.material_spec);
         setPk(data.pk);
         setInfo(data.info_list);
         setList(data.molds);
         setAmount(data.stock)
      }else if(res.status === 1001 || res.data.status === 1002){
        //TODO:  아이디 존재 확인
      }else{
        //TODO:  기타 오류
      }
    }
  },[pk, made, code, info, spec, name, molds, list]);

  /**
   * onsubmitForm()
   * 자재 정보 등록
   * @param {string} url 요청 주소
   * @param {string} name 이름
   * @param {array} info 항목 리스트
   * @param {string} made 유통사
   * @param {string} spec 종류
   * @param {string} code 코드
   * @returns X 
   */
  const onsubmitForm = useCallback(async(e)=>{
    e.preventDefault();
     //TODO: 지울것
      //alert(info)
     if(name == "" ){
       alert('자재 이름은 필수 항목입니다. ')
       return;
     }

     let typeNumber ;
     if(type === '원재료'){
        typeNumber = 0;
      }else if(type === '최종생산품'){
        typeNumber = 1;
      }else if(type === '중간제품'){
        typeNumber = 2;
      }else {
        typeNumber = 9;
      }
      let moldPk = new Array();
      if(list.length > 0){
        moldPk.push(list[0].pk)
      }
      let infoString ;
    if(info.length > 0){
      infoString = JSON.stringify(info)
    }
    //alert('테스트 : 전송 - ' + amount + code + name + info + made + spec + info );
    //return;
    const data = {
        material_name: name,
        material_code: code,
        material_spec: spec,
        material_type: typeNumber,
        stock: amount,
        molds: moldPk,
        distributor: made,
        info_list : infoString
    }

    const res = await postRequest('http://211.208.115.66:8088/api/v1/material/register' + pk, data, getToken(TOKEN_NAME))
    
    if(res === false){
      //TODO: 에러 처리
    }else{
      if(res.status === 200){
         alert('성공적으로 등록 되었습니다')
         setName('')
         setCode('')
         setSpec('')
         setAmount(0)
         setType('원재료')
         setMade('')
         setInfo([])
         setMolds([])
      }else{
        alert('등록 실패하였습니다. 잠시후에 다시 시도해주세요.')
        //TODO:  기타 오류
      }
    }

  },[made, code,amount, name, spec,info, pk, molds])


  /**
   * onsubmitFormUpdate()
   * 자재 정보 수정
   * @param {string} url 요청 주소
   * @param {string} pk pk
   * @param {string} name 이름
   * @param {array} info 항목 리스트
   * @param {string} made 유통사
   * @param {string} spec 종류
   * @param {string} code 코드
   * @returns X 
   */
  const onsubmitFormUpdate = useCallback(async(e)=>{
    e.preventDefault();
     //TODO: 지울것
    //alert('테스트 : 전송 - ' + pk +  code + name + info + made + spec + info );
    //return;
 
    let typeNumber ;
    if(type === '원재료'){
       typeNumber = 0;
     }else if(type === '최종생산품'){
       typeNumber = 1;
     }else if(type === '중간제품'){
       typeNumber = 2;
     }else {
       typeNumber = 9;
     }

     let infoString ;
     if(info.length > 0){
       infoString = JSON.stringify(info)
     }
     let moldPk = new Array();
      if(list.length > 0){
        moldPk.push(list[0].pk)
      }
    const data = {
        pk: pk,
        material_name: name,
        material_code: code,
        material_spec: spec,
        stock: amount,
        material_type: typeNumber,
        distributor: made,
        info_list : infoString,
        molds: moldPk
    }

    const res = await postRequest('http://211.208.115.66:8088/api/v1/material/update', data, getToken(TOKEN_NAME))

    if(res === false){
      //TODO: 에러 처리
    }else{
      if(res.status === 200){
         alert('성공적으로 수정 되었습니다')
      }else{
        //TODO:  기타 오류
      }
    }

  },[made, code, name, spec, info, pk,amount,list])

/**
   * onClickSearch()
   * 금형 키워드 검색
   * @param {string} url 요청 주소
   * @param {string} keyword 검색 키워드
   * @returns X 
   */
  const onClickSearch = useCallback(async(e)=>{
  
    e.preventDefault();
    if(keyword  === '' || keyword.length < 2){
      alert('2글자 이상의 키워드를 입력해주세요')

      return;
    } 
    setIsSearched(true)

    const res = await getRequest('http://211.208.115.66:8088/api/v1/mold/search?keyword=' + keyword, getToken(TOKEN_NAME))

    if(res === false){
      //TODO: 에러 처리
    }else{
      if(res.status === 200){
         const results = res.results;
      
         setSearchList(results);
      }else{
        //TODO:  기타 오류
      }
    }
  },[keyword])
  return (
      <DashboardWrapContainer>
        <SubNavigation list={isUpdate ? ROUTER_LIST :ROUTER_REGISTER}/>
        <InnerBodyContainer>
            <Header title={isUpdate ? '자재 정보수정' : '자재 정보 등록 (원자재 / 반제품 / 완제품)'}/>
            <WhiteBoxContainer>
             <form onSubmit={isUpdate ? onsubmitFormUpdate : onsubmitForm} >
             <NormalInput title={'자재 이름'} value={name} onChangeEvent={setName} description={'이름을 입력하세요'} />
             <NormalInput title={'자재 코드'} value={code} onChangeEvent={setCode} description={'제조번호를 입력하세요'} />
             <DropdownInput title={'자재 종류'} target={type} contents={indexList} onChangeEvent={(v)=>setType(v)} />
             {/* 팝업 여는 버튼 + 금형 추가 */}
             <AddInput title={'사용 금형'} icType="solo" onlyOne={list.length > 0 ? true: false} onChangeEvent={()=>{
                  setIsPoupup(true);  
                  setCheckList(list); 
                  setKeyword('')}
                  }>
                {
                  list.map((v: IMold, i)=>{ 
                    return ( 
                        <TextList key={i} 
                        onClickSearch={()=>{
                          setIsPoupup(true);
                          setKeyword(''); 
                          setIsSearched(false);
                        }}
                        onClickEvent={()=>{
                          setList([])
                        }} 
                        title={v.mold_code !== undefined ? v.mold_code : ''} name={v.mold_name}/>                    
                    )
                  })
                }
                </AddInput>
                
             <NormalInput title={'스펙'} value={spec} onChangeEvent={setSpec} description={'스펙을 입력하세요'} />
             <NormalInput title={'유통사'} value={made} onChangeEvent={setMade} description={'유통사를 입력하세요'} />
             <NormalNumberInput title={'재고 수량'} value={amount} onChangeEvent={setAmount} description={'재고량을 입력하세요'} />
             
             
             <FullAddInput title={'자유 항목'} onChangeEvent={()=>{
               const tempInfo = info.slice();
               tempInfo.push({title:`자유 항목 ${info.length + 1}`, value:""});
               setInfo(tempInfo)
             }}>
              {
                info.map((v: IInfo, i)=>{
                  return(
                      <CustomIndexInput index={i} value={v} 
                      onRemoveEvent={()=>{
                        const tempInfo = info.slice();
                        tempInfo.splice(i, 1)
                        setInfo(tempInfo)
                      }} 
                      onChangeEvent={(obj: IInfo)=>{
                        const tempInfo = info.slice();
                        tempInfo.splice(i, 1, obj)
                        setInfo(tempInfo)
                      }} 
                      />
                  )
                })
              }
              </FullAddInput>
      
              <RegisterButton name={isUpdate ? '수정하기' : '등록하기'} /> 
              </form>
            </WhiteBoxContainer>
            {/* 검색창 */}
            <SearchModalContainer 
              onClickEvent={ //닫혔을 때 이벤트 
                ()=>{
                setIsPoupup(false); 
                setList(checkList); 
                setKeyword('')}
            }
            isVisible={isPoupup} onClickClose={()=>{setIsPoupup(false)}} title={'금형 선택'} >
              <SearchInput description={'금형을 검색해주세요'} value={keyword} onChangeEvent={(e)=>setKeyword(e.target.value)} onClickEvent={onClickSearch}/>
                <div style={{width: '100%', marginTop:20}}>
                  {
                    isSearched ?
                    searchList.map((v: IMold, i)=>{ 
                      return ( 
                    
                          <SearchedList key={i} pk={v.pk} widths={['40%', '35%', '25%']} contents={[v.mold_name, v.mold_label !== undefined ? v.mold_label : '', v.mold_code !== undefined ? v.mold_code : '']} isIconDimmed={false} isSelected={checkList.find((k)=> k.pk === v.pk)? true : false } 
                             onClickEvent={()=>{
                              const tempList = checkList.slice()
                              tempList.splice(0, 1, v)
                              setCheckList(tempList)
                            }} 
                          />
                         
                        )
                    })
                    :
                    null
                  }
                </div>
            </SearchModalContainer>
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


export default RegisterMaterial;