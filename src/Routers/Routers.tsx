import React, {useContext, useEffect} from 'react';
import { Route, Switch, Router } from 'react-router-dom';
//import {UserDataProvider, UserDataContext} from '../Context/UserData';


// 경로 모음
// ./Pages/Welcome
import Welcome from '../Pages/Welcome/Welcome'
import Login from '../Pages/Welcome/Login'
import Email from '../Pages/Welcome/Email'
import Auth from '../Pages/Welcome/Auth'
import ForgotPw from '../Pages/Welcome/ForgotPw'
import ChangePw from '../Pages/Welcome/ChangePw'
import Signup from '../Pages/Welcome/Signup'
import Complete from '../Pages/Welcome/Complete'

// ./Pages/Dashboard
import Dashboard from '../Pages/Dashboard/Index';

// manage (인사관리)
import AcceptMember from '../Pages/Manage/Accept'
import CompanySetting from '../Pages/Manage/Setting'
import CompanyMembers from '../Pages/Manage/Members'
import UpdateMember from '../Pages/Manage/Update'

// my (마이페이지)
import MyPage from '../Pages/My/MyPage'

// 데이터 등록
import RegisterMachine from '../Pages/Register/Machine';
import RegisterSubMachine from '../Pages/Register/SubMachine';
import RegisterLine from '../Pages/Register/Line';
import RegisterMaterial from '../Pages/Register/Material';
import RegisterDesign from '../Pages/Register/Design'
import RegisterProcess from '../Pages/Register/Process'
import RegisterBarcode from '../Pages/Barcode/ProductRegister'
import RegisterClient from '../Pages/Client/Register'

// 데이터조회
import DesignList from '../Pages/List/Design';
import MachineList from '../Pages/List/Machine';
import SubList from '../Pages/List/SubMachine';
import LineList from '../Pages/List/Line';
import MaterialList from '../Pages/List/Material';
import MaterialStock from '../Pages/Stock/Material';
import ProductStock from '../Pages/Stock/Product';
import ProcessList from '../Pages/List/Process';
import ClientList from '../Pages/Client/List';
import BarcodeList from '../Pages/Barcode/List';
import BarcodeSetting from '../Pages/Barcode/Setting';

// 어드민, 데이터 등록 관련
import SuperRegister from '../Pages/Super/Register';
import SuperList from '../Pages/Super/List';
import RegisterTask from '../Pages/Task/TaskRegister';
import TaskList from '../Pages/Task/TaskList';
import PressMonitoring from '../Pages/Monitoring/Press';
import LoadMonitoring from '../Pages/Monitoring/Load';
import StatusList from '../Pages/List/Status';
import RegisterProduct from '../Pages/Register/Product';
import ProductList from '../Pages/List/Product';
import Charts from '../Pages/Service/Charts';
import ServiceDesk from '../Pages/Service/ServiceDesk';
import Reports from '../Pages/Service/Reports';
import OnlyChrome from '../Pages/Service/OnlyChrome';
import Ranks from '../Pages/Manage/Ranks'
import Teams from '../Pages/Manage/Teams'
import BuyList from '../Pages/Client/Buy';
import SellList from '../Pages/Client/Sell';
import ChangeStockIn from '../Pages/Stock/ChangeIn'
import ChangeStockOut from '../Pages/Stock/ChangeOut'
import RegisterInferior from  '../Pages/Quality/Register';
import OutsourcingList from '../Pages/Outsourcing/List';
import OutsourcingRegister from '../Pages/Outsourcing/Register';
import Order from '../Pages/Outsourcing/Order';
import Contract from '../Pages/Outsourcing/Contract';
import BarcodeProductList from '../Pages/Barcode/ProductList'
import ProductRegister from '../Pages/Barcode/ProductRegister';
import MaintenanceRegister from '../Pages/Maintenance/register';
import StockView from '../Pages/Stock/View'

import PressRecommend from '../Pages/Process/Press';
import StockList from '../Pages/Stock/List';
import ProductStockList from '../Pages/Stock/Product';
import StockInList from '../Pages/Stock/In';
import StockOutList from '../Pages/Stock/Out'
import DefectiveList from '../Pages/Quality/DefectiveList'
import DefectiveRegister from '../Pages/Quality/DefectiveRegister'
import MaintenanceHistory from '../Pages/Maintenance/history';
import BasicBarcodeList from '../Pages/List/Barcode';
import BasicBarcodeRegister from '../Pages/Register/Barcode';
import StockHistory from '../Pages/Stock/History';
import ProductKpi from '../Pages/Kpi/ProductKpi';
import QualityKpi from '../Pages/Kpi/QualityKpi';
import PriceKpi from '../Pages/Kpi/PriceKpi';
import DuedateKpi from '../Pages/Kpi/DuedateKpi';
import PressStatistics from '../Pages/Statistics/PressStatistics';
import LoadStatistics from '../Pages/Statistics/LoadStatistics';
import CmsMonitoring from '../Pages/Monitoring/CMS';
import FullMonitoring from '../Pages/Monitoring/Full';
import CmsStatistics from '../Pages/Monitoring/Statistics';
import LoadtonMonitoring from '../Pages/Monitoring/Loadton';

import InputKeyin from '../Pages/Keyin/InputKeyin';
import KeyinList from '../Pages/Keyin/keyinList';
import SettingKeyin from '../Pages/Keyin/SetKeyin';
import ListKeyin from '../Pages/Keyin/ListKeyin';
import MachineManageMaintenance from '../Pages/Maintenance/machine';
import InputKeyinPress from '../Pages/KeyinInput/press';
import InputKeyinMold from '../Pages/KeyinInput/mold';
import InputKeyinMilling from '../Pages/KeyinInput/milling';
import InputKeyinTab from '../Pages/KeyinInput/tab';
import InputKeyinSunban from '../Pages/KeyinInput/sunban';
import InputKeyinWelding from '../Pages/KeyinInput/welding';
import InputKeyinMaterial from '../Pages/KeyinInput/material';
import ListKeyinPress from '../Pages/KeyinList/press';
import ListKeyinMaterial from '../Pages/KeyinList/material';
import ListKeyinWelding from '../Pages/KeyinList/welding';
import ListKeyinMold from '../Pages/KeyinList/mold';
import ListKeyinMilling from '../Pages/KeyinList/milling';
import ListKeyinSunban from '../Pages/KeyinList/sunban';
import ListKeyinTab from '../Pages/KeyinList/tab';
import SetKeyinPress from '../Pages/KeyinSet/press';
import SetKeyinMaterial from '../Pages/KeyinSet/material';
import SetKeyinWelding from '../Pages/KeyinSet/welding';
import SetKeyinSunban from '../Pages/KeyinSet/sunban';
import SetKeyinMilling from '../Pages/KeyinSet/milling';
import SetKeyinMold from '../Pages/KeyinSet/mold';
import SetKeyinTab from '../Pages/KeyinSet/tab';
import OilMaintenance from '../Pages/Maintenance/oil';
import MotorRotationMaintenance from '../Pages/Maintenance/motorRotation';
import ErrorCodeMaintenance from '../Pages/Maintenance/errorcode';
import SearchMaintenance from '../Pages/Maintenance/search';
import MaintenanceList from '../Pages/Maintenance/list';
import MachineMaintenance from '../Pages/Maintenance/machine';
import SubmachineMaintenance from '../Pages/Maintenance/submachine';
import MoldMaintenance from '../Pages/Maintenance/mold';
import ReadyTimeStatistics from '../Pages/Statistics/ReadyTimeStatistics';
import QdcTimeStatistics from '../Pages/Statistics/QdcTimeStatistics'
const Routers = () => {

    //const { isLoggedIn } = useContext(UserDataContext);
  
    useEffect(()=>{
      const browse = navigator.userAgent.toLowerCase(); 
      console.log('broswercheck : ' + navigator.userAgent + ' ' + window.location.pathname)
   
        
      if( (browse.indexOf('trident') != -1) || (browse.indexOf("msie") != -1) || browse.indexOf("edge") > -1) {
          if(window.location.pathname !== '/oops')  {
            window.location.href='/oops'
          }
      }
      

    },[])

  return (
    <div>
        <Switch>


            {/* 0.0 인트로 */}
            <Route exact path="/" component={Welcome} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/email" component={Email} />
            <Route exact path="/auth" component={Auth} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/complete" component={Complete} />
            <Route exact path="/forgot" component={ForgotPw} />
            <Route exact path="/password" component={ChangePw} />
            <Route exact path="/oops" component={OnlyChrome} />

            {/* 1.0 홈 */}
            <Route exact path="/dashboard" component={Dashboard} />

            {/* 2.0 기준정보관리 */}
              
            <Route exact path="/list/design" component={DesignList} />
            <Route exact path="/list/machine" component={MachineList} />
            <Route exact path="/list/submachine" component={SubList} />
            <Route exact path="/list/barcode" component={BasicBarcodeList} />
            <Route exact path="/list/material" component={MaterialList} />
          
            <Route exact path="/register/material" component={RegisterMaterial} />
            <Route exact path="/register/design" component={RegisterDesign} />
            <Route exact path="/register/machine" component={RegisterMachine} />
            <Route exact path="/register/submachine" component={RegisterSubMachine} />
            <Route exact path="/register/barcode" component={BasicBarcodeRegister}/>
            <Route exact path="/update/barcode" component={BasicBarcodeRegister}/>
            
            <Route exact path="/update/design" component={RegisterDesign} />
            <Route exact path="/update/machine" component={RegisterMachine} />
            <Route exact path="/update/submachine" component={RegisterSubMachine} />
            <Route exact path="/update/line" component={RegisterLine} />
            <Route exact path="/update/material" component={RegisterMaterial} />
            <Route exact path="/update/product" component={RegisterProduct} />
          
                  
            {/* 3.0 인사관리 */}
            <Route exact path="/manage/accept" component={AcceptMember} />
            <Route exact path="/manage/setting" component={CompanySetting}/>
            <Route exact path="/manage/teams" component={Teams}/>
            <Route exact path="/manage/rank" component={Ranks}/>
            <Route exact path="/manage/members" component={CompanyMembers}/>
            <Route exact path="/manage/members/update" component={UpdateMember}/>

            {/* 4.0 거래처관리 */}
            <Route exact path="/client/buy" component={BuyList} />
            <Route exact path="/client/sell" component={SellList} />
            <Route exact path="/client/list" component={ClientList}/> 
            <Route exact path="/update/client" component={RegisterClient}/>
            <Route exact path="/register/client" component={RegisterClient}/>
            <Route exact path="/list/client" component={ClientList} />

            {/* 5.0 외주관리 */}
            <Route exact path="/update/outsourcing" component={OutsourcingRegister}/>
            <Route exact path="/register/outsourcing" component={OutsourcingRegister}/>
            <Route exact path="/outsourcing/list" component={OutsourcingList}/>
            <Route exact path="/outsourcing/order" component={Order}/>
            <Route exact path="/outsourcing/contract" component={Contract}/>
       
            {/* 6.0 바코드 관리 */}
            <Route exact path="/list/barcode/product" component={BarcodeProductList}/>
            <Route exact path="/connect/barcode" component={ProductRegister}/>
            <Route exact path="/connect/barcode/update" component={ProductRegister}/>  
            <Route exact path="/barcode/register" component={RegisterBarcode}/>
         
            {/* 7.0 보전 관리 */}
            <Route exact path="/maintenance/machine" component={MachineMaintenance} />
            <Route exact path="/maintenance/submachine" component={SubmachineMaintenance} />
            <Route exact path="/maintenance/mold" component={MoldMaintenance} />
            <Route exact path="/maintenance/register" component={MaintenanceRegister} />
            <Route exact path="/maintenance/list" component={MaintenanceList} />
            <Route exact path="/maintenance/history" component={MaintenanceHistory} />
            <Route exact path="/maintenance/search" component={SearchMaintenance} />
            <Route exact path="/maintenance/errorcode" component={ErrorCodeMaintenance} />
            <Route exact path="/maintenance/motor" component={MotorRotationMaintenance} />
            <Route exact path="/maintenance/oil" component={OilMaintenance} />
          

             {/* 8.0 공정 관리 */}
            <Route exact path="/process/register" component={RegisterProcess} />
            <Route exact path="/process/list" component={ProcessList} />
            <Route exact path="/recommend/press" component={PressRecommend} />
            <Route exact path="/register/process" component={RegisterProcess}/>
            <Route exact path="/list/process" component={ProcessList} />
            <Route exact path="/update/process" component={RegisterProcess}/>
          

            {/* 9.0 작업지시서 관리 */}
            <Route exact path="/task/register" component={RegisterTask}/>
            <Route exact path="/task/list" component={TaskList}/>
            <Route exact path="/task/update" component={RegisterTask}/>
            
            
             {/* 10.0 재고관리 */}
            <Route exact path="/stock/list" component={StockList} />
            <Route exact path="/stock/product" component={ProductStockList} />
            <Route exact path="/stock/in" component={StockInList} />
            <Route exact path="/stock/out" component={StockOutList} />
            <Route exact path="/stock/product" component={ProductStock} />
            <Route exact path="/stock/material" component={MaterialStock} />
            <Route exact path="/stock/history" component={StockHistory}/>
            <Route exact path="/stock/change/in" component={ChangeStockIn}/>
            <Route exact path="/stock/change/out" component={ChangeStockOut}/>
            <Route exact path="/stock/view" component={StockView}/>

             {/* 11.0 품질관리 */}
             <Route exact path="/defective/register" component={DefectiveRegister} />
            <Route exact path="/defective/list" component={DefectiveList} />
            <Route exact path="/inferior/register" component={RegisterInferior}/>
           
          
             {/* 12.0 키인 */}
            <Route exact path="/keyin/input/press" component={InputKeyinPress} />
            <Route exact path="/keyin/input/press" component={InputKeyinPress} />
            <Route exact path="/keyin/input/material" component={InputKeyinMaterial} />
            <Route exact path="/keyin/input/welding" component={InputKeyinWelding} />
            <Route exact path="/keyin/input/sunban" component={InputKeyinSunban} />
            <Route exact path="/keyin/input/tab" component={InputKeyinTab} />
            <Route exact path="/keyin/input/mold" component={InputKeyinMold} />
            <Route exact path="/keyin/input/milling" component={InputKeyinMilling} />

            <Route exact path="/keyin/list/press" component={ListKeyinPress} />
            <Route exact path="/keyin/list/press" component={ListKeyinPress} />
            <Route exact path="/keyin/list/material" component={ListKeyinMaterial} />
            <Route exact path="/keyin/list/welding" component={ListKeyinWelding} />
            <Route exact path="/keyin/list/sunban" component={ListKeyinSunban} />
            <Route exact path="/keyin/list/tab" component={ListKeyinTab} />
            <Route exact path="/keyin/list/mold" component={ListKeyinMold} />
            <Route exact path="/keyin/list/milling" component={ListKeyinMilling} />
           
            <Route exact path="/keyin/set/press" component={SetKeyinPress} />
            <Route exact path="/keyin/set/press" component={SetKeyinPress} />
            <Route exact path="/keyin/set/material" component={SetKeyinMaterial} />
            <Route exact path="/keyin/set/welding" component={SetKeyinWelding} />
            <Route exact path="/keyin/set/sunban" component={SetKeyinSunban} />
            <Route exact path="/keyin/set/tab" component={SetKeyinTab} />
            <Route exact path="/keyin/set/mold" component={SetKeyinMold} />
            <Route exact path="/keyin/set/milling" component={SetKeyinMilling} />
          
            {/* 13.0 모니터링 */}
            <Route exact path="/monitoring/full" component={FullMonitoring}/>
            <Route exact path="/monitoring/loadton" component={LoadtonMonitoring} />
            <Route exact path="/monitoring/cms" component={CmsMonitoring}/>
            <Route exact path="/monitoring/statistics" component={CmsStatistics}/>      
            <Route exact path="/monitoring/press" component={PressMonitoring}/>
            <Route exact path="/monitoring/load" component={LoadMonitoring}/>
        
            {/* 14.0 KPI 생산지수 */}
            <Route exact path="/kpi/product" component={ProductKpi} />
            <Route exact path="/kpi/quality" component={QualityKpi} />
            <Route exact path="/kpi/price" component={PriceKpi} />
            <Route exact path="/kpi/duedate" component={DuedateKpi} />
             
            {/* 15.0 프레스 분석 및 통계 */}
            <Route exact path="/statistics/press" component={PressStatistics} />
            <Route exact path="/statistics/load" component={LoadStatistics} />
            <Route exact path="/statistics/readytime" component={ReadyTimeStatistics} />
            <Route exact path="/statistics/qdctime" component={QdcTimeStatistics} />

            {/* 16.0 서비스 */}
            <Route exact path="/service" component={ServiceDesk}/>
            
            {/* 17.0 마이페이지 */}
            <Route exact path="/mypage" component={MyPage}/>

            {/*슈퍼 어드민*/}
            <Route exact path="/super/register" component={SuperRegister} />
            <Route exact path="/super/list" component={SuperList} />


            {/* 안쓰는것 */}
            <Route exact path="/register/product" component={RegisterProduct} />
            <Route exact path="/register/line" component={RegisterLine} />     
            <Route exact path="/status" component={StatusList}/> 
            <Route exact path="/list/line" component={LineList} />
            <Route exact path="/charts" component={Charts}/>
            <Route exact path="/reports" component={Reports}/>
            <Route exact path="/list/product" component={ProductList} />
            <Route exact path="/barcode/setting" component={BarcodeSetting}/>
            
        </Switch>
    </div>
  );
}

export default Routers;
