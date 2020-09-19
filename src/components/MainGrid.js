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
import { LinearProgress } from '@material-ui/core';
import {
    SummaryState,
    IntegratedSummary,
} from '@devexpress/dx-react-grid';
import {
    TableSummaryRow,
} from '@devexpress/dx-react-grid-material-ui';
import { VirtualTable } from '@devexpress/dx-react-grid-material-ui';

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

        if (isAdmin) {
            columns.push({
                name: 'popularity2', title: 'Popularity2'
            });

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


        return (
            <div className="datagrid">
                <Paper>
                    <Grid
                        rows={rows}
                        columns={columns}
                    >
                        {editingState}
                        <SortingState defaultSorting={[{ columnName: 'id', direction: 'asc' }]} />
                        <IntegratedSorting />
                        <Table />
                        <VirtualTable />
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