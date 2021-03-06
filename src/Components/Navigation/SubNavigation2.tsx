import React, { useEffect } from 'react';
import Styled from 'styled-components'
import { BrowserRouter, Route, Switch ,Link} from 'react-router-dom';
import {BG_COLOR, BG_COLOR_SUB, SYSTEM_NAME, BG_COLOR_SUB2, COMPANY_LOGO, POINT_COLOR, MAX_WIDTH, SERVICE_TITLE} from '../../Common/configset'
import NavList from './NavList'
import { useUserDispatch } from '../../Context/UserContext';
import SubNavList from './SubNavList';
//대시보드 네비게이션


interface ILinkList{
    url: string,
    name: string
    
}
interface Props{
    list: ILinkList[],
    isFull?: boolean,
    key: string,
}


const SubNavigation2 = ({list, isFull, key}: Props) => {

  useEffect(()=>{

  },[])



  return (
    
        <NavDiv>
            <div style={{textAlign:'left', display:'inline-block', paddingLeft: isFull !== undefined && isFull === true ? '44px' : '0px;', width: isFull !== undefined && isFull === true ? '100%' :'1100px' }}>
            {
                list.map((v: {url: string, name: string}, i)=>{
                    if(i === 0 ){
                        return
                    }else{
                    return(
                        <SubNavList key={i} url={v.url} select={ v.url.indexOf(String(key)) !== -1} name={v.name}/>
                    )
                    }
                })
            }
            </div>
            
        </NavDiv>
      
  );
}


const NavDiv = Styled.div`
  background-color: ${BG_COLOR_SUB};
  heigth: 62px;
  width: 100%;
  text-align: center;
  padding-top: 10px;
`


export default SubNavigation2;
