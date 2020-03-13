import React, { useEffect, useState, useContext, useCallback } from 'react';
import Styled from 'styled-components'
import WelcomeNavigation from '../../Components/Navigation/WelcomNavigation'
import WelcomeFooter from '../../Components/Footer/WelcomeFooter'
import {BASE_URL, BG_COLOR, BG_COLOR_SUB, SYSTEM_NAME, BG_COLOR_SUB2, COMPANY_LOGO, POINT_COLOR, MAX_WIDTH} from '../../Common/configset'
import ButtonBox from '../../Components/Button/BasicButton'
import { postRequestWithNoToken } from '../../Common/requestFunctions';
import WelcomeContainer from '../../Containers/WelcomeContainer';
import WelcomeInput from '../../Components/Input/WelcomeInput';
import BasicColorButton from '../../Components/Button/BasicColorButton';
import { useTranslation } from 'react-i18next';


const ForgotPw = () => {

  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [subDomain, setSubDomain] = useState<string>('localhost:3000');
  const {t} = useTranslation();
;
  /**
   * onsubmitForm()
   * : 비밀번호 찾기를 위한 메일 인증
   * @param {string} email 이메일
   * @param {string} subDomain 인증링크 접속을 위한 서브도메인 주소
   * @returns X
   */
  const onsubmitForm = useCallback(()=>{
  

    setError('')

    if(email.length < 6 || !email.includes('@')){
      alert(t('errorEmail'))
      setEmail('')
      return
    }
  
    let data: object = {
      email : email,
      sub_domain: subDomain
    }
    const results = postRequestWithNoToken(BASE_URL + '/password/send', data)

    if(results === false){
      //TODO: 에러 처리
    }else{
      if(results.status === 200){
        alert(t('checkMail'))
      }else if(results.status === 1001 || results.data.status === 1002){
        alert(t('errorUse'))
      }else{
        //TODO:  기타 오류
      }
    }


  },[email, error, subDomain])

  useEffect(()=>{
   
  },[])

  return (
        <WelcomeContainer>
          <div style={{width:320, textAlign:'left'}}>
            <p className="p-eng" style={{fontSize:36, marginBottom:26}}>Forgot Password</p>
            <WelcomeInput type="email" value={email} title={'ID (e-mail)'} onChangeEvent={(e: React.ChangeEvent<HTMLInputElement>): void =>{setEmail(e.target.value)}} hint={t('enterEmail')}/>
            <div style={{textAlign:'center',marginTop:52}}>
                  <BasicColorButton onClickEvent={onsubmitForm} width="100%" name={t('changePassword')} />
            </div>
          </div>
        </WelcomeContainer>
      
  );
}



export default ForgotPw;