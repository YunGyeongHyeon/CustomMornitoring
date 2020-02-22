import React, { useEffect } from 'react';
import Styled from 'styled-components'
import {BG_COLOR, BG_COLOR_SUB, SYSTEM_NAME, BG_COLOR_SUB2, BI_LOGO, POINT_COLOR, MAX_WIDTH} from '../../Common/configset'
import Logo from '../../Assets/Images/img_logo.png'

//페이지 헤더
interface IProps{
    title: string,
}
const Header = ({title}: IProps) => {
  useEffect(()=>{
   
  },[])

  return (
    
        <div style={{textAlign:'left', }}>
            <p className="p-bold" style={{fontSize: 20, marginBottom:15, marginTop:75}}>{title}</p>
        </div>
      
  );
}



export default Header;