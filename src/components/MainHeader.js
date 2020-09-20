import React from 'react';
import ChipsArray from './ChipsArray';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import RowModal from './RowModal';
import ErrorHandler from './ErrorHandler';

class MainHeader extends React.Component {

    constructor(props) {
        super(props);
        this.onPasswordSubmit = this.onPasswordSubmit.bind(this);
        this.onPasswordKeyPress = this.onPasswordKeyPress.bind(this);
        this.onGenreSubmit = this.onGenreSubmit.bind(this);
        this.onRowSubmit = this.onRowSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            modalOpen: false
        };
    }

    render() {
        var { onSearch } = this.props;
        var { isAdmin } = this.props;
        var { verified } = this.props;
        if (isAdmin) {
            var thirdDiv = <div id='admin-button-div'></div>;

            var passwordField = <>
                <TextField type='text' id='username-input' placeholder='Username'></TextField>
            &nbsp; &nbsp;
                <TextField type='password' id='password-input' placeholder='Password' onKeyPress={(e) => this.onPasswordKeyPress(e)}></TextField>
            &nbsp; &nbsp; &nbsp; &nbsp;
                <Button color='primary' variant='contained' onClick={this.onPasswordSubmit}>Go</Button>
            </>;
        } else {
            var thirdDiv = <div id='admin-button-div'>
                <Button color='primary' variant='contained'><Link to='/admin'>Admin Panel</Link></Button>
            </div>;
            var passwordField = <div></div>;

        }
        return (
            <div className='main-header'>
                <div className='heading'>
                    <div></div>
                    <div><Typography variant="h3" gutterBottom>Movies Database</Typography></div>
                    {thirdDiv}
                </div>
                <div>
                    {passwordField}
                </div>
                <br />
                <TextField type='text' id='search-input' onChange={(e, data) => { onSearch(e, e.target.value + '') }}
                    placeholder='Search...'
                ></TextField>
                <ChipsArray chipClicked={this.props.chipClicked} chipsFilters={this.props.chipsFilters}></ChipsArray>
                {this.getProtectedInputs()}
                {/* {modal} */}
            </div>
        )
    }
    onPasswordSubmit() {
        var username = document.getElementById('username-input').value;
        var password = document.getElementById('password-input').value;
        this.props.onPasswordSubmit(username, password);
    }

    onGenreSubmit() {
        var genreInput = document.getElementById('genre-input');
        var newGenre = genreInput.value;
        if (newGenre.length > 0) {
            this.props.onGenreSubmit(newGenre);
        } else {
            ErrorHandler.showError('genre cannot be empty');
        }
    }

    onPasswordKeyPress(e) {
        if (e.key === 'Enter') {
            this.onPasswordSubmit();
        }
    }

    getProtectedInputs() {
        var { verified, chipsFilters } = this.props;
        if (verified) {
            return <>
                <br />
                <TextField type='text' placeholder='Add Genre' inputProps={{id: 'genre-input'}}></TextField>
            &nbsp; &nbsp; &nbsp; &nbsp;
                <Button color='primary' variant='contained' onClick={this.onGenreSubmit}>Add Genre</Button>
            &nbsp; &nbsp; &nbsp; &nbsp;
                <br/>
                <br/>
                <RowModal chipsFilters={chipsFilters} onRowSubmit={this.onRowSubmit}></RowModal>
            </>;
        } else {
            return <></>;
        }
    }
    onRowSubmit(rowInfo) {
        console.log('row submitted');
        console.log(rowInfo);
        let changes = {
            added: [rowInfo]
        };
        this.props.onDataEdit(changes);
    }
    handleClose() {
        this.setState({
            modalOpen: false
        });
    }
}
export default MainHeader;  