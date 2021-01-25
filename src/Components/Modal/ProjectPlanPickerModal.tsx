import React, {useCallback, useEffect, useState} from 'react'
import Styled from 'styled-components'
import {BG_COLOR_SUB, POINT_COLOR} from '../../Common/configset'
import searchButton from '../../Assets/Images/btn_search.png'
import Modal from 'react-modal'
import ReactShadowScroll from 'react-shadow-scroll'
import ic_check from '../../Assets/Images/ic_check.png'
import {Input} from 'semantic-ui-react'
import IcSearchButton from '../../Assets/Images/ic_search.png'
import {API_URLS, getProductionSearch} from '../../Api/mes/production'
import Pagination from '@material-ui/lab/Pagination'
import Notiflix from 'notiflix'
import StyleRadioInput from '../Box/StyleRadioInput'

//드롭다운 컴포넌트

interface IProps {
  select?: {
    pk: string,
    project_name: string,
    material_name: string,
    supplier_name: string,
  },
  onClickEvent: any
  text: string
  disable?: boolean
  inputWidth?: string | number
  buttonWid?: string | number
}

Notiflix.Loading.Init({svgColor: '#1cb9df'})

const ProjectPlanPickerModal = ({select, onClickEvent, text, inputWidth, buttonWid, disable}: IProps) => {
  //const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [isOpen, setIsOpen] = useState(false)
  const [machineName, setMachineName] = useState('')
  const [type, setType] = useState<number>(0);

  const [machineList, setMachineList] = useState([{
    pk: '',
    project_name: '',
    manager_name: '',
    material_name: '',
    supplier_name: '',
  }])
  const [searchName, setSearchName] = useState<string>('')
  const [page, setPage] = useState<PaginationInfo>({
    current: 1,
  })

  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [saveKeyword, setSaveKeyword] = useState<string>('');
  
  // const ref = useOnclickOutside(() => {
  //     setIsOpen(false);
  // });

  const getList = useCallback(async (isSearch?: boolean) => {
    Notiflix.Loading.Circle()
    const tempUrl = `${API_URLS['production'].search}?keyword=${saveKeyword}&type=${type}&page=${isSearch ? 1 : page.current}&limit=10`
    const resultData = await getProductionSearch(tempUrl)
    if (resultData) {
      setMachineList(resultData.info_list)
      setPage({current: resultData.current_page, total: resultData.total_page})
      setIsFirst(true)
    }
    Notiflix.Loading.Remove()
  }, [searchName, saveKeyword, isFirst, page, type])

  const handleClickBtn = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if(isFirst){
      getList(true)
    }
  }, [type, saveKeyword])

  useEffect(() => {
    getList()
  }, [page.current])

  useEffect(() => {
    if (select && select.project_name) setMachineName(select.project_name)
  }, [select])

  return (
    <div>
      <div style={{
        position: 'relative',
        display: 'inline-block',
        zIndex: 0,
        width: inputWidth ? inputWidth : 917
      }}>
        <BoxWrap disabled={disable} onClick={() => {
          setIsOpen(true)
        }} style={{padding: 0, backgroundColor: '#f4f6fa'}}>
          <div style={{display: 'inline-block', height: 32, width: 885}}>
            {
              select ? <p style={{marginTop: 5}}>&nbsp; {machineName}</p>
                : <p style={{marginTop: 5, color: '#b3b3b3'}}>&nbsp; {text}</p>
            }

          </div>
          {
            !disable && <div style={{
              display: 'inline-block',
              backgroundColor: POINT_COLOR,
              width: buttonWid ? buttonWid : 32,
              height: buttonWid ? buttonWid : 32
            }}>
                <img src={searchButton} style={{width: '20px', height: '20px', marginTop: '5px'}}
                     onClick={() => {
                       setIsOpen(true)
                     }}/>
            </div>
          }
        </BoxWrap>
      </div>
      <Modal
        isOpen={isOpen}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 0
          },
          overlay: {
            background: 'rgba(0,0,0,.6)',
            zIndex: 5
          }
        }}
      >
        <div style={{width: 900}}>
          <div style={{width: 860, minHeight: 530, maxHeight: 'auto', padding: 20}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <p style={{fontSize: 18, fontFamily: 'NotoSansCJKkr', fontWeight: 'bold'}}>• 생산 계획 검색</p>
                <StyleRadioInput title={''} width={0} line={false} target={type}
                            onChangeEvent={(e) => {setType(e)}}
                            contents={[
                              {value: 0, title: '계획자명'}, {value: 1, title: '생산 품목명'}, {value: 2, title: '납품업체명'}
                            ]} />
            </div>
            
            <div style={{width: 860, display: 'flex', flexDirection: 'row', marginBottom: 12}}>
              <SearchBox placeholder="검색어를 입력해 주세요." style={{flex: 96}}
                         onKeyPress={(event) => event.key === 'Enter' && setSaveKeyword(searchName)}
                         value={searchName} onChange={(e) => setSearchName(e.target.value)}/>
              <SearchButton style={{flex: 4}} onClick={() => setSaveKeyword(searchName)}>
                <img src={IcSearchButton}/>
              </SearchButton>
            </div>
            <div style={{minHeight: 310, maxHeight: 'auto', width: 860, backgroundColor: '#f4f6fa'}}>
              <ReactShadowScroll>
                <MachineTable>
                  <tr>
                    <th style={{width: 250}}>생산계획</th>
                    <th style={{width: 125}}>계획자</th>
                    <th style={{width: 125}}>생산품목</th>
                    <th style={{width: 250}}>납품업체</th>
                  </tr>
                  {machineList !== undefined && machineList.length === 0 ?
                    <tr>
                      <td colSpan={4} style={{textAlign: 'center'}}>데이터가 없습니다.</td>
                    </tr>
                    :
                    machineList.map((v, i) => {
                      return (
                        <tr style={{
                          height: 32,
                          backgroundColor: select ? v.pk === select.pk ? POINT_COLOR : '#ffffff' : '#ffffff',
                        }} onClick={() => {
                          setMachineName(v.project_name)
                          return onClickEvent(v)
                        }}>
                          <td><span style={{fontSize: 14}}>{v.project_name}</span></td>
                          <td><span>{v.manager_name}</span></td>
                          <td><span>{v.material_name}</span></td>
                          <td><span>{v.supplier_name}</span></td>
                        </tr>
                      )
                    }) //0: 계획자명, 1: 품목명, 2: 납품업체명
                  }
                </MachineTable>
              </ReactShadowScroll>
              <PaginationBox>
                <Pagination count={page.total ? page.total : 0} page={page.current}
                            onChange={(event, i) => setPage({...page, current: i})}
                            boundaryCount={1} color={'primary'}/>
              </PaginationBox>
            </div>
          </div>
          <div style={{width: 900}}>
            <CheckButton style={{left: 0, backgroundColor: '#e7e9eb'}} onClick={() => {
              onClickEvent({name: undefined, pk: undefined})
              setIsOpen(false)
            }}>
              <div>
                <span style={{color: '#666d79'}}>취소</span>
              </div>
            </CheckButton>
            <CheckButton style={{right: 0, backgroundColor: POINT_COLOR}} onClick={() => {
              setIsOpen(false)
            }}>
              <div>
                <span style={{color: 'black'}}>확인</span>
              </div>
            </CheckButton>
          </div>
        </div>
      </Modal>

    </div>
  )
}

const BoxWrap = Styled.button`
    border: 1px solid #b3b3b3;
    color: black;
    width: 100%;
    height: 32px;
    background-color: white;
    font-weight: bold;
    text-algin: center;
    font-size: 13px;
    display: flex;
    p{
        text-align: left;
        font-size: 15px;
        font-weight: bold;
    }
`

const InnerBoxWrap = Styled.button`
    padding: 5px 15px 4px 15px;
    border-radius: 0px;
    color: white;
    min-width: 100px;
    background-color: ${BG_COLOR_SUB};
    border: none;
    font-weight: bold;
    text-algin: left;
    p{
        text-algin: left;
     }
    font-size: 13px;
    img {
    margin-right: 7px;
    width: 14px;
    height: 14px;
    }
`

const SearchBox = Styled(Input)`
    input{
        padding-left: 8px;
        font-family: NotoSansCJKkr;
        height: 28px;
        border: 0.5px solid #b3b3b3;
        width: calc( 100% - 8px );
        background-color: #f4f6fa;
        font-size: 15px;
        &::placeholder:{
            color: #b3b3b3;
        };
     }
`

const SearchButton = Styled.button`
    width: 32px;
    height: 32px;
    background-color: ${POINT_COLOR};
    img{
        width: 20px;
        height: 20px;
        margin-top: 5px;
    }
`

const CheckButton = Styled.button`
    position: absolute;
    bottom: 0px;
    height: 46px;
    width: 50%;
    div{
        width: 100%;
    }
    span{
        line-height: 46px;
        font-family: NotoSansCJKkr;
        font-weight: bold;
    }
`

const MachineTable = Styled.table`
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0px;
    tr{
        height: 32px;
        border: 1px solid #b3b3b3;
        padding: 0px;
        th{
            text-align: left;
        }
        td{
            border-spacing: 0px;
            height: 32px;
            padding: 0; 
        }
    }
    
`


const PaginationBox = Styled.div`
    height: 60px;
    padding-top: 5px;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    position:relative;
    .MuiButtonBase-root {
        color: black;
    }
    .MuiPaginationItem-root{
        color: black;
    }
`

export default ProjectPlanPickerModal
