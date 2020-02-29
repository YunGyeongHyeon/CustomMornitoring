
import React, { useEffect, useState, useContext, useCallback } from 'react';
import Styled, { withTheme } from 'styled-components'
import WelcomeNavigation from '../../Components/Navigation/WelcomNavigation'
import WelcomeFooter from '../../Components/Footer/WelcomeFooter'
import {BASE_URL, BG_COLOR, BG_COLOR_SUB, SYSTEM_NAME, BG_COLOR_SUB2, COMPANY_LOGO, POINT_COLOR, MAX_WIDTH} from '../../Common/configset'
import ButtonBox from '../../Components/Button/BasicButton'
import {useUser, useUserDispatch} from '../../Context/UserContext';
import Axios from 'axios';
import { read } from 'fs';
import { postRequestWithNoToken } from '../../Common/requestFunctions';

// 회원가입 정보 입력 페이지 (메일 인증 후 )

const Signup = () => {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [pw, setPw] = useState<string>('');
  const [pwCheck, setPwCheck] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [auth, setAuth] = useState<string>('');

  /**
   * onsubmitForm()
   * : 회원가입
   * @param {string} email 이메일
   * @param {string} pw 패스워드
   * @param {string} pwCheck 패스워드 확인
   * @param {string} name 이름
   * @param {string} code 회사코드
   * @param {string} auth 이메일 인증코드 
   * @returns X
   */
  const onsubmitForm = useCallback((e)=>{
    e.preventDefault();

    //window.location.href= "/complete" //TODO: 지울것

    //발리데이션
    if(pw == '' || name == '' || email ==='' || code === ''){
      alert('필수 항목을 모두 입력해주세요.')
      return
    } 
    if(pw.length < 6 || pw !== pwCheck){
      alert('비밀번호를 확인해주세요. (6자 이상)')
      setPwCheck('')
      return
    }
    if(email.length < 6 || !email.includes('@')){
      alert('이메일 형식을 확인해주세요.')
      setEmail('')
      return
    }

    let data: object = {
      name: name,
      email: email,
      password: pw,
      company_code: code,
      auth_code: auth,
    }
    const results = postRequestWithNoToken(BASE_URL + '/user/register', data)

    if(results === false){
      //TODO: 에러 처리
    }else{
      if(results.status === 200){
        
      }else if(results.status === 1001){
        alert('이미 사용중인 이메일 입니다. 잘못된 접근입니다. 이전 페이지로 돌아갑니다.')
        setEmail('')
        window.location.href= "/login" 
      }else if(results.status === 1003){
        alert('잘못 된 회사 코드입니다.')
        setCode('')
      }else{
        //기타 에러처리 
  
      }
    }

  },[email, name, pw, pwCheck, auth, code])

  useEffect(()=>{
      //setEmail(tempEmail);
      //setAuth(tempAuth);

  },[])

  return (

    
    
        <FullPageDiv>
            <WelcomeNavigation position={'static'} />
            <InnerDiv >
              <p style={{fontSize:36, marginTop:108}}>Sign Up</p>
              <div style={{marginTop:34, marginBottom:108}}>
              <form onSubmit={onsubmitForm}>
                  <label>Name</label> 
                  <WelcomeInputBox type="text" style={{marginTop:8, marginBottom:20, width: 327}}
                      value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>{setName(e.target.value)}} placeholder="이름을 입력해주세요."/>
                  <label>ID (e-mail)</label> 
                  <WelcomeInputBox type="text" readOnly style={{marginTop:8, marginBottom:20, width: 327}}
                      value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>{setEmail(e.target.value)}} 
                      placeholder="이메일을 입력해주세요."/>
                  <label>Password</label> 
                  <WelcomeInputBox type="password"  style={{marginTop:8, marginBottom:20, width: 327}}
                      value={pw} onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>{setPw(e.target.value)}} 
                      placeholder="비밀번호를 입력해주세요."/>
                  <label>Password Check</label> 
                  <WelcomeInputBox type="password"  style={{marginTop:8, marginBottom:20, width: 327}}
                      value={pwCheck} onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>{setPwCheck(e.target.value)}} 
                      placeholder="한번 더 비밀번호를 입력해주세요."/>    
                  <label>Company Code (* 담당자에게 문의)</label> 
                  <WelcomeInputBox type="text"  style={{marginTop:8, marginBottom:20, width: 327}}
                      value={code} onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>{setCode(e.target.value)}} 
                      placeholder="회사 코드를 입력해주세요."/>   
                  <p style={{color:'#ff0057', fontSize:12, marginBottom:14, marginTop:32, textAlign:'center'}}>{error}</p>
                  <ButtonBox name={'가입신청 하기'} /> 
                 
              </form>
              </div>
            </InnerDiv>
            <WelcomeFooter/>
        </FullPageDiv>
      
  );
}
const FullPageDiv = Styled.div`
  width: 100%;
  min-height: calc(100vh - 213px);
  hegith: 100%;
  text-align:center;
  background-color: ${BG_COLOR_SUB2}
`

const InnerDiv = Styled.div`
  display:inline-block;
  width: 327px;
  max-width: 327px;
  color: white;
  text-align:left;
 
  
`

 const WelcomeInputBox = Styled.input`
    
    border: solid 1px #b3b3b370;
    font-size: 15px;
    padding: 15px;
    width: calc(100% - 30px) !important;
    background-color: transparent;
    color: white;
`

export default Signup;