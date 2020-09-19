import React from 'react';
import ChipsArray from './ChipsArray';

class MainHeader extends React.Component {
    render() {
        return (
            <div className='main-header'>
                <h1>Movies Database</h1>
                <label>Search:</label>
                &nbsp;
                <input type='text' id='search-input'></input>
                &nbsp;
                <button type='button' value='Search' onClick={this.onButtonClicked.bind(this)}>Search</button>
                <ChipsArray chipClicked={this.props.chipClicked} chipsFilters={this.props.chipsFilters}></ChipsArray>
            </div>
        )
    }
    onButtonClicked() {
        
    }
}
export default MainHeader;  