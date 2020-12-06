import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);



const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function DataDisplayTable(props) {
    const classes = useStyles();
    // console.log(props.tableHeader);
    // console.log(props.tableData);
    return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
              {
                  props.tableHeader.map((row) => {
                    let i;
                    let headerColumns = [];
                    for(i=0; i < row.length;i++ ){
                        headerColumns.push(<StyledTableCell align="right">{row[i]}</StyledTableCell>);
                    }
                    return headerColumns;
                  })
              }
          </TableRow>
        </TableHead>
        <TableBody>
            {props.tableData.map((row) => {
                let i;
                let rowColumns = [];
                for(i = 0; i < row.length; i++) {
                    rowColumns.push(<StyledTableCell align="right">{row[i]}</StyledTableCell>)
                }
                return (<StyledTableRow>{rowColumns}</StyledTableRow>);
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}