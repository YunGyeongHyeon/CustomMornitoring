import React, {useEffect} from 'react';
import Styled from 'styled-components'
import InputContainer from '../../Containers/InputContainer';

//웰컴, 로그인 페이지 네비게이션 컴포넌트

interface IProps{
    title: string,
    value: string,
}
const ReadOnlyInput = ({title, value}: IProps) => {
  useEffect(()=>{

  },[])

  return (
        <InputContainer title={title}>
            <InputBox>{value}</InputBox>
        </InputContainer>
  );
}

const InputBox = Styled.div`
    border: 0;
    font-size: 14px;
    padding: 6px;
    padding-left: 10px;
    width: calc(100% - 200px);
    background-color: transparate;
`


export default ReadOnlyInput;
