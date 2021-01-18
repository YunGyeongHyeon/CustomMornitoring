import React, {useCallback, useEffect, useState} from 'react'
import Styled from 'styled-components'
import {BG_COLOR_SUB, POINT_COLOR} from '../../Common/configset'
import Modal from 'react-modal'
import ReactShadowScroll from 'react-shadow-scroll'
import ic_check from '../../Assets/Images/ic_check.png'
import {Input} from 'semantic-ui-react'
import IcSearchButton from '../../Assets/Images/ic_search.png'
import {API_URLS, getSearchMachine} from '../../Api/mes/process'
import {transferCodeToName} from '../../Common/codeTransferFunctions'
import Pagination from '@material-ui/lab/Pagination'
import Notiflix from 'notiflix'
import {SEARCH_API_URLS} from '../../Api/mes/search/search'

//드롭다운 컴포넌트

interface IProps {
  select?: any, //선택된 object
  onClickEvent: any // 선택 시 실행되는 func
  text: string //select가 undefined일때 뜨는 placeholder
  buttonWid?: string | number //돋보기 모양 버튼 width 지정
  disabled?: boolean
  width?: number | string //검색 창 width
  type: 'rawlot' //검색 타입
  tableHeaderValue?: { title: string, key: string, width?: number }[] // 리스트에 들어가 항목 정보
  title: string // 모달 상단에 뜨는 title
  mainKey: string
}

Notiflix.Loading.Init({svgColor: '#1cb9df'})

const ItemPickerModal = ({select, onClickEvent, text, buttonWid, disabled, width, type, title, tableHeaderValue, mainKey}: IProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [itemData, setItemData] = useState<any>()

  const [itemList, setItemList] = useState<any[]>()
  const [searchName, setSearchName] = useState<string>('')

  const [page, setPage] = useState<PaginationInfo>({
    current: 1,
  })

  useEffect(() => {
    if (select) {
      setItemData(select)
    }
  }, [select])

  const getList = useCallback(async (isSearch?: boolean) => {
    Notiflix.Loading.Circle()
    const tempUrl = `${SEARCH_API_URLS[type]}?keyword=${searchName}&page=${isSearch ? 1 : page.current}&limit=10&option=0`
    const resultData = await getSearchMachine(tempUrl)
    if (resultData) {
      setItemList(resultData.info_list)
      setPage({current: resultData.current_page, total: resultData.total_page})
    }
    Notiflix.Loading.Remove()
  }, [searchName, page])


  useEffect(() => {
    if (isOpen) {
      getList()
    }
  }, [page.current, isOpen])

  return (
    <div>
      <div style={{display: 'inline-block', zIndex: 0, width: width ? width : '100%'}}>
        <BoxWrap disabled={disabled} onClick={() => {
          setIsOpen(true)
        }} style={{padding: 0, backgroundColor: '#f4f6fa'}}>
          <div style={{display: 'inline-block', height: 32, width: '100%'}}>
            {
              itemData ? <p style={{marginTop: 5}}>&nbsp; {itemData[mainKey]}</p>
                : <p style={{marginTop: 5, color: '#b3b3b3'}}>&nbsp; {text}</p>
            }
          </div>
          {
            !disabled && <div style={{
              display: 'inline-block',
              backgroundColor: POINT_COLOR,
              width: buttonWid ? buttonWid : 30,
              height: buttonWid ? buttonWid : 30
            }}>
                <img style={{width: 20, height: 20, marginTop: 5}} src={IcSearchButton}/>
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
            <p style={{fontSize: 18, fontFamily: 'NotoSansCJKkr', fontWeight: 'bold'}}>• {title} 검색</p>
            <div style={{width: 860, display: 'flex', flexDirection: 'row', marginBottom: 12}}>
              <SearchBox placeholder={`${title}명을 입력해주세요`} style={{flex: 96}}
                         onChange={(e) => setSearchName(e.target.value)}
                         onKeyPress={(event) => event.key === 'Enter' && getList(true)}/>
              <SearchButton style={{flex: 4}} onClick={() => getList(true)}>
                <img src={IcSearchButton}/>
              </SearchButton>
            </div>
            <div style={{minHeight: 310, maxHeight: 'auto', width: 860, backgroundColor: '#f4f6fa'}}>
              <ReactShadowScroll>
                <MachineTable>
                  <tr>
                    {
                      tableHeaderValue && tableHeaderValue.map(v => {
                        return <th style={{width: v.width ? v.width : '100%'}}>{v.title}</th>
                      })
                    }
                  </tr>
                  {itemList ? itemList.length !== 0 ?
                    itemList.map((item, index) => {
                      return (
                        <tr style={{
                          height: 32,
                          backgroundColor: itemData ? item.pk === itemData.pk ? POINT_COLOR : '#ffffff' : '#ffffff',
                        }} onClick={() => {
                          setItemData(item)
                        }}>
                          {
                            tableHeaderValue && tableHeaderValue.map(th => {
                              return <td><span>{item[th.key]}</span></td>
                            })
                          }
                        </tr>
                      )
                    }) : <tr>
                      <td colSpan={tableHeaderValue?.length} style={{textAlign: 'center'}}>데이터가 없습니다.</td>
                    </tr>
                    : <tr>
                      <td colSpan={tableHeaderValue?.length} style={{textAlign: 'center'}}>데이터가 없습니다.</td>
                    </tr>
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
              setIsOpen(false)
            }}>
              <div>
                <span style={{color: '#666d79'}}>취소</span>
              </div>
            </CheckButton>
            <CheckButton style={{right: 0, backgroundColor: POINT_COLOR}} onClick={() => {
              onClickEvent(itemData)
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

export default ItemPickerModal