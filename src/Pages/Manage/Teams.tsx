import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import Styled, { withTheme } from 'styled-components'
import { BASE_URL, BG_COLOR, BG_COLOR_SUB, SYSTEM_NAME, BG_COLOR_SUB2, COMPANY_LOGO, POINT_COLOR, MAX_WIDTH, TOKEN_NAME } from '../../Common/configset'
import Axios from 'axios';
import DashboardWrapContainer from '../../Containers/DashboardWrapContainer';
import Header from '../../Components/Text/Header';
import { getToken } from '../../Common/tokenFunctions';
import SubNavigation from '../../Components/Navigation/SubNavigation';
import 'react-dropdown/style.css'
import { dataSet } from '../../Common/dataset'
import BasicDropdown from '../../Components/Dropdown/BasicDropdown';
import { getRequest, postRequest } from '../../Common/requestFunctions';
import SuperNavigation from '../../Components/Navigation/SuperNavigation';
import InnerBodyContainer from '../../Containers/InnerBodyContainer';
import WhiteBoxContainer from '../../Containers/WhiteBoxContainer';
import BTN_UP from '../../Assets/Images/btn_up_rank.png';
import BTN_DOWN from '../../Assets/Images/btn_down_rank.png';
import BTN_DELETE from '../../Assets/Images/btn_delete_rank_g.png';
import { ROUTER_MANAGE, ROUTER_MENU_LIST } from '../../Common/routerset';
import SearchInputSmall from '../../Components/Input/SearchInputSmall';
import InfoTable from '../../Components/Table/InfoTable';

import TeamTable from '../../Components/Table/TeamTable';

const TeamsSetting = () => {


  const [list, setList] = useState<ITeam[]>([]);
  const [name, setName] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [list2, setList2] = useState<ITeam[]>([]);
  const [target, setTarget] = useState<ITeam | null>(null);
  const index = {
    name: '부서/조직 명',
  }


  const tempList = [

    { pk: '21332121', name: '개발팀' },
    { pk: '213251', name: '생산팀' },
    { pk: '213215521', name: '운영팀' },
    { pk: '2134624221', name: '영업팀' },
  ]
  const tempList2 = [

    { pk: '2132351121', name: '1팀' },
    { pk: '213754731', name: '2팀' },

  ]
  useEffect(() => {

    //setList(dataSet.acceptList); //TODO: 테스트용. 지울것.
    //getRankList();
    //getList()
    setList(tempList)
    setList2(tempList2)
  }, [])

  const onClickAdd = useCallback((id) => {

    console.log('--select id : ' + id)

  }, [])

  /**
   * getData()
   * 초기 팀 목록 조회 
   * @param {string} url 
   * @returns X
   */
  const getList = useCallback(async () => {

    const results = await getRequest('http://211.208.115.66:8088/api/v1/teams/list?keyword=' + keyword, getToken(TOKEN_NAME))
    if (results === false) {
      alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
    } else {
      if (results.status === 200) {
        setList(results.results)
        setKeyword('')
        setList2([])
      } else {
        alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
      }
    }
  }, [list, keyword])

  /**
   * getDataSubTeams()
   * 목록 불러오기 
   * @param {string} url 
   * @returns X
   */
  const getDataSubTeams = useCallback(async () => {

    const results = await getRequest('http://211.208.115.66:8088/api/v1/teams/list?pk=' + target + '&keyword=' + keyword, getToken(TOKEN_NAME))
    if (results === false) {
      alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
    } else {
      if (results.status === 200) {
        setList2(results.results)

      } else {
        alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
      }
    }
  }, [list2, keyword, target])

  /**
     * getSearchList()
     * 목록 검색
     * @param {string} url 
     * @returns X
     */
  const getSearchList = useCallback(async (e) => {
    e.preventDefault();
    const results = await getRequest('http://211.208.115.66:8088/api/v1/teams/list?keyword=' + keyword, getToken(TOKEN_NAME))
    if (results === false) {
      alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
    } else {
      if (results.status === 200) {
        setList(results.results)
        setKeyword('')
        setList2([])
      } else {
        alert('데이터를 불러 올 수 없습니다. 잠시후 이용하세요.')
      }
    }
  }, [list, keyword])

  const onClickDelete = useCallback(async (id, abl) => {

    const results = await postRequest('http://211.208.115.66:8088/api/v1/teams/delete', { pk: id }, getToken(TOKEN_NAME))

    console.log('--select id : ' + id)
    if (results === false) {
      alert('요청을 처리 할 수없습니다. 잠시후 다시 이용하세요.')
    } else {
      if (results.status === 200) {
        getList()
      } else {
        alert('요청을 처리 할 수없습니다. 잠시후 다시 이용하세요.')
      }
    }


  }, [])


  const onClickModify = useCallback(async (id, value) => {

  
    const results = await postRequest('http://211.208.115.66:8088/api/v1/teams/update', { pk: id, name: value }, getToken(TOKEN_NAME))

    console.log('--select id : ' + id)
    if (results === false) {
      alert('요청을 처리 할 수없습니다. 잠시후 다시 이용하세요.')
    } else {
      if (results.status === 200) {
        getList()
      } else {
        alert('요청을 처리 할 수없습니다. 잠시후 다시 이용하세요.')
      }
    }


  }, [])

  const onChangeEvent = useCallback((depth, idx, value) => {

    console.log('--select id : ' + idx + depth + value)

    if (depth === 0) {
      const tempList = list.slice();
      tempList[idx].name = value
      setList(tempList)
    } else if (depth === 1) {

    }
  }, [list, list2])
  return (
    <DashboardWrapContainer index={1}>
      <SubNavigation list={ROUTER_MENU_LIST[1]} />


      <InnerBodyContainer>
        <div style={{ width: '100%' }}>
          <div style={{ float: 'right', marginTop: 22, marginBottom:12 }}>

            <SearchInputSmall
              description={'검색어 입력'}
              value={keyword}
              onChangeEvent={(e) => { setKeyword(e.target.value) }}
              onClickEvent={getSearchList}
            />
          </div>
        </div>

        <div style={{ display: 'flex', width: '100%' }}>
          <WhiteWrapDiv >

            <p style={{ fontSize: 19, marginBottom: 12 }}>부서 및 조직</p>

            <div style={{ display: 'flex', marginBottom: 28 }}>

              <InputBox value={name} onChange={(e) => { setName(e.target.value) }} placeholder={'부서명 입력'}></InputBox>
              <ButtonBox onClick={() => onClickAdd(0)}> + 상위 부서 생성</ButtonBox>
            </div>
            <TeamTable indexList={index} depth={0} onClickModify={onClickModify} onChangeEvent={onChangeEvent} onClickEvent={setTarget} contents={list} onClickRemove={onClickDelete} />

          </WhiteWrapDiv>
          {
            target !== null ?

              <WhiteWrapDiv style={{ borderLeft: '1px dotted #dddddd50', paddingLeft: 24, marginLeft: 24 }}>

                <p style={{ fontSize: 19, marginBottom: 12 }}>{target.name} 하위 부서 및 조직</p>
                <div style={{ display: 'flex', marginBottom: 28 }}>

                  <InputBox value={name2} onChange={(e) => { setName2(e.target.value) }} placeholder={'부서명 입력'}></InputBox>
                  <ButtonBox onClick={() => onClickAdd(1)}> + 하위 부서 생성</ButtonBox>
                </div>
                <TeamTable indexList={index} depth={1} onClickModify={onClickModify} onChangeEvent={onChangeEvent} onClickEvent={setTarget} contents={list2} onClickRemove={onClickDelete} />


              </WhiteWrapDiv>
              :
              null}
        </div>

      </InnerBodyContainer>
    </DashboardWrapContainer>

  );
}


const WhiteWrapDiv = Styled.div`
    border-radius: 5px;
    width: 50%;
    flex: 1 1 auto;
    text-align: left;
    margin-left: 4px;
    margin-right: 4px;
    background-color: ${BG_COLOR_SUB2};
    min-height: 540px;
    
`
const ButtonBox = Styled.button`
    padding: 7px 24px 7px 24px;
    color: black;
    background-color: ${POINT_COLOR};
    border: 0;
    min-width: 150px;
    font-size: 14px;
    margin-left: 9px;
`

const InputBox = Styled.input`
    border: solid 0.5px #aaaaaa;
    font-size: 15px;
    width: 100%;
    color: white;
    padding: 7px;
    background-color: ${BG_COLOR_SUB}50;

`
export default TeamsSetting;