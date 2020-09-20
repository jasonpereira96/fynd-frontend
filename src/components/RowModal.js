import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function SimpleModal(props) {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState([]);

    const nameFieldRef = React.createRef();
    const directorFieldRef = React.createRef();
    const imdbFieldRef = React.createRef();
    const popularityFieldRef = React.createRef();
    const selectRef = React.createRef();

    function onRowSubmit() {
        var form = document.getElementById('row-form');
        if (!form.checkValidity()) {
            form.reportValidity();
        } else {
            // console.log(nameFieldRef);
            let nameField = document.getElementById('outlined-name');
            let directorField = document.getElementById('outlined-director');
            let imdbField = document.getElementById('outlined-imdb-score');
            let popularityField = document.getElementById('outlined-popularity');
            let select = document.getElementById('outlined-genres');

            props.onRowSubmit({
                name: nameField.value,
                director: directorField.value,
                imdb_score: parseFloat(imdbField.value),
                popularity: parseFloat(popularityField.value),
                genres: select.value.split(',')
            });

            setOpen(false);
        }
    }


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onChange = event => {
        setSelected(event.target.value);
    };

    var { chipsFilters } = props;
    var genres = chipsFilters.map(filter => filter.value);

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">New Row</h2>
            <form className={classes.root} autoComplete="off" id='row-form'>
                <TextField id="outlined-name" label="Name" variant="outlined" required placeholder='Name' ref={nameFieldRef} />
                <br />
                <br />
                <TextField id="outlined-director" label="Director" variant="outlined" required placeholder='Director' ref={directorFieldRef}/>
                <br />
                <br />
                <TextField id="outlined-imdb-score" label="IMDB Score" variant="outlined" required placeholder='IMDB Score' type='number' ref={imdbFieldRef} inputProps={{step:'any'}}/>
                <br />
                <br />
                <TextField id="outlined-popularity" label="Popularity" variant="outlined" required placeholder='Popularity' type='number' ref={popularityFieldRef}/>
                <br />
                <br />
                <Select multiple={true} value={selected} label='Genre' input={<Input id='outlined-genres'/>}
                    variant='outlined' required placeholder='Genre' renderValue={(selected) => selected.join(', ')}
                    onChange={onChange} ref={selectRef}>
                    {/* <MenuItem key={'A'} value={'A'}>
                        <Checkbox checked={true} />
                        A
                    </MenuItem>
                    <MenuItem key={'B'} value={'B'}>
                        <Checkbox checked={true} />
                        B
                    </MenuItem>
                    <MenuItem key={'C'} value={'C'}>
                        <Checkbox checked={true} />
                        C
                    </MenuItem> */}
                    {genres.map((genre) => {
                        return <MenuItem key={genre} value={genre}>
                            <Checkbox checked={selected.includes(genre)} />
                            {genre}
                        </MenuItem>;
                    })}
                </Select>
                <br />
                <br />
                <Button type='button' variant='contained' color='primary' onClick={onRowSubmit}>Add</Button>
            </form>
        </div>
    );

    return (
        <div>
            <Button onClick={handleOpen} color='primary' variant='contained'>
                New Row
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}
