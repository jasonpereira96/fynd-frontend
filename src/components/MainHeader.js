import React from 'react';
import ChipsArray from './ChipsArray';
import { TextField } from '@material-ui/core';

class MainHeader extends React.Component {
    render() {
        var { onSearch } = this.props;
        return (
            <div className='main-header'>
                <h1>Movies Database</h1>
                <label>Search:</label>
                &nbsp;
                <TextField type='text' id='search-input' onChange={(e, data) => {onSearch(e, e.target.value + '')}}></TextField>
                <ChipsArray chipClicked={this.props.chipClicked} chipsFilters={this.props.chipsFilters}></ChipsArray>
            </div>
        )
    }
    onButtonClicked() {

    }
}
export default MainHeader;  