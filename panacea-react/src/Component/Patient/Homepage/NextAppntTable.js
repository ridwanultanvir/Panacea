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

function createData(doc_name, department, appnt_date, schedule_date, prob_desc, sl_no) {
  return { doc_name, department, appnt_date, schedule_date, prob_desc, sl_no };
}


const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function NextAppntTable(props) {
    const classes = useStyles();
    let nextAppntData = props.nextAppntData;
    let rows = [];
    nextAppntData.map((block) => {
        rows.push(createData(block.doc_name, block.department, block.appnt_date, block.schedule_date, 
                            block.prob_desc, block.sl_no)); 
    });
    return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="right">Serial Number</StyledTableCell>
            <StyledTableCell align="right">Doctor's name</StyledTableCell>
            <StyledTableCell align="right">Department</StyledTableCell>
            <StyledTableCell align="right">Appointment Created On</StyledTableCell>
            <StyledTableCell align="right">Visiting Date</StyledTableCell>
            <StyledTableCell align="right">Problem Description</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.sl_no}>
              <StyledTableCell align="right">{row.sl_no}</StyledTableCell>
              <StyledTableCell align="right">{row.doc_name}</StyledTableCell>
              <StyledTableCell align="right">{row.department}</StyledTableCell>
              <StyledTableCell align="right">{row.appnt_date}</StyledTableCell>
              <StyledTableCell align="right">{row.schedule_date}</StyledTableCell>
              <StyledTableCell align="right">{row.prob_desc}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}