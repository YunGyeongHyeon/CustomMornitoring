import InnerBodyContainer from '../../Containers/InnerBodyContainer'
import DashboardWrapContainer from '../../Containers/DashboardWrapContainer'
import React from 'react'
import WorkHistoryRegisterContainer from '../../Containers/Project/WorkHistoryRegister'

const WorkHistoryRegister = ({match}) => {
  return (
    <DashboardWrapContainer index={'project'}>
      <InnerBodyContainer>
        <WorkHistoryRegisterContainer match={match}/>
      </InnerBodyContainer>
    </DashboardWrapContainer>
  )
}

export default WorkHistoryRegister
