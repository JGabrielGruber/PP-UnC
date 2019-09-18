import React from 'react';
import { Typography, Link } from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite'

function Copyright() {
	return (
		<div>
			<Typography variant="body2" color="textSecondary" align="center">
				{'Copyright © '}
				<Link color="inherit" href="https://www.unc.br/">
					UnC
				</Link>{' '}
				{new Date().getFullYear()}
				{'.'}
			</Typography>
			<Typography variant="body2" color="textSecondary" align="center">
				{'Made with '} <FavoriteIcon style={{fontSize: "0.875rem"}} /> {' by '}
				<Link color="inherit" href="https://www.github.com/JGabrielGruber">
					J. Gabriel Gruber
				</Link>
			</Typography>
		</div>
	)
}

export default Copyright