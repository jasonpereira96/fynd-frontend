import React from 'react';
import MainGrid from './MainGrid';
import MainHeader from './MainHeader';
import DataSource from './../data/DataSource';
import {debounce} from './../utils/utils';


class MainScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chipsFilters: [],
            searchFilter: '',
            data: []
        };

        const DEBOUNCE_DELAY = 400;

        this.chipClicked = this.chipClicked.bind(this);
        this.filterChanged =  this.filterChanged.bind(this);
        this.onSearch = debounce(this.onSearch, DEBOUNCE_DELAY);
        this.onSearch = this.onSearch.bind(this);
    }
    componentDidMount() {
        var dataSource = new DataSource();
        var data = dataSource.getData();
        var genres = dataSource.getGenres();
        this.originalData = data.slice();
        this.setState({
            data: data,
            chipsFilters: genres.map((genre, index) => {
                return {
                    value: genre, applied: false, key: index
                };
            })
        });
    }
    render() {
        return <div className='main-screen'>
            <MainHeader chipClicked={this.chipClicked} 
                chipsFilters={this.state.chipsFilters} onSearch={this.onSearch} isAdmin={this.props.isAdmin}>    
            </MainHeader>
            <MainGrid data={this.state.data} isAdmin={this.props.isAdmin}></MainGrid>
        </div>
    }
    chipClicked(chip) {
        // console.log('clickedddd');
        var chipsFilters = this.state.chipsFilters.slice();
        for (var _chip of chipsFilters) {
            if (_chip.value === chip.value) {
                _chip.applied = !_chip.applied
                break;
            }
        }
        this.setState({
            chipsFilters
        });
        // this.filterChanged();
    }
    onSearch(event, data) {
        // console.log(searchBox);
        // event.persist();
        var searchString = data;
        this.setState({
            searchFilter: searchString
        });
        // this.filterChanged();
    }
    filterChanged() {
        var filteredData = this.originalData.slice();
        var { searchFilter, chipsFilters } = this.state;
        var appliedChipFilters = chipsFilters.filter(filter => filter.applied);

        filteredData = filteredData.filter(record => {
            return record.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                record.director.toLowerCase().includes(searchFilter.toLowerCase());
        });
        if (appliedChipFilters.length > 0) {
            filteredData = filteredData.filter(record => {
                for (var chipFilter of appliedChipFilters) {
                    if (!record.genres.includes(chipFilter.value)) {
                        return false;
                    }
                }
                return true;
            });
        }
        this.setState({
            data: filteredData
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.searchFilter !== this.state.searchFilter || prevState.chipsFilters !== this.state.chipsFilters) {
            this.filterChanged();
        }
    }   
}

export default MainScreen;