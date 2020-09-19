import React from 'react';
import MainGrid from './MainGrid';
import MainHeader from './MainHeader';
import DataSource from './../data/DataSource';


class MainScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chipsFilters: [],
            searchFilter: '',
            data: []
        };
        this.chipClicked = this.chipClicked.bind(this);
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
            <MainHeader chipClicked={this.chipClicked} chipsFilters={this.state.chipsFilters}></MainHeader>
            <MainGrid data={this.state.data}></MainGrid>
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
        this.filterChanged();
    }
    filterChanged() {
        var filteredData = this.originalData.slice();
        var { searchFilter, chipsFilters } = this.state;
        var appliedChipFilters = chipsFilters.filter(filter => filter.applied);

        filteredData = filteredData.filter(record => {
            return record.name.indexOf(searchFilter) !== -1 || record.director.indexOf(searchFilter) !== -1;
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
}

export default MainScreen;