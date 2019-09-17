import React from 'react';
import { Typography, Link } from "@material-ui/core";

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://unc.br/">
				PPUnC
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	)
}

export default Copyright