import React from 'react'
import InnerBodyContainer from '../../../Containers/InnerBodyContainer'
import DashboardWrapContainer from '../../../Containers/DashboardWrapContainer'
import MoldManageListContainer from '../../../Containers/SQManage/Mold/MoldManageListContainer'

const MoldManageList: React.FunctionComponent = () => {

  return (
    <DashboardWrapContainer index={'sq'}>
      <InnerBodyContainer>
        <MoldManageListContainer/>


      </InnerBodyContainer>
    </DashboardWrapContainer>
  )
}

export default MoldManageList
