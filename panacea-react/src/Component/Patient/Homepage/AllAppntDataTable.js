import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function createData(doc_name, department, appnt_date, schedule_date, prob_desc, medicine, test) {
    let tests = test.split("-");
    let testList = [];
    tests.map((data) => {testList.push(data)} );
    return {
        doc_name,
        department,
        appnt_date,
        schedule_date,
        prob_desc,
        medicine,
        all_test: testList,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.doc_name}
        </TableCell>
        <TableCell align="right">{row.appnt_date}</TableCell>
        <TableCell align="right">{row.schedule_date}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h5" gutterBottom component="div">
                <u>Details:</u>
              </Typography>
              <Typography variant="h7" gutterBottom component="div">
                Department : {row.department}
              </Typography>
              <Typography variant="h7" gutterBottom component="div">
                Problem Description : {row.prob_desc}
              </Typography>
              <Typography variant="h7" gutterBottom component="div">
                Medicine : {row.medicine}
              </Typography>
              <Typography variant="h5" gutterBottom component="div">
                <u>Tests :</u> 
              </Typography>
              {row.all_test !== [] ? (
                  row.all_test.map((test) => {
                    return <Typography variant="h7" gutterBottom component="div">
                        {test}
                    </Typography>
                  }
              )): null}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};


export default function AppointmentDetailsTable(props) {
  
    let appointment_data = props.appointment_data;
    let rows = [];
    appointment_data.map((block) => {
        rows.push(createData(block.doc_name, block.department, block.appnt_date, block.schedule_date, block.prob_desc, block.medicine, block.test))
    });
    return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Doctor's Name</TableCell>
            <TableCell align="right">Appointment Date</TableCell>
            <TableCell align="right">Visiting Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}