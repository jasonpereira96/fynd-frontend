import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/icons/TagFaces';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
		listStyle: 'none',
		padding: theme.spacing(0.5),
		margin: 0,
	},
	chip: {
		margin: theme.spacing(0.5),
	},
}));

export default function ChipsArray(props) {
	const classes = useStyles();
	/*const [chipData, setChipData] = React.useState([
		{ key: 0, label: 'Angular' },
		{ key: 1, label: 'jQuery' },
		{ key: 2, label: 'Polymer' },
		{ key: 3, label: 'React' },
		{ key: 4, label: 'Vue.js' },
	]);*/
	const chipFilters = props.chipsFilters;
	/*
	const handleDelete = (chipToDelete) => () => {
		setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
	};*/
	const handleClick = (chip) => () => {
		console.log(chip);
		props.chipClicked(chip);
	};
	return (
		<Paper component="ul" className={classes.root}>
			{chipFilters.map((chipFilter) => {
				return (
					<li key={chipFilter.key}>
						<Chip
							label={chipFilter.value}
							className={classes.chip}
							onClick={handleClick(chipFilter)}
						// color={props.chipsFilters.includes('React') ? 'secondary' : ''}
							color={chipFilter.applied ? 'primary' : 'secondary'}
						/>
					</li>
				);
			})}
		</Paper>
	);
}
