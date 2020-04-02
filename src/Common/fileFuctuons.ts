
import { postRequest } from './requestFunctions';
import { getToken } from './tokenFunctions';
import { TOKEN_NAME } from './configset';


/**
 * uploadTempFile()
 * 파일을 임시 디비에 업로드 후 temp path를 리턴하는 매서드
 * @param {string} data BLOB 객체
 * @returns X 
 */
export const uploadTempFile = async(data)=>{
    
    const formData = new FormData()
    formData.append('file',data)
    const res = await postRequest('http://211.208.115.66:8088/api/v1/file/upload',formData, getToken(TOKEN_NAME))

    if(res === false){
      return false
    }else{
      if(res.status === 200 ){ //res.status === 200 //res !== null
        const path: string = res.results; //const path: string = res.results; //const path: string = res[0]; 
        
        return path;
      }else{
        alert('해당 파일 업로드 실패하였습니다.')
        return false
      }
    }
  }