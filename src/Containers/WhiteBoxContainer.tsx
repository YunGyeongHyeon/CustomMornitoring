import React, { useEffect } from 'react';
import Styled from 'styled-components'
import {BG_COLOR, BG_COLOR_SUB, SYSTEM_NAME, BG_COLOR_SUB2, BI_LOGO, POINT_COLOR, MAX_WIDTH} from '../Common/configset'
import Logo from '../../Assets/Images/img_logo.png'
import DashboardNavigation from '../Components/Navigation/DashboardNavigation'
import Footer from '../Components/Footer/WelcomeFooter';
import SearchBar from '../Components/Navigation/SearchBar';

//대시보드를 감싸는 wrap 박스 

const WhiteBoxContainer = ({children}: any) => {
  useEffect(()=>{
   
  },[])

  return (
    <>
    <WhiteWrapDiv >
      <div style={{padding:30, width: '100%', textAlign:'left', color:'#252525'}}>
        {children}
      </div>
    </WhiteWrapDiv>    
    </>
      
  );
}

const WhiteWrapDiv = Styled.div`
    background-color: #efefef;
    display: flex;
    width: 100%;
    background-color: #efefef;
    
`

export default WhiteBoxContainer;