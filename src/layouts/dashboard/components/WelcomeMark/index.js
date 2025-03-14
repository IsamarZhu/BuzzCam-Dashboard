import React from "react";

import { Card, Icon } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// import gif from "assets/images/cardimgfree.png";
// import wilddog from "assets/images/wilddog_welcome_card.jpg";
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
      <VuiBox sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', 
      }}>
        <VuiBox>
          <VuiTypography color="white" variant="h2" fontWeight="bold" mb="18px" sx={{
              textShadow: '5px 5px 5px rgba(79, 105, 129, 0.7)', // Slight dark blue shadow
            }}>
            BuzzCam Dashboard
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default WelcomeMark;
