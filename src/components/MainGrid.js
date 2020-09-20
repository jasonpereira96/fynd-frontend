import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Grid, Table, TableHeaderRow, TableEditRow,
    TableEditColumn
} from '@devexpress/dx-react-grid-material-ui';
import { EditingState } from '@devexpress/dx-react-grid';
import { IntegratedSorting, SortingState } from '@devexpress/dx-react-grid';
import { VirtualTable } from '@devexpress/dx-react-grid-material-ui';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {
    DataTypeProvider
} from '@devexpress/dx-react-grid';

const GenreFormatter = ({ value }) => {
    var genres;
    if (!value) {
        genres = [];
    } else if (!Array.isArray(value)) {
        genres = value.split(', ');
    } else if (Array.isArray(value)) {
        genres = value;
    }
    var chips = genres.map(function (genre, index) {
        return (<Chip label={genre} key={index} />);
    });
    return chips;
};

function GenreEditor({ value, onValueChange }) {
    if (!value) {
        value = [];
    } else if (!Array.isArray(value)) {
        value = value.split(', ');
    }
    var currentGenres = new Set(value);
    var grid = this;
    var genres = grid.props.genres;
    return <Select
        input={<Input />}
        value={value}
        onChange={event => onValueChange(event.target.value)}
        multiple
        style={{ width: '100%' }}
        renderValue={(selected) => selected.join(', ')}
    >
        {genres.map((genre) => (
            <MenuItem key={genre.id} value={genre.name}>
                <Checkbox checked={currentGenres.has(genre.name)} />
                {/* <Checkbox checked={personName.indexOf(name) > -1} /> */}
                <ListItemText primary={genre.name} />
            </MenuItem>
        ))}
    </Select>;
};
function GenreTypeProvider(props) {
    var { grid } = props;
    return (<DataTypeProvider
        formatterComponent={GenreFormatter.bind(grid)}
        editorComponent={GenreEditor.bind(grid)}
        {...props}
    />);
};

const chipColumns = ['genres'];


class MainGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lastQuery: '',
            loading: false,
            rows: [],
            filters: []
        };

        this.setLoading = this.setLoading.bind(this);
        this.setLastQuery = this.setLastQuery.bind(this);
        this.setFilters = this.setFilters.bind(this);
        this.setRows = this.setRows.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.setLastQuery = this.setLastQuery.bind(this);
        this.getCommitChanges = this.getCommitChanges.bind(this);
        this.onDataEdit = this.onDataEdit.bind(this);
    }

    render() {
        let { isAdmin, verified } = this.props;
        let columns, editingComponents = <></>, editingState = <></>;
        let tableEditRow = <></>, tableEditColumn = <></>;
        const getRowId = row => row.id;

        columns = [{
            name: 'id', title: 'ID'
        }, {
            name: 'name', title: 'Name'
        }, {
            name: 'director', title: 'Director'
        }, {
            name: 'genres', title: 'Genres'
        }, {
            name: 'imdb_score', title: 'IMDB Score'
        }, {
            name: 'popularity', title: 'Popularity'
        }];

        let editingColumnExtensions = [{
            columnName: 'name', editingEnabled: false
        }, {
            columnName: 'id', editingEnabled: false
        }];

        if (isAdmin) {

            tableEditRow = <TableEditRow />;
            tableEditColumn = <TableEditColumn
                showAddCommand={false}
                showEditCommand
                showDeleteCommand
            />;
            editingState = <EditingState
                onCommitChanges={this.onDataEdit}
                getRowId={getRowId}
                columnExtensions={editingColumnExtensions}
            />;
        }

        if (!isAdmin) {
            var rows = this.props.data;
        } else {
            if (verified) {
                var rows = this.props.data;
            } else {
                var rows = [];
            }
        }

        var columnExtensions = [{
            columnName: 'genres',
            wordWrapEnabled: true
        }];


        return (
            <div className="datagrid">
                <Paper>
                    <Grid
                        rows={rows}
                        columns={columns}
                    >
                        <GenreTypeProvider
                            for={chipColumns}
                            grid={this}
                        />
                        {editingState}
                        <SortingState defaultSorting={[{ columnName: 'id', direction: 'asc' }]} />
                        <IntegratedSorting />
                        <Table />
                        <VirtualTable columnExtensions={columnExtensions} />
                        <TableHeaderRow showSortingControls />
                        {tableEditRow}
                        {tableEditColumn}
                    </Grid>
                </Paper>
            </div>
        );
    }



    setLastQuery(query) {
        this.setState({
            lastQuery: query
        });
    }
    setLoading(loading) {
        this.setState({
            loading
        });
    }
    setRows(rows) {
        this.setState({
            rows
        });
    }
    setFilters(filters) {
        this.setState({
            filters: filters
        });
    }

    onDataEdit(actions) {
        if (actions.deleted) {
            for (var index = 0; index < actions.deleted.length; index++) {
                var rowNumber = actions.deleted[index];
                actions.deleted[index] = this.props.data[rowNumber].id;
            }
        }
        if (actions.changed) {
            let map = {};
            for (var _rowNumber of Object.keys(actions.changed)) {
                let rowNumber = parseInt(_rowNumber);
                let recordId = this.props.data[rowNumber].id;
                if (actions.changed[_rowNumber] !== undefined) {
                    map[recordId] = actions.changed[_rowNumber];
                }
            }
            actions.changed = map;
        }
        this.props.onDataEdit(actions);
    }

    getCommitChanges() {
        let { setRows } = this;
        let { rows } = this.state;
        const commitChanges = ({ added, changed, deleted }) => {


            let changedRows;
            if (added) {
                const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
                changedRows = [
                    ...rows,
                    ...added.map((row, index) => ({
                        id: startingAddedId + index,
                        ...row,
                    })),
                ];
            }
            if (changed) {
                changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
            }
            if (deleted) {
                const deletedSet = new Set(deleted);
                changedRows = rows.filter(row => !deletedSet.has(row.id));
            }
            setRows(changedRows);
        };
        return commitChanges;
    }
}

export default MainGrid;