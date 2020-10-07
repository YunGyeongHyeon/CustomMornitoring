import React, {useCallback, useEffect, useState} from 'react';
import DashboardWrapContainer from '../../Containers/DashboardWrapContainer';
import Header from '../../Components/Text/Header';
import 'react-dropdown/style.css'
import SubNavigation from '../../Components/Navigation/SubNavigation';
import {ROUTER_MENU_LIST} from '../../Common/routerset';
import InnerBodyContainer from '../../Containers/InnerBodyContainer';
import {getParameter} from '../../Common/requestFunctions';
import SmallButtonLink from '../../Components/Button/SmallButtonLink';
import InfoTable from '../../Components/Table/InfoTable';
import {machineCodeToName} from '../../Common/codeTransferFunctions';

import {useHistory} from 'react-router-dom'
import DatePickerBox from '../../Components/Box/DatePickerBox';

//특정 재고의 재고 변동 이력
const StockHistory = () => {
  const history = useHistory();

  const [list, setList] = useState<IMaterial[]>([]);

  const optionList = [
    "등록순", "이름순", "재고순"
  ]
  const index = {
    name:'이름',
    code:'코드',
    reason:'변동 사유',
    amount:'변동 값',
    date:'변동 날짜',
    register:'담당자',


  }




  useEffect(()=>{


  },[])





  const onClickList = useCallback((id)=>{
    history.push(`/stock/update?pk=${id}`)


  },[])

  return (
      <DashboardWrapContainer index={8}>
        <SubNavigation list={ROUTER_MENU_LIST[8]}/>
        <InnerBodyContainer>
        <div style={{position:'relative'}}>
            <Header title={`재고 변동 이력`}/>
            <div style={{position:'absolute',display:'inline-block',top:0, right:0, zIndex:4}}>
            <SmallButtonLink name="+ 입고 등록" link="/stock/change/in"/>
            <SmallButtonLink name="+ 출고 등록" link="/stock/change/out"/>
            </div>
          </div>
          <DatePickerBox setListEvent={setList} targetPk={getParameter('pk')} searchUrl={'http://61.101.55.224:8299/api/v1/stock/history/target?'}/>

          <InfoTable indexList={index} pkKey={'pk'} type={'stock'} typeKey={'reason'} typeChanger={machineCodeToName} onClickLinkUrl="/stock/history?pk=" contents={list} />


        </InnerBodyContainer>
      </DashboardWrapContainer>

  );
}


export default StockHistory;
