import React, {useCallback, useEffect, useRef, useState} from 'react';
import Styled from 'styled-components'
import {POINT_COLOR, TOKEN_NAME} from '../../Common/configset'
import Calendar from 'react-calendar';
import moment from 'moment';
import {getToken} from '../../Common/tokenFunctions';
import {getRequest} from '../../Common/requestFunctions';

interface IProps{
  setListEvent: any,
    searchUrl: string,
    targetPk: string,
}
const DatePickerBox = ({setListEvent , searchUrl, targetPk}: IProps) => {
    const [to, setTo] = useState<string>(moment().format("YYYY-MM-DD"));
    const [from, setFrom] = useState<string>(moment().add(-7,"days").format("YYYY-MM-DD"));
    const [list, setList] = useState<any[]>([]);
    const [type, setType] = useState<number>(999);
  useEffect(()=>{
    //setTo(moment().format("YYYY-MM-DD"));
    //setFrom(moment().add(-30,"days").format("YYYY-MM-DD"));

    onClickSearch()
  },[])

  /**
   * onClickSearch()
   * 검색
   * @returns X
   */
  const onClickSearch = useCallback(async ()=>{


    const results = await getRequest(searchUrl+ 'to=' + to +'&from='  + from +'&pk=' + targetPk, getToken(TOKEN_NAME))

    if(results === false){
     ////alert('해당 기간 데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
      setList([])
    }else{
      if(results.status === 200){
        setList(results.results)
        setListEvent(results.results);
      }else{
       ////alert('해당 기간 데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
        setList([])
      }
    }
  },[to, from])
  const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);


    const handleClickBtn = () => {
        setIsOpen(!isOpen);
    };
    const handleClickBtn2 = () => {
        setIsOpen2(!isOpen2);
    };
  return (
        <Box>
            <span className="p-bold" style={{marginRight: 12}}>기간 설정  </span>
            <InputBox onClick={()=>handleClickBtn2()}>{from === ""|| from === undefined ? "(전체 기간)" : from} </InputBox>

             <span> ~ </span>
             <InputBox onClick={()=>handleClickBtn()}>{to === ""|| to === undefined ? "(전체 기간)" : to} </InputBox>

             <div style={{display:'inline-block', alignItems:'center',cursor:'pointer',  marginLeft: 24}}>
             <InputButton onClick={()=>{
                setTo(moment().format("YYYY-MM-DD"));
                setFrom(moment().add(-91,"days").format("YYYY-MM-DD"));
             }}>최근 3개월 </InputButton>
             <InputButton onClick={()=>{
                setTo(moment().format("YYYY-MM-DD"));
                setFrom(moment().add(-30,"days").format("YYYY-MM-DD"));
            }}>최근 1개월 </InputButton>
             <InputButton onClick={()=>{
              setTo(moment().format("YYYY-MM-DD"));
              setFrom(moment().add(-7,"days").format("YYYY-MM-DD"));
            }}>최근 1주 </InputButton>
             <InputButton  onClick={()=>{
                setTo(moment().format("YYYY-MM-DD"));
                 setFrom(moment().format("YYYY-MM-DD"));
            }}>오늘</InputButton>
             </div>
             <div style={{ display:'inline-block', float:'right'}}>
             <ButtonBox onClick={() => { onClickSearch()  }} >기간 조회</ButtonBox>

            </div>
            <div>
            {
                isOpen ?
                <div style={{marginTop:11, color:'black'}}>

                <Calendar
                className={'to'}
                onChange={(date)=>{
                    setTo(moment(String(date)).format("YYYY-MM-DD"));
                    handleClickBtn()
                }}
                value={to === "" ? moment().toDate() : moment(to).toDate() }
                 />
              </div>
              :
              null
            }
            {
                isOpen2 ?
                <div style={{marginTop:11, color:'black'}}>

                <Calendar
                className={'from'}
                onChange={(date)=>{
                    setFrom(moment(String(date)).format("YYYY-MM-DD"));
                    handleClickBtn2()
                }}
                value={from === "" ? moment().toDate() : moment(from).toDate() }
                 />
              </div>
              :
              null
            }

            </div>
        </Box>
  );
}
const ButtonBox = Styled.button`
    padding: 7px 18px 7px 18px;
    color: black;
    border-radius: 5px;
    background-color: ${POINT_COLOR};
    border: 0;
    font-size: 14px;
    font-weight: bold;
`
const InputBox = Styled.div`
    cursor: pointer;
    border: solid 0.5px #aaaaaa70;
    width: 140px;
    display: inline-block;
    color: #252525;
    padding: 4px;
    padding-left: 12px;
    background-color: white;
  

`



const InputButton = Styled.div`
    border: solid 0.5px #bbbbbb;
    text-align: center;
    min-width: 66px;
    margin-right: 6px;
    display: inline-block;
    color: #252525;
    padding: 4px;
    background-color: #ededed;

`
const Box = Styled.div`
    border-radius: 5px;
    padding: 24px 16px 24px 16px;
    text-align: left;
    font-size: 14px;
    color: #252525;
    margin-top: 8px;
    margin-bottom: 18px;
    background-color: #f4f6fa

`


export default DatePickerBox;
