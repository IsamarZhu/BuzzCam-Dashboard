import React from "react";

import { Card, Icon } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

import gif from "assets/images/cardimgfree.png";
import wilddog from "assets/images/wilddog_welcome_card.jpg";
import buzzcam_welcome_card from "assets/images/buzzcam_welcome_card.jpg";


const WelcomeMark = () => {
  return (
    <Card sx={() => ({
      height: "340px",
      py: "32px",
      backgroundImage: `url(${buzzcam_welcome_card})`,
      backgroundSize: "cover",
      backgroundPosition: "50%"
    })}>
      <VuiBox height="100%" display="flex" flexDirection="column" justifyContent="space-between">
        <VuiBox>
          <VuiTypography color="white" variant="button" fontWeight="regular" mb="12px">
            Welcome back to
          </VuiTypography>
          <VuiTypography color="white" variant="h3" fontWeight="bold" mb="18px">
            BuzzCam Dashboard
          </VuiTypography>
          <VuiTypography color="white" variant="h6" fontWeight="regular" mb="auto">
            Viewing current device information
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default WelcomeMark;
