import React, {useCallback, useEffect, useState} from 'react';
import Styled from 'styled-components'
import {BASE_URL, TOKEN_NAME} from '../../Common/configset'
import DashboardWrapContainer from '../../Containers/DashboardWrapContainer';
import Header from '../../Components/Text/Header';
import {getToken} from '../../Common/tokenFunctions';
import 'react-dropdown/style.css'
import moment from 'moment'
import InnerBodyContainer from '../../Containers/InnerBodyContainer';
import {getParameter, getRequest, postRequest} from '../../Common/requestFunctions';
import WhiteBoxContainer from '../../Containers/WhiteBoxContainer';
import PlaneInput from '../../Components/Input/PlaneInput';
import AddInput from '../../Components/Input/AddInput';
import TextList from '../../Components/List/TextList';
import SearchModalContainer from '../../Containers/SearchModalContainer';
import SearchInput from '../../Components/Input/SearchInput';
import SearchedList from '../../Components/List/SearchedList';
import MemberInput from '../../Components/Input/MemberInput';
import RegisterButton from '../../Components/Button/RegisterButton';
import {useUser} from '../../Context/UserContext';
import IC_ADD from '../../Assets/Images/ic_file_add.png'
import FileTumbCard from '../../Components/Card/FileTumbCard';
import BasicToggle from '../../Components/Toggle/BasicToggle';
import ProcessTable from '../../Components/Table/ProcessTable';
import SmallButton from '../../Components/Button/SmallButton';
import {uploadTempFile} from '../../Common/fileFuctuons';
import {SF_ENDPOINT} from "../../Api/SF_endpoint";

// 작업 지시서 등록
const TaskRegister = () => {

    const User = useUser();
    const [pk, setPk] = useState<string>('');
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [option, setOption] = useState(0);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [amount, setAmount] = useState<number | string>(0);
    const [end, setEnd] = useState<string>(moment().format('YYYY-MM-DD HH:mm'));
    const [start, setStart] = useState<string>(moment().format('YYYY-MM-DD HH:mm'));

    //파일 관련
    const [fileList, setFileList] = useState<any[]>([]);
    const [pathList, setPathList] = useState<string[]>([]);

    const [oldFileList, setOldFileList] = useState<any[]>([]);
    const [removefileList, setRemoveFileList] = useState<any[]>([])

    const [select, setSelect] = useState<IProcess[]>();
    const [selectIndex, setSelectIndex] = useState<number>(999);

    //검색관련
    //생산품 검색
    const [isPoupup, setIsPoupup] = useState<boolean>(false);
    const [isSearched, setIsSearched] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>('');
    const [checkList, setCheckList] = useState<IMaterial[]>([]);
    const [list, setList] = useState<IMaterial[]>([]);
    const [searchList, setSearchList] = useState<IMaterial[]>([]);

    //프로세스 검색
    const [isPoupup2, setIsPoupup2] = useState<boolean>(false);
    const [searchList2, setSearchList2] = useState<IProcess[]>([]);
    const [checkList2, setCheckList2] = useState<IProcess[]>([]);
    const [list2, setList2] = useState<IProcess[]>([]);

    //추천 관련
    const [recommend, setRecommend] = useState<IProcess[][]>([]);

    //사람 관련
    const [worker, setWorker] = useState<IMemberSearched | null>({
        pk: User.pk,
        name: User.name,
        photo: User.profile_img,
        appointment: ''
    });
    const [referencerList, setReferencerList] = useState<IMemberSearched[]>([]);
    const [searchList4, setSearchList4] = useState<IMemberSearched[]>([]);
    const [check, setCheck] = useState<IMemberSearched | null>(null);
    const [searchList3, setSearchList3] = useState<IMemberSearched[]>([]);
    const [checkList4, setCheckList4] = useState<IMemberSearched[]>([]);
    const [isPoupup3, setIsPoupup3] = useState<boolean>(false);
    const [isPoupup4, setIsPoupup4] = useState<boolean>(false);

    const tabList = [
        "기계", "라인"
    ]
    const [tab, setTab] = useState<string>(tabList[0]);

    const optionList = [
        "등록순", "기계이름 순", "기계종류 순", "기계번호 순", "제조사 순", "제조사 번호 순", "제조사 상세정보 순"
    ]
    const index = {
        machine_name: '기계 이름',
        machine_label: '기계 종류',
        machine_code: '기계 번호',
        manufacturer: '제조사',
        manufacturer_code: '제조사 번호',
        manufacturer_detail: '제조사 상세정보'
    }

    useEffect(() => {

        //setSearchList(dataSet.materialList)
        //setIsSearched(true)
        //setSearchList2(dataSet.processList)
        //setList2(dataSet.processList)
        //setRecommend(dataSet.recommendList)
        //setSearchList3(dataSet.searchedMemmber)
        //setSearchList4(dataSet.searchedMemmber)
        const param = getParameter('pk');
        if (param !== "") {
            setPk(param)
            getData()
            ////alert(`수정 페이지 진입 - pk :` + param)
            setIsUpdate(true)
        }

    }, [])

    //
    useEffect(() => {


        if (list.length > 0) {
            getRecommendData()
        }

    }, [list])

    /**
     * getRecommendData()
     * 추천 데이터 받기
     * @param {string} url 요청 주소
     * @param {string} pk 자재 pk
     * @returns X
     */
    const getRecommendData = useCallback(async () => {

        if (list.length < 1 || isUpdate) {
            return;
        }
        const keyword = list[0].pk;

        const res = await getRequest(`${SF_ENDPOINT}/api/v1/task/recommend?pk=` + encodeURIComponent(keyword), getToken(TOKEN_NAME))


        if (res === false) {
            //alert('8089 포트 : 현재 추천 데이터를 받아올 수 없습니다.')
        } else {
            if (res.status === 200) {
                const data = res.results;
                if (data.length === 0) {
                    //alert('해당 자재는 현재 추천 공정 데이터가 존재하지 않습니다.')
                    setRecommend(data)
                } else {
                    setRecommend(data)
                }

            } else {
                //alert('해당 자재는 현재 추천 공정 데이터가 존재하지 않습니다.')
            }
        }
    }, [list, recommend])

    /**
     * onClickFilter()
     * 리스트 필터 변경
     * @param {string} filter 필터 값
     * @returns X
     */
    const onClickFilter = useCallback(async (filter: number) => {
        setOption(filter)
        //alert(`선택 테스트 : 필터선택 - filter : ${filter}` )
        return;
        const results = await getRequest(BASE_URL + '', getToken(TOKEN_NAME))

        if (results === false) {
            //TODO: 에러 처리
        } else {
            if (results.status === 200) {

            } else if (results.status === 1001 || results.data.status === 1002) {
                //TODO:  아이디 존재 확인
            } else {
                //TODO:  기타 오류
            }
        }
    }, [option])


    /**
     * onClickSearch()
     *  키워드 검색
     * @param {string} url 요청 주소
     * @param {string} keyword 검색 키워드
     * @returns X
     */
    const onClickSearch = useCallback(async (e) => {
        ////alert('keyword')
        e.preventDefault();
        let type = "material";
        // //alert('keyword')
        if (isPoupup === true) {
            type = 'material'
        } else if (isPoupup2 === true) {
            type = 'process'
        } else if (isPoupup3 === true) {
            type = 'task/worker'
        } else if (isPoupup4 === true) {
            type = 'task/referencer'
        } else {
            return;
        }

        if (keyword === '' || keyword.length < 2) {
            //alert('2글자 이상의 키워드를 입력해주세요')

            return;
        }
        setIsSearched(true)

        const res = await getRequest(`${SF_ENDPOINT}/api/v1/${type}/search?keyword=` + keyword, getToken(TOKEN_NAME))

        if (res === false) {
            //TODO: 에러 처리
        } else {
            if (res.status === 200) {
                const results = res.results;
                if (isPoupup === true) {
                    setSearchList(results);
                } else if (isPoupup2 === true) {
                    setSearchList2(results);
                } else if (isPoupup3 === true) {
                    setSearchList3(results);
                } else if (isPoupup4 === true) {
                    setSearchList4(results);
                } else {
                    return;
                }


            } else {
                //TODO:  기타 오류
            }
        }
    }, [keyword])

    /**
     * onClickSearchMaterial()
     * 생산제품 키워드 검색
     * @param {string} url 요청 주소
     * @param {string} keyword 검색 키워드
     * @returns X
     */
    const onClickSearchMaterial = useCallback(async (e) => {

        e.preventDefault();
        ////alert('테스트 : keyword - ' + keyword);
        //return;
        if (keyword === '' || keyword.length < 2) {
            //alert('2글자 이상의 키워드를 입력해주세요')

            return;
        }
        setIsSearched(true)

        const res = await getRequest(`${SF_ENDPOINT}/api/v1/material/search?keyword=` + keyword, getToken(TOKEN_NAME))

        if (res === false) {
            //TODO: 에러 처리
        } else {
            if (res.status === 200) {
                const results = res.results;
                setKeyword('')
                setSearchList(results);
            } else if (res.status === 1001) {
                //TODO:  오류 처리
            } else {
                //TODO:  기타 오류
            }
        }
    }, [keyword, searchList])

    /**
     * onClickSearchMaterial()
     * 생산제품 키워드 검색
     * @param {string} url 요청 주소
     * @param {string} keyword 검색 키워드
     * @returns X
     */
    const onClickSearchProcess = useCallback(async (e) => {

        e.preventDefault();
        ////alert('테스트 : keyword - ' + keyword);
        //return;
        if (keyword === '' || keyword.length < 2) {
            //alert('2글자 이상의 키워드를 입력해주세요')

            return;
        }
        setIsSearched(true)

        const res = await getRequest(`${SF_ENDPOINT}/api/v1/material/search?keyword=` + keyword, getToken(TOKEN_NAME))

        if (res === false) {
            //TODO: 에러 처리
        } else {
            if (res.status === 200) {
                const results = res.results;
                setKeyword('')
                setSearchList(results);
            } else if (res.status === 1001) {
                //TODO:  오류 처리
            } else {
                //TODO:  기타 오류
            }
        }
    }, [keyword, searchList])

    /**
     * onClickWhere()
     * 프로세스 위치 수정
     * @param {'UP' | 'DOWN' | 'ADD' | 'DELETE'} action 요청 주소
     * @returns X 리턴데이터, 요청실패(false) 이벤트 처리
     */
    const onClickWhere = useCallback((action: 'UP' | 'DOWN' | 'DELETE', index: number) => {
        let tempList = list2.slice();
        switch (action) {
            case 'UP':
                if (index !== 0) {
                    tempList.splice(index - 1, 0, tempList[index])
                    tempList.splice(index + 1, 1)
                }
                setList2(tempList);
                // code block
                break;
            case 'DOWN':
                if (index !== tempList.length) {
                    tempList.splice(index + 2, 0, tempList[index])
                    tempList.splice(index, 1)
                }

                setList2(tempList);
                // code block
                break;
            case 'DELETE':
                if (tempList.length <= 1) {
                    return;
                }
                tempList.splice(index, 1)
                setList2(tempList);
                // code block
                break;
            default:
                break;
            // code block
        }

    }, [list2])


    /**
     * addFile()
     * 파일 등록
     * @param {object(file)} event.target.files[0] 파일
     * @returns X
     */
    const addFile = useCallback(async (event: any): Promise<void> => {

        if (fileList.length + oldFileList.length > 7) {
            //alert('파일 업로드는 8개 이하로 제한되어있습니다.')
            return;
        }

        if (event.target.files[0] === undefined) {
            return;
        }
        if (event.target.files[0].size < 10000000) { //10MB 이하 판별
            const tempData = event.target.files[0]
            const tempPath = await uploadTempFile(event.target.files[0]);


            if (tempPath === false) {

                return
            } else {
                let tempFileLsit = fileList.slice();
                tempFileLsit.push(tempData)
                setFileList(tempFileLsit)
                let tempPathList = pathList.slice();
                tempPathList.push(tempPath)
                setPathList(tempPathList)
                return
            }

        } else {
            //alert('9MB 이하의 파일만 업로드 가능합니다.')
            return;
        }

    }, [fileList, pathList, oldFileList])

    /**
     * onsubmitFormUpdate()
     * 작업지시서 정보 수정
     * @param {string} pk 작업지시서 pk
     * @returns X
     */
    const onsubmitFormUpdate = useCallback(async (e) => {
        e.preventDefault();

        if (worker === null || title == "" || list.length < 1 || list2.length < 1) {
            //alert("제목, 작업자, 생산제품, 공정은 필수 항목입니다.")
            return;
        }
        let tempOpt = 'auto';
        if (option === 1) {
            tempOpt = 'custom';
        }
        let tempRefer = new Array();
        referencerList.forEach(v => {
            tempRefer.push(v['pk'])
        });
        let tempProcess = new Array();
        list2.forEach(v => {
            tempProcess.push(v['pk'])
        });
        const data = {
            pk: getParameter('pk'),
            title: title,
            description: description,
            product_pk: list[0].pk,
            amount: amount,
            process: tempProcess,
            worker: worker.pk,
            referencers: tempRefer,
            add_file: pathList,
            delete_file: removefileList,
        }

        const res = await postRequest(`${SF_ENDPOINT}/api/v1/task/update`, data, getToken(TOKEN_NAME))

        if (res === false) {
            //alert('실패하였습니다. 잠시후 다시 시도해주세요.')
        } else {
            if (res.status === 200) {

                //alert('성공적으로 수정 되었습니다');


            } else {
                //alert('실패하였습니다. 잠시후 다시 시도해주세요.')
            }
        }

    }, [list, list2, option, removefileList, referencerList, amount, pk, worker, pathList, title, description])
    /**
     * onsubmitForm()
     * 작업지시서 정보 등록
     * @returns X
     */
    const onsubmitForm = useCallback(async (e) => {
        e.preventDefault();

        if (worker === null || title == "" || list.length < 1) {
            //alert("제목, 작업자, 생산제품, 공정은 필수 항목입니다.")
            return;
        }
        let tempOpt = 'auto';
        if (option === 1) {
            tempOpt = 'custom';
        }
        let tempRefer = new Array();
        referencerList.forEach(v => {
            tempRefer.push(v['pk'])
        });
        let tempProcess = new Array();
        list2.forEach(v => {
            tempProcess.push(v['pk'])
        });
        let data: any = "";
        if (tempOpt === 'auto') {

            let tempPc = new Array();
            recommend[selectIndex].forEach((v, i) => {

                tempPc.push(v.pk)
            })
            data = {

                title: title,
                description: description,
                product_pk: list[0].pk,
                amount: amount,
                process: tempPc,
                process_type: tempOpt,
                worker: worker.pk,
                referencers: tempRefer,
                files: pathList
            }
        } else {
            data = {

                title: title,
                description: description,
                product_pk: list[0].pk,
                amount: amount,
                process: tempProcess,
                process_type: tempOpt,
                worker: worker.pk,
                referencers: tempRefer,
                files: pathList,
            }
        }


        const res = await postRequest(`${SF_ENDPOINT}/api/v1/task/register`, data, getToken(TOKEN_NAME))

        if (res === false) {
            //alert('실패하였습니다. 잠시후 다시 시도해주세요.')
        } else {
            if (res.status === 200) {

                //alert('성공적으로 등록 되었습니다');

                setTitle('');
                setDescription('');
                setList([]);
                setList2([]);
                setWorker(null)
                setAmount(0);
                setReferencerList([]);
                setRecommend([])

            } else {
                //alert('실패하였습니다. 잠시후 다시 시도해주세요.')
            }
        }

    }, [list, selectIndex, list2, pathList, option, referencerList, amount, pk, worker, title, description])

    /**
     * getData()
     * 작업지시서 수정을 위한 조회
     * @param {string} url 요청 주소
     * @param {string} pk 기계 pk
     * @returns X
     */
    const getData = useCallback(async () => {

        const res = await getRequest(`${SF_ENDPOINT}/api/v1/task/view?pk=` + getParameter('pk'), getToken(TOKEN_NAME))
        const tempM = new Array()
        const tempOut = new Array()
        if (res === false) {
            //TODO: 에러 처리
        } else {
            if (res.status === 200) {
                const data = res.results;
                setTitle(data.title);
                setPk(data.pk)
                setDescription(data.description);
                setList(new Array(data.output));
                setList2(data.process);
                setWorker(data.worker)
                setAmount(data.amount);
                setReferencerList(data.referencers);
                setOldFileList(data.files)

            } else {
                //TODO:  기타 오류
            }
        }
    }, [pk, list, list2, option, referencerList, amount, pk, worker, title, description])


    /**
     * onSubmitFile()
     * 작업지시서 파일첨부
     * @param {string} url 요청 주소
     * @param {string} pk 작업지시서 pk
     * @returns X
     */
    const onSubmitFile = useCallback(async (id) => {
        const data = new FormData();
        data.append('pk', id);
        fileList.forEach((v, i) => {
            data.append('file', v);
        });
        const res = await postRequest(`${SF_ENDPOINT}/api/v1/task/file`, data, getToken(TOKEN_NAME))

        if (res === false) {
            //alert('현재 파일서버 문제로 파일 업로드가 불가능합니다.')
        } else {
            if (res.status === 200) {
                //setFileList([])
            } else {
                //alert('현재 파일서버 문제로 파일 업로드가 불가능합니다.')
            }
        }
    }, [fileList])

    return (

        <DashboardWrapContainer index={7}>
            <InnerBodyContainer>
                <div style={{position: 'relative'}}>
                    <Header title={isUpdate ? '작업지시서 수정' : '작업지시서 등록'}/>
                </div>
                <WhiteBoxContainer>
                    <form onSubmit={isUpdate ? onsubmitFormUpdate : onsubmitForm}>
                        <div style={{borderBottom: 'solid 0.5px #d3d3d3'}}>
                            <PlaneInput value={title} description={'작업지시서 제목 입력'} onChangeEvent={setTitle}
                                        fontSize={'26px'}/>
                            <PlaneInput value={description} description={'상세 업무내용 작성 (200자 미만)'}
                                        onChangeEvent={setDescription}
                                        fontSize={'14px'}/>
                        </div>
                        <div style={{
                            display: 'flex',
                            borderBottom: 'solid 0.5px #d3d3d3',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {/* 팝업 여는 버튼 + 재료 추가 */}
                            <div style={{width: '55%'}}>

                                <AddInput line={false} title={'생산제품 (*필수)'} icType="solo"
                                          onlyOne={list.length > 0 ? true : false}
                                          onChangeEvent={() => {
                                              setIsPoupup(true);
                                              setCheckList(list);
                                              setKeyword('')
                                          }
                                          }>
                                    {
                                        list.map((v: IMaterial, i) => {
                                            return (
                                                <TextList key={i}
                                                          onClickSearch={() => {
                                                              setIsPoupup(true);
                                                              setKeyword('');
                                                              setIsSearched(true);
                                                          }}
                                                          onClickEvent={() => {
                                                              setList([])
                                                          }}
                                                          title={v.material_code !== undefined ? v.material_code : ""}
                                                          name={v.material_name}/>
                                            )
                                        })
                                    }
                                </AddInput>

                            </div>

                            <div style={{width: '45%', textAlign: 'left'}}>
                                <span style={{borderRight: 'dotted 1px #d3d3d3', height: 30, marginRight: 12}}></span>
                                <p style={{
                                    fontSize: 14,
                                    textAlign: 'left',
                                    marginTop: 5,
                                    fontWeight: 700,
                                    display: 'inline-block',
                                    marginRight: 20
                                }}>· 생산목표량</p>
                                <InputBox type="number" value={amount}
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                              setAmount(e.target.value)
                                          }} placeholder={'수량을 입력하세요(필수)'}/>
                            </div>

                        </div>


                        {/* 공정 선택 */}
                        <div style={{marginTop: 16, marginBottom: 24}}>
                            {
                                !isUpdate ?
                                    <BasicToggle contents={['추천공정선택', '수동공정선택']} select={option}
                                                 onClickEvent={setOption}/>
                                    : null
                            }

                            {
                                option === 0 && !isUpdate ?
                                    list.length < 1 ?
                                        <p style={{padding: 60, textAlign: 'center', color: "#aaaaaa"}}>생산할 제품(자재) 먼저 선택
                                            후, 추천 공정을
                                            선택 할 수 있습니다</p>
                                        :
                                        recommend === undefined || recommend.length == 0 ?
                                            <p style={{padding: 60, textAlign: 'center', color: "#252525"}}>해당 제품(자재)을
                                                생산하기 위한 추천공정이
                                                없습니다 (수동공정 선택 필요) <br/></p>
                                            :
                                            <div>
                                                {
                                                    recommend.map((v, i) => {
                                                        return (
                                                            <ProcessTable pk={String(i)} select={selectIndex}
                                                                          contents={v}
                                                                          indexList={['', '명칭', '기계 정보', '금형정보', '자재정보']}
                                                                          widthList={['1%', '14%', '30%', '15%', '40%']}
                                                                          onClickSelect={
                                                                              (value: number) => {
                                                                                  setSelectIndex(value);
                                                                                  setSelect(v)
                                                                              }
                                                                          }
                                                            />
                                                        )
                                                    })
                                                }

                                            </div>
                                    :
                                    list2.length < 1 ?
                                        <div style={{marginTop: 60, marginBottom: 60}}>
                                            <p style={{paddingBottom: 10, textAlign: 'center', color: "#aaaaaa"}}>공정을
                                                추가해주세요</p>
                                            <SmallButton name={'+ 추가하기'} onClickEvent={() => setIsPoupup2(true)}
                                                         color={'#d3d3d3'}/>

                                        </div>
                                        :
                                        <div>
                                            <ProcessTable pk={''} contents={list2}
                                                          indexList={['명칭', '', '기계 정보', '금형정보', '자재정보']}
                                                          widthList={['12%', '10%', '25%', '15%', '38%']}
                                                          onClickSearch={() => {
                                                              setIsPoupup2(true);
                                                              setCheckList2(list2);
                                                          }}
                                                          onClickModify={onClickWhere}
                                            />
                                        </div>
                            }

                        </div>

                        {/*
                 <DateRangeInput title={'작업 목표 기간'} end={end} start={start} onChangeEventEnd={setEnd} onChangeEventStart={setStart}/>
                */}
                        <hr style={{border: 'solid 0.5px #d3d3d3', marginTop: 14}}/>
                        <div style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                            <MemberInput
                                title={'등록자'}
                                isMultiRegistered={false}
                                target={{
                                    pk: 'me',
                                    name: User.name,
                                    image: ""
                                }}
                            />

                            <p style={{borderRight: 'dotted 1px #d3d3d3', height: 27, width: '1%', marginRight: 6}}></p>


                            <MemberInput
                                title={'작업자'}
                                onChangeEvent={() => {
                                    setIsPoupup3(true);
                                    setWorker(check);
                                    setKeyword('')
                                }}
                                isMultiRegistered={false}
                                target={worker !== null ? {
                                    pk: worker.pk,
                                    name: worker.name + ' ' + worker.appointment,
                                    image: worker.photo
                                } : undefined}

                            />
                        </div>
                        <hr style={{border: 'solid 0.5px #d3d3d3', marginBottom: 10}}/>
                        <MemberInput
                            title={'공유자'}
                            onRemoveEvent={(idx: number) => {
                                const tempList = referencerList.slice()
                                tempList.splice(idx, 1)
                                setReferencerList(tempList)
                            }}
                            onChangeEvent={() => {
                                setIsPoupup4(true);
                                setCheckList4(referencerList);
                                setKeyword('')
                            }}
                            isMultiRegistered={true}
                            type={''}
                            contents={referencerList.map((v, i) => {
                                return (
                                    {
                                        pk: v.pk,
                                        name: v.name + ' ' + v.appointment,
                                        image: ""
                                    }
                                )
                            })}

                        />


                        {/* 파일 리스트 */}
                        <div style={{width: '100%'}}>
                            <hr style={{border: 'solid 0.5px #d3d3d3', marginBottom: 18, marginTop: 18,}}/>
                            <span className="p-bold" style={{width: 98, float: 'left', display: 'inline-block'}}>·  첨부 파일</span>
                            <input type="file" name="file" id={'machinePhoto'} style={{display: 'none'}}
                                   onChange={addFile}/>
                            <div style={{marginLeft: 108, color: 'black'}}>

                                {
                                    fileList.map((v, i) => {
                                        return (
                                            <FileTumbCard key={i}
                                                          name={v.name}
                                                          type={v.type}
                                                          url={v.url}
                                                          data={v}
                                                          onClickEvent={(e) => {
                                                              e.preventDefault();
                                                              const tempList = fileList.slice()
                                                              const tempPathList = pathList.slice()
                                                              const idx = fileList.indexOf(v)
                                                              tempList.splice(idx, 1)
                                                              tempPathList.splice(idx, 1)
                                                              setFileList(tempList)
                                                              setPathList(tempPathList)

                                                          }}
                                            />
                                        )
                                    })
                                }
                                {
                                    oldFileList.map((v, i) => {
                                        return (
                                            <FileTumbCard key={i}
                                                          name={v.name}
                                                          type={v.type}
                                                          url={v.url}
                                                          data={v}
                                                          onClickEvent={(e) => {
                                                              e.preventDefault();
                                                              const tempList = oldFileList.slice()
                                                              const tempRemoveList = removefileList.slice()
                                                              const idx = tempRemoveList.indexOf(v)
                                                              tempList.splice(idx, 1)
                                                              tempRemoveList.push(v.pk)
                                                              setRemoveFileList(tempRemoveList)
                                                              setOldFileList(tempList)
                                                          }}
                                            />
                                        )
                                    })
                                }
                                {
                                    fileList.length + oldFileList.length < 8 ?
                                        <label htmlFor="machinePhoto" style={{
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            display: 'inline-block ',
                                            marginRight: 12
                                        }}>
                                            <img src={IC_ADD} style={{width: 100, height: 70, objectFit: 'cover'}}/>
                                            <p className="p-limit" style={{width: 95, fontSize: 13}}>&nbsp;</p>
                                        </label>
                                        : null
                                }


                            </div>

                        </div>
                        <hr style={{border: 'solid 0.5px #d3d3d3', marginBottom: 18, marginTop: 18,}}/>
                        <RegisterButton name={isUpdate ? '수정하기' : '등록하기'}/>
                    </form>
                </WhiteBoxContainer>


                {/* 재료 검색창 */}
                <SearchModalContainer
                    onClickEvent={ //닫혔을 때 이벤트
                        () => {
                            setIsPoupup(false);
                            setList(checkList);
                            setKeyword('')
                        }
                    }
                    isVisible={isPoupup} onClickClose={() => {
                    setIsPoupup(false);
                    setKeyword('');
                    setSearchList([]);
                    setIsSearched(false)
                }} title={'생산제품 및 자재'}>
                    <SearchInput description={'키워드를 검색해주세요'} value={keyword}
                                 onChangeEvent={(e) => setKeyword(e.target.value)}
                                 onClickEvent={onClickSearch}/>
                    <div style={{width: '100%', marginTop: 20}}>
                        {
                            isSearched ?
                                searchList.map((v: IMaterial, i) => {
                                    return (

                                        <SearchedList key={i} pk={v.pk} widths={['40%', '45%', '15%']}
                                                      contents={[v.material_name, v.material_code !== undefined ? v.material_code : "", String(v.stock)]}
                                                      isIconDimmed={false}
                                                      isSelected={checkList.find((k) => k.pk === v.pk) ? true : false}
                                                      onClickEvent={() => {
                                                          const tempList = checkList.slice()
                                                          tempList.splice(0, 1, v)
                                                          setCheckList(tempList)
                                                      }}
                                        />

                                    )
                                })
                                :
                                null
                        }
                    </div>
                </SearchModalContainer>
                {/* 프로세스 검색창 */}
                <SearchModalContainer
                    onClickEvent={ //닫혔을 때 이벤트
                        () => {
                            setIsPoupup2(false);
                            setList2(checkList2);
                            setIsSearched(false);
                            setKeyword('')
                        }
                    }
                    isVisible={isPoupup2} onClickClose={() => {
                    setIsPoupup2(false)
                }} title={'공정 선택'}>
                    <>
                        <SearchInput description={'키워드를 검색해주세요'} value={keyword}
                                     onChangeEvent={(e) => setKeyword(e.target.value)}
                                     onClickEvent={onClickSearch}/>
                        <div style={{width: '100%', marginTop: 20}}>
                            {
                                isSearched ?
                                    searchList2.map((v: IProcess, i) => {
                                        return (

                                            <SearchedList key={i} pk={(v.pk !== undefined ? v.pk : '')}
                                                          widths={['18%', '20%', '20%', '20%', '21%']}
                                                          contents={[v.name !== undefined ? v.name : '', v.material !== undefined ? v.material.material_name : '', v.machine.machine_name, v.mold_name !== undefined ? v.mold_name : '', v.output.material_name]}
                                                          isIconDimmed={false}
                                                          isSelected={checkList2.find((k) => k.pk === v.pk) ? true : false}
                                                          onClickEvent={() => {
                                                              const tempList = checkList2.slice()
                                                              if (checkList2.find((k, index) => k.pk === v.pk)) {
                                                                  const idx = checkList2.indexOf(v)
                                                                  tempList.splice(idx, 1)
                                                                  setCheckList2(tempList)
                                                              } else {
                                                                  tempList.splice(0, 0, v)
                                                                  setCheckList2(tempList)
                                                              }
                                                          }}

                                            />
                                        )
                                    })
                                    :
                                    null
                            }
                        </div>
                    </>
                </SearchModalContainer>


                {/* 작업자 검색창 */}
                <SearchModalContainer
                    onClickEvent={ //닫혔을 때 이벤트
                        () => {
                            setIsPoupup3(false);
                            setWorker(check);
                            setIsSearched(false);
                            setKeyword('')
                        }
                    }
                    isVisible={isPoupup3} onClickClose={() => {
                    setIsPoupup3(false)
                }} title={'작업자 선택'}>
                    <>
                        <SearchInput description={'작업자를 검색해주세요'} value={keyword}
                                     onChangeEvent={(e) => setKeyword(e.target.value)}
                                     onClickEvent={onClickSearch}/>
                        <div style={{width: '100%', marginTop: 20}}>
                            {
                                isSearched ?
                                    searchList3.map((v: IMemberSearched, i) => {
                                        return (

                                            <SearchedList key={i} pk={v.pk} widths={['100%']}
                                                          contents={[v.name + ' ' + v.appointment]} isIconDimmed={false}
                                                          isSelected={check === v ? true : false}
                                                          onClickEvent={() => {
                                                              check === v ?
                                                                  setCheck(null)
                                                                  :
                                                                  setCheck(v)
                                                          }}

                                            />
                                        )
                                    })
                                    :
                                    null
                            }
                        </div>
                    </>
                </SearchModalContainer>

                {/* 참조자 검색창 */}
                <SearchModalContainer
                    onClickEvent={ //닫혔을 때 이벤트
                        () => {
                            setIsPoupup4(false);
                            setReferencerList(checkList4);
                            setIsSearched(false);
                            setKeyword('')
                        }
                    }
                    isVisible={isPoupup4} onClickClose={() => {
                    setIsPoupup4(false)
                }} title={'공유자 선택'}>
                    <>
                        <SearchInput description={'공유자를 검색해주세요'} value={keyword}
                                     onChangeEvent={(e) => setKeyword(e.target.value)}
                                     onClickEvent={onClickSearch}/>
                        <div style={{width: '100%', marginTop: 20}}>
                            {
                                isSearched ?
                                    searchList4.filter((f) => worker == null || f.pk !== worker.pk).map((v: IMemberSearched, i) => {
                                        return (

                                            <SearchedList key={i} pk={v.pk} widths={['100%']}
                                                          contents={[v.name + ' ' + v.appointment]} isIconDimmed={false}
                                                          isSelected={checkList4.find((k) => k.pk === v.pk) ? true : false}
                                                          onClickEvent={() => {
                                                              const tempList = checkList4.slice()
                                                              if (checkList4.find((k, index) => k.pk === v.pk)) {
                                                                  const idx = checkList4.indexOf(v)
                                                                  tempList.splice(idx, 1)
                                                                  setCheckList4(tempList)
                                                              } else {
                                                                  tempList.splice(0, 0, v)
                                                                  setCheckList4(tempList)
                                                              }
                                                          }}

                                            />
                                        )
                                    })
                                    :
                                    null
                            }
                        </div>
                    </>
                </SearchModalContainer>


            </InnerBodyContainer>

        </DashboardWrapContainer>

    );
}

const InputBox = Styled.input`
    border: solid 0.5px #d3d3d3;
    display: inline-block;
    font-size: 14px;
    padding: 6px;
    padding-left: 10px;
    width: 280px;
    background-color: #f4f6fa;
`


export default TaskRegister;
