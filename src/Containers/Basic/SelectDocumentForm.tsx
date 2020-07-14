import React, { useEffect, useState, useContext , useCallback} from 'react';
import Styled, { withTheme } from 'styled-components'
import { getToken } from '../../Common/tokenFunctions';
import { getParameter, getRequest, postRequest } from '../../Common/requestFunctions';
import {useHistory} from 'react-router-dom'
import DropdownCode from '../../Components/Input/DropdownCode';
import { TOKEN_NAME } from '../../Common/configset';

const docDummy = [
  {pk: 'qfqwf', name:'도큐먼트 1'},
  {pk: 'ehki', name:'도큐먼트 2'},
  {pk: 'qfqw412f', name:'도큐먼트 3'},
  {pk: 'efgrhtjyu', name:'도큐먼트 4'},
  {pk: 'kmcd', name:'도큐먼트 5'},
]

interface Props{
  category : string | number,
  onChangeEvent : any
}

const SelectDocumentForm = ({category, onChangeEvent}:Props) => {

  const [document, setDocument] = useState<any>({id:'', value:'(선택)'});
  const [documentList, setDocumentList] = useState<any[]>([]);
  const history = useHistory();

  useEffect(()=>{
    setDocumentList(docDummy.map((v)=>{return({id: v.pk, value: v.name})}))
    getDocumentData();
  },[])

  const getDocumentData = useCallback(async()=>{
    
    const res = await getRequest('http://211.208.115.66:PORT/api/v1/document/form/list?category=' + 0, getToken(TOKEN_NAME))

    if(res === false){
      //TODO: 에러 처리
    }else{
      if(res.status === 200 || res.status === "200"){
         setDocumentList(res.results.map((v)=>{return({id: v.pk, value: v.name})}))
         
         
      }else{
        //TODO:  기타 오류
      }
    }
  },[document, documentList ])

 


  return (
     
                
      <form style={{minHeight:400}}>
        <DropdownCode title={'표준 문서 선택'} target={document} contents={documentList} onChangeEvent={(input)=>{setDocument(input); onChangeEvent(input)}} />
        <br/>
        <TextNotice>조회가능한 표준문서가 없다면, <span onClick={()=>history.push('/basic/document/register')}>표준문서 등록</span>에서 등록해주세요. </TextNotice>
      </form>
        
      
  );
}
const TextNotice = Styled.p`
  font-size: 14px;
  color: gray;
  span{
    text-decoration: underline;
    cursor: pointer;
    font-weight: bold;
  }
`


export default SelectDocumentForm;