/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Card from "@mui/material/Card";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// React icons
import { BsCheckCircleFill } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { IoLogoCss3 } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { BsCreditCardFill } from "react-icons/bs";
import { SiDropbox } from "react-icons/si";
import { BsXCircleFill } from "react-icons/bs";
import { RiRedPacketFill } from "react-icons/ri";



// Vision UI Dashboard React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import AdobeXD from "examples/Icons/AdobeXD";

// Vision UI Dashboard theme imports
import palette from "assets/theme/base/colors";

function LastFivePackets({lastFivePackets}) {
  return (
    <Card className="h-100">
      <VuiBox mb="16px">
        <VuiTypography variant="lg" fontWeight="bold" mb="5px" color="white">
          Recent packets
        </VuiTypography>
        <VuiBox mb={2}>
          <VuiBox display="flex" alignItems="center">
            {/* <BsCheckCircleFill color="green" size="15px" mr="5px" />
            <VuiTypography variant="button" color="text" fontWeight="medium" ml="5px" mr="2px">
              +30%
            </VuiTypography>{" "} */}
            <VuiTypography variant="button" color="text" fontWeight="regular">
              Displaying data from the last five packets received
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </VuiBox>
      <VuiBox>
      {lastFivePackets.length > 0 ? (
        lastFivePackets.map((item, index) => (
          <TimelineItem
            key={index}
            icon={<RiRedPacketFill color="white" size="16px" />}
            title={`UID: ${item[0].header.systemUid}`}
            dateTime={`Received at: ${item[1]}`}
          />
        ))
      ) : (
        "N/A"
      )}
        {/* <TimelineItem
          icon={staticObstructed ? <BsCheckCircleFill color="red" size="16px"/> : <BsXCircleFill color="green" size="16px"/>}
          title="Particulate static obstructed"
          dateTime="Is the particulate obstructed by a static object"
        />
        <TimelineItem
          icon={staticObstructed ? <BsCheckCircleFill color="red" size="16px"/> : <BsXCircleFill color="green" size="16px"/>}
          title="Particulate dynamic obstructed"
          dateTime="Is the particulate obstructed by a dynamic object"
        />
        <TimelineItem
          icon={staticObstructed ? <BsCheckCircleFill color="red" size="16px"/> : <BsXCircleFill color="green" size="16px"/>}
          title="Particulate outside detection limits"
          dateTime="Is the particulate outside detection limits"
        /> */}
        {/* <TimelineItem
          icon={<BsCreditCardFill size="16px" color={palette.warning.main} />}
          title="New card added for order #4395133"
          dateTime="20 DEC 2:20 AM"
        />
        <TimelineItem
          icon={<SiDropbox size="16px" color={palette.primary.focus} />}
          title="New card added for order #4395133"
          dateTime="18 DEC 4:54 AM"
        />
        <TimelineItem icon={<AdobeXD size="20px" />} title="New order #9583120" dateTime="17 DEC" /> */}
      </VuiBox>
    </Card>
  );
}

export default LastFivePackets;
