import React from 'react';

import { Card } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import { IoHappy } from 'react-icons/io5';
import { MdSdStorage } from "react-icons/md";

import colors from 'assets/theme/base/colors';
import linearGradient from 'assets/theme/functions/linearGradient';
import CircularProgress from '@mui/material/CircularProgress';

const SatisfactionRate = ({ value, total }) => {
	const { info, gradients } = colors;
	const { cardContent } = gradients;

	return (
		<Card sx={{ height: '340px' }}>
			<VuiBox display='flex' flexDirection='column'>
				<VuiTypography variant='lg' color='white' fontWeight='bold' mb='4px'>
					SD Card State
				</VuiTypography>
				<VuiTypography variant='button' color='text' fontWeight='regular' mb='20px'>
					Space remaining in card:
				</VuiTypography>
				<VuiBox sx={{ alignSelf: 'center', justifySelf: 'center', zIndex: '-1' }}>
					<VuiBox sx={{ position: 'relative', display: 'inline-flex' }}>
						<CircularProgress variant='determinate' value={(value/total)*100} size={180} color='info' />
						<VuiBox
							sx={{
								top: 0,
								left: 0,
								bottom: 0,
								right: 0,
								position: 'absolute',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}>
							<VuiBox
								sx={{
									background: info.main,
									// transform: 'translateY(-80%)',
									width: '80px',
									height: '80px',
									borderRadius: '60%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center'
								}}>
								<MdSdStorage size='50px' color='#fff' />
							</VuiBox>
						</VuiBox>
					</VuiBox>
				</VuiBox>
				<VuiBox
					sx={({ breakpoints }) => ({
						width: '90%',
						padding: '18px 22px',
						display: 'flex',
						// justifyContent: 'space-between',
						justifyContent: 'center', // Updated this line
						alignItems: 'center',
						flexDirection: 'row',
						height: '82px',
						mx: 'auto',
						borderRadius: '20px',
						background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
						transform: 'translateY(-50%)',
						zIndex: '1000'
					})}>
					{/* <VuiTypography color='text' variant='caption' display='inline-block' fontWeight='regular'>
						0%
					</VuiTypography> */}
					<VuiBox
						flexDirection='column'
						display='flex'
						justifyContent='center'
						alignItems='center'
						sx={{ minWidth: '100px' }}>
						<VuiTypography color='white' variant='h3'>
							{value ? value : "N/A"}
						</VuiTypography>
						<VuiTypography color='text' variant='caption' fontWeight='regular'>
							GB
						</VuiTypography>
					</VuiBox>
					{/* <VuiTypography color='text' variant='caption' display='inline-block' fontWeight='regular'>
						100%
					</VuiTypography> */}
				</VuiBox>
			</VuiBox>
		</Card>
	);
};

export default SatisfactionRate;
