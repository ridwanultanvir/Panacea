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
  const { mainRow, auxHeaders, auxRows } = props;
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
        <TableCell component="th" scope="row" align="right">
          {mainRow.cat1}
        </TableCell>
        <TableCell align="right">{mainRow.cat2}</TableCell>
        <TableCell align="right">{mainRow.cat3}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h5" gutterBottom component="div">
                <u>Details:</u>
              </Typography>
              
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    {
                        auxHeaders.map((item) => {
                            let i;
                            let headerItems = [];
                            for(i = 0; i < item.length; i++) {
                                headerItems.push(<TableCell align='right'>{item[i]}</TableCell>);
                            }
                            return headerItems;
                        })
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                      auxRows.map((item) => {
                          let i;
                          let rowItems = [];
                          for (i = 0; i < item.length; i++) {
                              rowItems.push(<TableCell align='right'>{item[i]}</TableCell>);
                          }
                          return (<TableRow>{rowItems}</TableRow>)
                      })
                  }
                </TableBody>
              </Table>
              
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


export default function BillDisplayTable(props) {
  
    let rows = [];
    let appntRow = {
        'cat1': "Doctor Visit Charge",
        'cat2': props.resultCheckUpBill.length,
        'cat3': props.total_checkup_bill
    }
    let surgRow = {
        'cat1': "Surgery Cost",
        'cat2': props.resultSurgBill.length,
        'cat3': props.total_surg_bill,
    }
    let roomRow = {
        'cat1': "Room Charge",
        'cat2': props.resultRoomBill.length,
        'cat3': props.total_room_bill,
    }
    let medRow = {
        'cat1': "Medicine Charge",
        'cat2': props.resultMedBill.length,
        'cat3': props.total_med_bill,
    }
    // appointment_data.map((block) => {
    //     rows.push(createData(block.doc_name, block.department, block.appnt_date, block.schedule_date, block.prob_desc, block.medicine, block.test))
    // });
    return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="right">Type of Service</TableCell>
            <TableCell align="right">#(Nos)</TableCell>
            <TableCell align="right">Gross Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <Row mainRow = {appntRow} 
            auxHeaders = {props.checkUpTableHeaders}
            auxRows = {props.resultCheckUpBill}/>

            <Row mainRow = {roomRow} 
            auxHeaders = {props.roomTableHeaders}
            auxRows = {props.resultRoomBill}/>

            <Row mainRow = {surgRow} 
            auxHeaders = {props.surgTableHeaders}
            auxRows = {props.resultSurgBill}/>

            <Row mainRow = {medRow} 
            auxHeaders = {props.medTableHeaders}
            auxRows = {props.resultMedBill}/>

        </TableBody>
      </Table>
    </TableContainer>
  );
}