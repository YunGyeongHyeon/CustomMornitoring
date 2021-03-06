import React from 'react'
import DashboardWrapContainer from '../../Containers/DashboardWrapContainer'
import InnerBodyContainer from '../../Containers/InnerBodyContainer'
import LoadtonContiner from '../../Containers/PM_Statistics/Loadton'


const ErrorStatistics = ({match}: any) => {

  const {id} = match.params

  return (
    <DashboardWrapContainer index={'statistics'}>

      <InnerBodyContainer>
        <LoadtonContiner/>


      </InnerBodyContainer>
    </DashboardWrapContainer>
  )
}


export default ErrorStatistics
