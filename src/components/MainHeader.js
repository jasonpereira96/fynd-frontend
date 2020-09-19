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

class MainHeader extends React.Component {

    constructor(props) {
        super(props);
        this.onPasswordSubmit = this.onPasswordSubmit.bind(this);
        this.onGenreSumbit = this.onGenreSumbit.bind(this);
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
                <TextField type='password' id='password-input' placeholder='Password'></TextField>
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
                {this.getGenreField()}
            </div>
        )
    }
    onPasswordSubmit() {
        var username = document.getElementById('username-input').value;
        var password = document.getElementById('password-input').value;
        this.props.onPasswordSubmit(username, password);
    }

    onGenreSumbit() {
        
    }

    getGenreField() {
        var { verified } = this.props;
        if (verified) {
            return <>
                <br />
                <TextField type='text' id='genre-input' placeholder='Add Genre'></TextField>
            &nbsp; &nbsp; &nbsp; &nbsp;
                <Button color='primary' variant='contained' onClick={this.onGenreSumbit}>Add Genre</Button>
            </>;
        } else {
            return <></>;
        }
    }
}
export default MainHeader;  