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
import FullAddInput from '../../Components/Input/FullAddInput';
import CustomIndexInput from '../../Components/Input/CustomIndexInput';
import {getSubMachineTypeList} from '../../Common/codeTransferFunctions';
import { uploadTempFile } from '../../Common/fileFuctuons';


// 주변장치 등록 페이지
// 주의! isUpdate가 true 인 경우 수정 페이지로 사용
const RegisterSubMachine = () => {

  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [pk, setPk] = useState<string>('');
  const [made, setMade] = useState<string>('');
  const [no, setNo] = useState<string>('');
  const [infoList, setInfoList] = useState<IInfo[]>([]);
  const [info, setInfo] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<number>(1); //1: 미스피드
  const [madeNo, setMadeNo] = useState<string>('');
  const [photoName, setPhotoName] = useState<string>('');
  const [file, setFile] = useState<any>();
  const [oldPhoto, setOldPhoto] = useState<string>('');
  const [path, setPath] = useState<string | null>(null);

  const indexList = getSubMachineTypeList('kor');

  useEffect(()=>{
    if(getParameter('pk') !== "" ){
      setPk(getParameter('pk'))
      //alert(`수정 페이지 진입 - pk :` + param)
      setIsUpdate(true)
      getData()
    }

  },[])

  
  /**
   * addFile()
   * 사진 등록
   * @param {object(file)} event.target.files[0] 파일
   * @returns X 
   */
  const addFile = async (event: any): Promise<void> => {
    console.log(event.target.files[0]);

    if(event.target.files[0] === undefined){
      setFile(null)
      setPath(null)
      setPhotoName("")
      return;
    }
    console.log(event.target.files[0].type);
    if(event.target.files[0].type.includes('image')){ //이미지인지 판별
      setFile(event.target.files[0])
      setPhotoName(event.target.files[0].name)
      console.log(file)
      const temp = await uploadTempFile(event.target.files[0]);
      if(temp ===false){
        console.log(temp)
       
        setFile(null)
        setPhotoName('')
        return
      }else{
        setPath(temp)
        return
      }
      
    }else{
      setPhotoName('')
      setFile(null)
      setPath(null)
      alert('이미지 형식만 업로드 가능합니다.')
    }
    
  }


  /**
   * getData()
   * 주변장치 정보 수정을 위한 조회
   * @param {string} url 요청 주소
   * @param {string} pk 장치 pk
   * @returns X 
   */
  const getData = useCallback(async()=>{
    
    const res = await getRequest('http://211.208.115.66:8088/api/v1/peripheral/view?pk=' + getParameter('pk'), getToken(TOKEN_NAME))

    if(res === false){
      //TODO: 에러 처리
    }else{
      if(res.status === 200){
         const data = res.results;
         setName(data.device_name);
         setMade(data.manufacturer);
         setNo(data.device_code);
         setPhotoName(data.device_photo);
         setInfo(data.manufacturer_detail);
         setPk(data.pk);
         setMadeNo(data.manufacturer_code);
         setType(data.device_label);
         setInfoList(data.info_list);
         setFile(null);
         setPath(null);
         //setInfoList(data.item_list)
      }else{
        //TODO:  기타 오류
      }
    }
  },[pk, made, no, info, type, name, file, infoList])

  /**
   * onsubmitFormUpdate()
   * 주변장치 정보 수정 요청
   * @param {string} url 요청 주소
   * @param {string} pk 장치 pk
   * @param {string} name 이름
   * @param {string} no 넘버
   * @param {object(file)} file 사진 파일
   * @param {string} info 상세정보
   * @param {string} made 제조정보
   * @param {string} type 종류
   * @param {string} madeNo 제조사넘버
   * @returns X 
   */
  const onsubmitFormUpdate = useCallback(async(e)=>{
    e.preventDefault();
    if(name === "" ){
      alert("이름은 필수 항목입니다. 반드시 입력해주세요.")
      return;
    }
    const data = {
      pk: getParameter('pk'),
      device_name: name,
      device_label: type,
      device_code: no,
      manufacturer: made,
      manufacturer_code: madeNo,
      manufacturer_detail: info,
      info_list : infoList.length > 0 ? JSON.stringify(infoList) : null,
      device_photo: path
    };


      const res = await postRequest('http://211.108.115.66:8088/api/v1/peripheral/update/' + pk, data, getToken(TOKEN_NAME))

      if(res === false){
        //TODO: 에러 처리
      }else{
        if(res.status === 200){
           alert('성공적으로 수정 되었습니다')
        }else if(res.status === 1001){
          //TODO:
        }else{
          //TODO:  기타 오류
        }
      }

  },[pk, made, no, name, type, info, file, photoName, madeNo, infoList, path])

  /**
   * onsubmitForm()
   * 장치 정보 등록
   * @param {string} url 요청 주소
   * @param {string} name 이름
   * @param {string} no 넘버
   * @param {string} info 상세정보
   * @param {string} made 제조정보
   * @param {string} type 종류
   * @param {string} madeNo 제조사넘버
   * @returns X 
   */
  const onsubmitForm = useCallback(async(e)=>{
    e.preventDefault();
     //TODO: 지울것
    //alert('테스트 : 전송 - ' + no + name + info + made + type + madeNo);
    //return;
    if(name === "" ){
      alert("이름은 필수 항목입니다. 반드시 입력해주세요.")
      return;
    }
    const data = {
      device_name: name,
      device_label: type,
      device_code: no,
      manufacturer: made,
      manufacturer_code: madeNo,
      manufacturer_detail: info,
      info_list : infoList.length > 0 ? JSON.stringify(infoList) : null,
      device_photo: path
    };

    const res = await postRequest('http://211.208.115.66:8088/api/v1/peripheral/register' + pk, data, getToken(TOKEN_NAME))

    if(res === false){
      alert('요청을 처리 할 수 없습니다 다시 시도해주세요.')
    }else{
      if(res.status === 200){
         alert('성공적으로 등록 되었습니다')
         setName('');
         setMade('');
         setNo('');
         setPhotoName('');
         setInfo('');
         setPk('');
         setMadeNo('');
         setType(1);
         setFile(null);
         setInfoList([]);
         setPath(null)
      }else{
        alert('요청을 처리 할 수 없습니다 다시 시도해주세요.')
      }
    }

  },[made, no, name, type, info, photoName,file, madeNo, infoList])

  return (
      <DashboardWrapContainer>
        <SubNavigation list={isUpdate ? ROUTER_LIST : ROUTER_REGISTER}/>
          <InnerBodyContainer>
            <Header title={isUpdate ? '주변장치 정보수정' : '주변장치 정보등록'}/>
            <WhiteBoxContainer>
            <form onSubmit={isUpdate ? onsubmitFormUpdate : onsubmitForm} >
                <NormalInput title={'주변장치 이름'} value={name} onChangeEvent={setName} description={'고객사가 보유한 장치의 이름을 입력하세요'} />
                <DropdownInput title={'주변장치 종류'} target={indexList[type]} contents={indexList} onChangeEvent={(v)=>setType(v)} />
                <NormalInput title={'주변장치 번호'} value={no} onChangeEvent={setNo} description={'고객사가 보유한 장치의 번호를 지정하세요'} />
                <NormalInput title={'제조사 '} value={made} onChangeEvent={setMade} description={'장치의 제조사명을 입력하세요'} />
                <NormalInput title={'제조사 번호'} value={madeNo} onChangeEvent={setMadeNo} description={'장치의 제조사가 발급한 제조사 번호를 입력하세요 (기계에 부착되어있음)'} />
                <NormalInput title={'제조사 상세정보'} value={info} onChangeEvent={setInfo} description={'장치의 제조사와 관련된 상세 정보를 자유롭게 작성하세요'} />
                
                {
                  isUpdate && oldPhoto !== "" ?
                  <InputContainer title={'사진'}>
                   <img src={oldPhoto} style={{height:120}}/>
                  </InputContainer>
                  :
                  null
                }
                <NormalFileInput title={isUpdate ?'사진 변경':'사진 등록'} name={photoName} thisId={'machinePhoto'} onChangeEvent={addFile} description={isUpdate ? '(업로드)' :'기계 사진을 찍어 올려주세요 (없을시 기본 이미지)'} />
                 {/* 자유항목 입력 창 */}
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
                <RegisterButton name={isUpdate ? '수정하기' : '등록하기'} />   
            
              </form>
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


export default RegisterSubMachine;