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
    render() {
        var { onSearch } = this.props;
        var { isAdmin } = this.props;

        if (isAdmin) {
            var thirdDiv = <div id='admin-button-div'></div>
        } else {
            var thirdDiv = <div id='admin-button-div'>
                <Button color='primary' variant='contained'><Link to='/admin'>Admin Panel</Link></Button>
            </div>
        }
        return (
            <div className='main-header'>
                <div className='heading'>
                    <div></div>
                    <div><Typography variant="h3" gutterBottom>Movies Database</Typography></div>
                    {thirdDiv}
                </div>
                <TextField type='text' id='search-input' onChange={(e, data) => { onSearch(e, e.target.value + '') }}
                    placeholder='Search...'
                ></TextField>
                <ChipsArray chipClicked={this.props.chipClicked} chipsFilters={this.props.chipsFilters}></ChipsArray>
            </div>
        )
    }
    onButtonClicked() {

    }
}
export default MainHeader;  