import React, { useEffect } from 'react';
import Styled from 'styled-components'
import {BG_COLOR, BG_COLOR_SUB, SYSTEM_NAME, BG_COLOR_SUB2, COMPANY_LOGO, POINT_COLOR, MAX_WIDTH} from '../../Common/configset'
import Logo from '../../Assets/Images/img_logo.png'
import InputContainer from '../../Containers/InputContainer';
import IcButton from '../Button/IcButton';
import IC_MINUS from '../../Assets/Images/ic_minus.png'


//바코드 규칙 
interface IProps{
    title: string,
    value: any[],
    onChangeEvent: any,
    onRemoveEvent: any,
}
const BarcodeRulesInput = ({ title, value, onChangeEvent, onRemoveEvent}: IProps) => {
  useEffect(()=>{
   
  },[])

  return ( 
       
        <div style={{marginTop:17, marginBottom:17, display:'flex', alignItems:'center'}}>
            <p className="p-bold" style={{width: '20%', fontSize:13, marginRight: 9}} >{title}</p> 
            <InputBox style={{width: 'calc(100% - 40px)'}} type="number" value={value} onChange={ (e)=>onChangeEvent(e.target.value) } placeholder={'내용을 입력하세요.'}/>
            <img src={IC_MINUS} style={{width: 20, height:20, marginLeft: 8,  cursor:'pointer'}} onClick={onRemoveEvent}/>
        </div>

  );
}

const InputBox = Styled.input`
    border: solid 0.5px #d3d3d3;
    font-size: 14px;
    padding: 7px;
    padding-left: 10px;
    background-color: #f4f6fa;
`

const Wrapper = Styled.div`
    margin-top: 17px,
    margin-bottom: 17px,
    display:
    marginBottom:17, display:'flex', alignItems:'center'

`

export default BarcodeRulesInput;