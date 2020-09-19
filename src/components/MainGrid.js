import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Grid, Table, TableHeaderRow, TableEditRow,
    TableEditColumn
} from '@devexpress/dx-react-grid-material-ui';
import { EditingState } from '@devexpress/dx-react-grid';
import {
    FilteringState,
} from '@devexpress/dx-react-grid';
import {
    TableFilterRow,
} from '@devexpress/dx-react-grid-material-ui';
import { IntegratedSorting, SortingState } from '@devexpress/dx-react-grid';
import { LinearProgress, Popover } from '@material-ui/core';
import {
    SummaryState,
    IntegratedSummary,
} from '@devexpress/dx-react-grid';
import {
    TableSummaryRow,
} from '@devexpress/dx-react-grid-material-ui';
import { VirtualTable } from '@devexpress/dx-react-grid-material-ui';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import {
    DataTypeProvider
} from '@devexpress/dx-react-grid';

const GenreFormatter = ({ value }) => {
    var genres = value.split(', ');
    var chips = genres.map(function (genre, index) {
        return (<Chip label={genre} key={index} />);
    });
    return chips;
};

const GenreEditor = ({ value, onValueChange }) => {
    value = value.split(', ');
    return <Select
        input={<Input />}
        value={value}
        // onChange={event => onValueChange(event.target.value === 'Yes')}
        multiple
        style={{ width: '100%' }}
        renderValue={(selected) => selected.join(', ')}
    >
        {value.map((name) => (
            <MenuItem key={name} value={name}>
                <Checkbox checked={true} />
                {/* <Checkbox checked={personName.indexOf(name) > -1} /> */}
                <ListItemText primary={name} />
            </MenuItem>
        ))}
    </Select>;
};
const GenreTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={GenreFormatter}
        editorComponent={GenreEditor}
        {...props}
    />
);

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
    }

    render() {
        let { isAdmin, verified } = this.props;
        let columns, editingComponents = <></>, editingState = <></>;
        let tableEditRow = <></>, tableEditColumn = <></>;
        const getRowId = row => row.id;

        columns = [/*{
            name: 'id', title: 'ID'
        }, */{
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

        if (isAdmin) {

            tableEditRow = <TableEditRow />;
            tableEditColumn = <TableEditColumn
                showAddCommand={verified}
                showEditCommand
                showDeleteCommand
            />;
            editingState = <EditingState
                onCommitChanges={this.getCommitChanges()}
                getRowId={getRowId}
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
                        />
                        {editingState}
                        <SortingState defaultSorting={[{ columnName: 'id', direction: 'asc' }]} />
                        <IntegratedSorting />
                        <Table/>
                        <VirtualTable columnExtensions={columnExtensions}/>
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
    getURL() {
        let { serverHostname } = this.props;
        return `http://${serverHostname}/data`;
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

    // componentDidUpdate(prevProps) {
    //     this.setRows(this.props.data);
    // }
}

export default MainGrid;