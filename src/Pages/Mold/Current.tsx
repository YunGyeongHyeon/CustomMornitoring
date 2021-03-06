import React from "react";
import InnerBodyContainer from "../../Containers/InnerBodyContainer";
import DashboardWrapContainer from "../../Containers/DashboardWrapContainer";
import MoldCurrentContainer from "../../Containers/Mold/Current";

const MoldRegister = () => {
    return (
        <DashboardWrapContainer index={'mold'}>

            <InnerBodyContainer>
                <MoldCurrentContainer/>
            </InnerBodyContainer>
        </DashboardWrapContainer>
    )
}

export default MoldRegister
