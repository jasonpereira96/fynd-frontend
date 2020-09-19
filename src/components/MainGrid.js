import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
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
        const DEBOUNCE_DELAY = 400;

        this.setLoading = this.setLoading.bind(this);
        this.setLastQuery = this.setLastQuery.bind(this);
        this.setFilters = this.setFilters.bind(this);
        this.setRows = this.setRows.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.setLastQuery = this.setLastQuery.bind(this);
        // this.loadData = debounce(this.loadData, DEBOUNCE_DELAY);
    }

    render() {
        let columns = [/*{
            name: 'id', title: 'Id'
        },*/ {
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


        return (
            <div className="datagrid">
                <Paper>
                    <Grid
                        rows={this.props.data}
                        columns={columns}>
                        <SortingState defaultSorting={[{ columnName: 'id', direction: 'asc' }]} />
                        <IntegratedSorting />
                        <Table />
                        <VirtualTable />
                        <TableHeaderRow showSortingControls />
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

    // componentDidUpdate(prevProps) {
    //     this.setRows(this.props.data);
    // }
}

export default MainGrid;