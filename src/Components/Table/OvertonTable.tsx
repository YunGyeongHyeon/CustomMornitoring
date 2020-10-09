import React, {useCallback, useState} from "react";
import Styled from "styled-components";
import {POINT_COLOR, TOKEN_NAME} from "../../Common/configset";
import CalendarDropdown from "../Dropdown/CalendarDropdown";
import moment from "moment";
import BasicDropdown from "../Dropdown/BasicDropdown";
import {getRequest} from "../../Common/requestFunctions";
import {getToken} from "../../Common/tokenFunctions";
import IcSearchButton from "../../Assets/Images/ic_search.png";
import IcDropDownButton from "../../Assets/Images/ic_dropdown_white.png"
import {Input} from "semantic-ui-react";
import NumberPagenation from "../Pagenation/NumberPagenation";

interface Props {
    title: string
    selectDate?: any
    calendarOnClick?: any
    searchBarChange?: any
    searchButtonOnClick?: any
    dropDownContents?: any
    dropDownOnClick?:any
    dropDownOption?: any
    selectBoxChange?:any
    titleOnClickEvent?: any
    indexList: any
    valueList: any[]
    EventList?: any[]
    allCheckOnClickEvent?: any
    checkOnClickEvent?: any
    clickValue?: object
    mainOnClickEvent?: any
    onClickEvent?: any
    currentPage?:number
    totalPage?: number
    pageOnClickEvent?: any
    noChildren?: boolean
    children?: any
    calendarState?: boolean
}

const OvertonTable:React.FunctionComponent<Props> = ({title,selectDate,calendarOnClick,searchBarChange,searchButtonOnClick,dropDownContents,dropDownOnClick,dropDownOption,selectBoxChange,titleOnClickEvent,indexList,valueList,EventList,allCheckOnClickEvent,checkOnClickEvent,clickValue,mainOnClickEvent,noChildren,calendarState,children,currentPage,totalPage,pageOnClickEvent}:Props) => {

    const [checked, setChecked] = useState<any[]>([])
    const [allChecked, setAllChecked] = useState(false)


    React.useEffect(() => {
        if(checkOnClickEvent) {
            console.log('valueList', valueList)
            let tmpArr: boolean[] = []
            const arrData = valueList.map((v, i) => {
                tmpArr.push(false)
            })

            setChecked(tmpArr)
        } else {
            return
        }
    }, [valueList])


    return(
        <div>
            <Title>
                <p className="p-bold" style={{fontSize: 20 }}>{title}</p>
                <div style={{display: "flex", flexDirection: "row"}}>
                {dropDownOnClick ?
                    <div style={{alignItems: "center"}} >
                        <BasicDropdown contents={dropDownContents} select={dropDownContents[dropDownOption]}
                                       onClickEvent={dropDownOnClick}/>
                    </div> :
                    null
                }
                {searchButtonOnClick ?
                    <div style={{width: "300px",display: "flex", flexDirection: "row", marginRight: 15}}>
                        <SearchBox placeholder="검색어를 입력해주세요." style={{flex: 90}} onChange={(e) => searchBarChange(e.target.value)}/>
                        <SearchButton style={{flex: 10}} onClick={()=>searchButtonOnClick()}>
                            <img src={IcSearchButton}/>
                        </SearchButton>
                    </div> :
                    null
                }
                {calendarOnClick ?
                    <div style={{marginRight: 15}}>
                        <CalendarDropdown type={'range'} selectRange={selectDate} onClickEvent={(start, end) => calendarOnClick(start,end)} unLimit={calendarState}/>
                    </div>
                    :
                    null
                }
                {
                    titleOnClickEvent && titleOnClickEvent.map((bv,bi)=>{
                        return(
                            <div style={{marginRight: 15}}>
                                <TitleButtonBox onClick={bv.Link} style={{width: bv.Width}} >{bv.Name}</TitleButtonBox>
                            </div>
                        )
                    })
                }
                </div>
            </Title>
            <TitleBar>
                {
                    allCheckOnClickEvent ?
                        <div style={{paddingRight:10, paddingLeft: 10, paddingTop:5}}>
                            <input type="checkbox" id={'all'} onClick={(e) => {
                                if(allChecked === false) {
                                    allCheckOnClickEvent(valueList)
                                    let tmpArr: boolean[] = checked
                                    tmpArr = tmpArr.map(() => true)
                                    // console.log('asldfjlkasdjflksajdflkjadsklf', tmpArr)
                                    setChecked(tmpArr)
                                    setAllChecked(true)
                                    return true
                                } else {
                                    let tmpArr: boolean[] = checked
                                    tmpArr = tmpArr.map(() => false)
                                    allCheckOnClickEvent([])
                                    // console.log('asldfjlkasdjflksajdflkjadsklf', tmpArr)
                                    setChecked(tmpArr)
                                    setAllChecked(false)
                                    return false
                                }
                            }} />
                            <label htmlFor='all' style={{backgroundColor: "white"}}></label>
                        </div>
                        :
                        (
                            checkOnClickEvent ?
                            <div style={{paddingRight:10, paddingLeft: 10}}>
                                <p> </p>
                            </div>
                            :
                            null
                        )
                }
                {
                    Object.keys(indexList).map((v, i) => {
                        return (
                                typeof indexList[v] === 'object' ?
                                    <select className="p-limits"
                                            style={{
                                                backgroundColor: "#111319", borderColor: '#111319',color:'white', fontSize: "14px", width: '70%', marginRight: 30,
                                                background: `url(${IcDropDownButton}) no-repeat 95% 50%`
                                            }}
                                            onChange={(e)=>selectBoxChange(e.target.value)}
                                    >
                                        {
                                            Object.keys(indexList[v]).map(m => {
                                                return (
                                                    <>
                                                        <option value={indexList[v][m]} >{indexList[v][m]}</option>

                                                    </>
                                                )
                                            })
                                        }
                                    </select>
                                    :
                                    <p key={v} className="p-limits">{indexList[v]}</p>
                        )
                    })
                }
                {
                        EventList && EventList.map((bv,bi)=> {
                            return (
                                <p className="p-limits" > </p>
                            )
                        })
                }
            </TitleBar>
            {
                valueList !== undefined && valueList.length === 0
                    ? (<ValueBar style={{backgroundColor: '#353b48'}}><p style={{width: '100%', textAlign: 'center'}}>데이터가 없습니다. </p></ValueBar>)
                    : valueList?.map((v, i) => {
                    /*
                    v:  {
                        pk: 'PK11212',
                        machine_name: '프레스 01',
                        machine_number: '000-000-00',
                        manufacturer_code: '공정 01',
                        machine_register_time: '2020.06.16 22:34:40',
                        more_Action: false
                    },
                    */
                    return (
                        <ValueBar key={i} style={{backgroundColor: clickValue=== v ? '#19b9df' : '#353b48'}} onClick={mainOnClickEvent && mainOnClickEvent ? ()=>mainOnClickEvent(v) : ()=>console.log()}>
                            {
                                checkOnClickEvent ?
                                    <div style={{paddingRight: 10, paddingLeft: 10, paddingTop: 5}}>
                                            <input type="checkbox" id={`check-${i}-${v}`} checked={checked[i]} onClick={(e) => {
                                                let tmpArr: boolean[] = checked
                                                tmpArr = tmpArr.map((vm,vi)=>{
                                                     if(vi===i){
                                                         if(vm){
                                                             checkOnClickEvent(v)
                                                             return false
                                                         }else {
                                                             checkOnClickEvent(v)
                                                            return true
                                                         }
                                                     } else {
                                                        return  vm
                                                     }
                                                 })
                                                // console.log('asldfjlkasdjflksajdflkjadsklf', tmpArr)
                                                setChecked(tmpArr)
                                                return false
                                            }}/>
                                            <label htmlFor={`check-${i}-${v}`} style={{backgroundColor: "white"}}></label>
                                    </div>
                                    :
                                    null
                            }
                            {
                                Object.keys(indexList).map((mv, mi) => {
                                    //mv : [pk , machin_list, machine_name ... ]
                                    return (
                                        typeof v[mv] === 'object' ?
                                            <select className="p-limits" style={{backgroundColor: clickValue=== v ? '#19b9df' : '#353b48',borderColor: clickValue=== v ? '#19b9df' : '#353b48'}}>
                                                <option value={''}>선택</option>
                                                {
                                                    Object.keys(v[mv]).map(m => {
                                                        return(
                                                            <option value={v[mv][m]}>{v[mv][m]}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            :
                                        <p key={`td-${i}-${mv}`}
                                           className="p-limits" >
                                            {v[mv] === '' ?
                                                    'ㅡ'
                                                :
                                                    v[mv]
                                            }
                                        </p>

                                    )
                                })
                            }
                            {
                                EventList && EventList.map((bv,bi)=>{
                                    return(
                                        <div className="p-limits">
                                            <ButtonBox onClick={()=>bv.Link(v)} style={{width: bv.Width, color: bv.Color }} >{bv.Name}</ButtonBox>
                                        </div>
                                    )
                                })
                            }


                        </ValueBar>

                    )
                })
            }
            {currentPage && totalPage ?
                <NumberPagenation stock={totalPage ? totalPage : 0} selected={currentPage}
                                  onClickEvent={pageOnClickEvent}/>
                                  :
                null
            }
            {noChildren !== undefined || false ?
                null :
                <BlackBg /*style={{backgroundColor:  !== undefind ?  '#ff341a' : '#353b48'}}*/>
                    {children === undefined || children === null ? <p></p> : children}
                </BlackBg>
            }
        </div>
    )
}

const Title = Styled.div`
   text-align: left;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   margin-bottom: 15px;
   margin-top: 87px;
`

const TitleBar = Styled.div`
    display: flex;
    flex-direction: row;
    border-radius: 8px;
    background-color: #111319;
    width: 100%;
    max-height: 40px;
    min-height: 40px;
    align-items: center;
    p {
    text-align: left;
    color: #ffffff;
    font-size: 14px;
      &:first-child{
        padding-left: 20px;
      }
    }
`

const BlackBg = Styled.div`
    padding: 20px 20px 30px 20px;
    border-radius: 6px;
    background-color: #111319;
    margin-top: 20px;
`

const ValueBar = Styled.div`
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    border-radius: 8px;
    background-color: #353b48;
    width: 100%;
    max-height: 40px;
    min-height: 40px;
    align-items: center;
    select {
     height: 40px;
     background-color: #353b48;
     border-color: #353b48;
     text-align: left;
     color: #ffffff;
     font-size: 14px;
    }
    p {
    text-align: left;
    color: #ffffff;
    font-size: 14px;
      &:first-child{
        padding-left: 20px;
      }
    }
`

const TitleButtonBox = Styled.button`
    color: white;
    border-radius: 5px;
    background-color: #717c90;
    border: 0;
    font-size: 14px;
    font-weight: bold;
    width: 70px;
    height: 30px;
`

const ButtonBox = Styled.button`
    color: black;
    border-radius: 5px;
    background-color: #717c90;
    border: 0;
    font-size: 14px;
    font-weight: bold;
    width: 112px;
    height: 30px;
`

const SearchBox = Styled(Input)`
    input{
        padding-left: 8px;
        font-famaily: NotoSansCJKkr;
        height: 28px;
        border: 0.5px solid #b3b3b3;
        border-radius: 10px 0 0px 10px;
        width: 100%;
        margin-right: -10%;
        background-color: #f4f6fa;
        font-size: 15px;
        &::placeholder:{
            color: #b3b3b3;
        };
     }
`

const SearchButton = Styled.button`
    width: 55px;
    height: 32px;
    border-radius: 5px 5px 5px 5px;
    background-color: ${POINT_COLOR};
    img{
        width: 20px;
        height: 20px;
        margin-top: 5px;
    }
`

export default OvertonTable
