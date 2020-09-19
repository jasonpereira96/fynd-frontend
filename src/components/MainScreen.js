import React from 'react';
import MainGrid from './MainGrid';
import MainHeader from './MainHeader';
import DataSource from './../data/DataSource';
import { debounce } from './../utils/utils';


class MainScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chipsFilters: [],
            searchFilter: '',
            data: [],
            // originalData: [],
            verified: false,
            genres: []
        };

        const DEBOUNCE_DELAY = 400;

        this.chipClicked = this.chipClicked.bind(this);
        this.filterChanged = this.filterChanged.bind(this);
        this.onPasswordSubmit = this.onPasswordSubmit.bind(this);
        this.onSearch = debounce(this.onSearch, DEBOUNCE_DELAY);
        this.onSearch = this.onSearch.bind(this);
        this.onDataEdit = this.onDataEdit.bind(this);
    }
    componentDidMount() {
        var dataSource = new DataSource();
        var me = this;
        Promise.all([dataSource.getData(), dataSource.getGenres()]).then(([data, genres]) => {
            me.originalData = data.slice();
            me.setState({
                data: data,
                chipsFilters: genres.map((genre, index) => {
                    return {
                        value: genre, applied: false, key: index
                    };
                }),
                genres
            });
        });
    }
    render() {
        return <div className='main-screen'>
            <MainHeader chipClicked={this.chipClicked}
                chipsFilters={this.state.chipsFilters} onSearch={this.onSearch} isAdmin={this.props.isAdmin}
                onPasswordSubmit={this.onPasswordSubmit} verified={this.state.verified}>
            </MainHeader>
            <MainGrid data={this.state.data} isAdmin={this.props.isAdmin} verified={this.state.verified}
                genres={this.state.genres} onDataEdit={this.onDataEdit}
            ></MainGrid>
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
    onPasswordSubmit(username, password) {
        console.log('username: ' + username + ' password: ' + password);
        var dataSource = new DataSource();
        dataSource.verifyCredentials({
            username, password
        }).then(({ valid }) => {
            if (valid) {
                this.setState({
                    verified: true
                });
            }
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.searchFilter !== this.state.searchFilter || prevState.chipsFilters !== this.state.chipsFilters) {
            this.filterChanged();
        }
    }
    onDataEdit(changes) {
        let { added, changed, deleted } = changes;
        console.log(changes);
        var dataSource = new DataSource();
        if (deleted && Array.isArray(deleted) && deleted.length > 0) {
            deleted.forEach(recordId => {
                dataSource.deleteRecord(recordId);
            });
            var toDelete = new Set(deleted);
            let newData = this.originalData.filter(record => !toDelete.has(record.id));
            this.originalData = newData.slice();
            newData = this.runThroughFilters(newData);
            this.setState({
                data: newData
            });
            console.log(`record deleted: IDs: ${JSON.stringify(deleted)}`);
        }
        if (added) {
            for (var record of added) {
                var isValid = this.validate(record);
                if (isValid) {
                    dataSource.addRecord(record).then(id => {
                        record.id = id;
                        let newData = this.originalData.concat(record);
                        this.originalData = newData.slice();
                        newData = this.runThroughFilters(newData);

                        this.setState({
                            data: newData
                        });
                        console.log(`record added; ID: ${id}`);
                    });
                } else {
                    console.log('invalid');
                }
            }
        }
        if (changed) {
            for (var _recordId of Object.keys(changed)) {
                let recordId = parseInt(_recordId);
                var record = changed[recordId];
                var isValid = this.validateChanged(record);
                if (isValid) {
                    dataSource.updateRecord(recordId, record).then((updatedRecord) => {
                        var newData = this.originalData.slice();
                        for (var index = 0; index < this.originalData.length; index++) {
                            var record = this.originalData[index];
                            if (recordId === record.id) {
                                newData[index] = updatedRecord;
                                break;
                            }
                        }
                        this.originalData = newData.slice();
                        newData = this.runThroughFilters(newData);
                        this.setState({
                            data: newData
                        });
                        console.log(`record changed; ID: ${recordId}`);
                    });
                } else {
                    console.log('invalid');
                }
            }
        }
    }
    validate(record) {
        const columns = ['name', 'director', 'genres', 'imdb_score', 'popularity'];

        if (columns.some(columnName => record[columnName] === undefined)) {
            return false;
        }

        if (!Array.isArray(record.genres) || record.genres.length === 0) {
            return false;
        }

        if (isNaN(parseFloat(record.popularity))) {
            return false;
        }
        if (isNaN(parseFloat(record.imdb_score))) {
            return false;
        }
        return true;
    }
    validateChanged(record) {
        if (record.name !== undefined) {
            if (record.name === '') {
                return false;
            }
        }
        if (record.director !== undefined) {
            if (record.director === '') {
                return false;
            }
        }
        if (record.genres !== undefined) {
            if (!Array.isArray(record.genres) || record.genres.length === 0) {
                return false;
            }
        }
        if (record.popularity !== undefined) {
            if (record.popularity === '') {
                return false;
            }
            if (isNaN(parseFloat(record.popularity))) {
                return false;
            }
        }
        if (record.imdb_score !== undefined) {
            if (record.imdb_score === '') {
                return false;
            }
            if (isNaN(parseFloat(record.imdb_score))) {
                return false;
            }
        }
        return true;
    }
    runThroughFilters(data) {
        var d = [...data];
        var { chipsFilters, searchFilter } = this.state;
        var appliedChipFilters = new Set();

        chipsFilters.forEach(filter => {
            if (filter.applied) {
                appliedChipFilters.add(filter.value);
            }
        });

        data = data.filter(record => record.genre.some(genre => appliedChipFilters.has(genre)));
        data = data.filter(record => record.name.includes(searchFilter) || record.director.includes(searchFilter));
        return data;
    }
}

export default MainScreen;