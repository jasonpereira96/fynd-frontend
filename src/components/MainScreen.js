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
            this.setState({
                data: this.state.data.filter(record => !toDelete.has(record.id))
            });
            this.originalData = this.originalData.filter(record => !toDelete.has(record.id));
            console.log(`record deleted: IDS: ${JSON.stringify(deleted)}`);
        }
        if (added) {
            for (var record of added) {
                var isValid = this.validate(record);
                if (isValid) {
                    dataSource.addRecord(record).then(id => {
                        record.id = id;
                        this.setState({
                            data: this.state.data.concat(record)
                        });
                        this.originalData = this.originalData.concat(record);
                        console.log(`record added; ID: ${id}`);
                    });
                } else {
                    console.log('invalid');
                }
            }
        }
        if (changed) {
            for (var recordId of Object.keys(changed)) {
                var record = changed[recordId];
                var isValid = this.validateChanged(record);
                dataSource.updateRecord(recordId, record).then((updateRecord) => {
                    var newData = this.state.data.slice();
                    for (var index = 0; index < this.state.data.length; index++) {
                        var record = this.state.data[index];
                        if (recordId === record.id) {
                            newData[index] = updateRecord;
                            break;
                        }
                    }
                    this.setState({
                        data: newData
                    });
                    this.originalData = newData.slice();
                    console.log(`record changed; ID: ${recordId}`);
                });
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
    }
}

export default MainScreen;