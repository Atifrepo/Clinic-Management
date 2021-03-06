import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import toastr from 'toastr'
import Button from '@material-ui/core/Button';
import DoctorAppBar from '../DoctorAppbar'
import Cookies from 'universal-cookie';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const cookies = new Cookies();
const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {

    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  // textField: {
  //   marginLeft: theme.spacing.unit,
  //   marginRight: theme.spacing.unit,
  // },
  card: {
    minWidth: 275,
    width: 21,

  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  TableCell:{
    fontSize:15,
    fontWeight:'bold'
  }


});






class SearchPatient extends Component {
  constructor() {
    super();
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.AddNotes = this.AddNotes.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.ViewDiagnosis=this.ViewDiagnosis.bind(this);



    this.state = {

      MRNo_Rec: '',
      MR_No: '',
      Name: '',
      LName: '',
      Fathername: '',
      Age: '',
      multiline: '',
      note: '',
      patientid: '',
      rows: [],
      receivenote: [],
      DoctorName: '',
      Diagnosisinput: '',
      Diagnosis:[],
      diaDate:'',
      DiagnosisReceived: '',
      showdaignosis:false,
    }


  }









  handleChange({ target }) {
    this.setState({
      [target.name]: target.value

    })

  }




  handleSearch = (event) => {
    event.preventDefault();

    var Search = {
      patientmrnumber: this.state.MR_No
    };
    this.setState({
      rows: []
      // Age:row-

    })


    var formBody = [];
    for (var property in Search) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(Search[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");


    var Authtoken = cookies.get('token')
    var finalAuthtoken = 'Bearer ' + Authtoken

    fetch('http://ec2-54-198-188-131.compute-1.amazonaws.com:3000/getpatientdetails', {
      method: 'POST',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': finalAuthtoken

      },
      body: formBody

    })
      .then((resp) => {

        if (resp.status !== 200) {
          throw new Error("Not 200 response")
        }

        if (resp.ok) {
          var data = resp.json();
          return data;
        }
      })
      .then((result) => {
        this.setState({
          MR_No: result[0].mr_no,
          MRNo_Rec: result[0].mr_no,
          Name: result[0].patientname,
          Fathername: result[0].fathername,
          Age: result[0].age,
          patientid: result[0].patientid
        });


        this.setState({
          rows: result,
          showdaignosis:true
        })

        


      })
      .catch((error) => {
        toastr.options = {
          positionClass: 'toast-bottom-left',
          hideDuration: 300000,
          timeOut: 100
        }
        toastr.clear()
        setTimeout(() => toastr.error(`Patient Not found`), 300)
      })

  }




  AddNotes = (event) => {
    event.preventDefault();

    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    var dateString = date + "-" + (month + 1) + "-" + year;
    console.log("Diagnosis input ", this.state.Diagnosisinput);
    console.log("Notes Added", this.state.note);
    var Search = {
      patientid: this.state.patientid,
      note: this.state.note,
      date: dateString,
      diagnosis: this.state.Diagnosisinput,
    };


    var formBody = [];
    for (var property in Search) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(Search[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    var Authtoken = cookies.get('token')
    var finalAuthtoken = 'Bearer ' + Authtoken

    fetch('http://ec2-54-198-188-131.compute-1.amazonaws.com:3000/addnote', {
      method: 'POST',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': finalAuthtoken

      },
      body: formBody

    })
      .then((resp) => {

        if (resp.status !== 200) {
          throw new Error("Not 200 response")
        }

        if (resp.ok) {
          toastr.options = {
            positionClass: 'toast-bottom-left',
            hideDuration: 300000,
            timeOut: 100
          }
          toastr.clear()
          setTimeout(() => toastr.success(`Note Added`), 300)
        }
      })
      .catch((error) => {
        toastr.options = {
          positionClass: 'toast-bottom-left',
          hideDuration: 300000,
          timeOut: 100
        }
        toastr.clear()
        setTimeout(() => toastr.error(`Error occured`), 300)
      })




  }

  handleClickOpen(ab) {

    var Search = {
      dates: ab.datetimes,
      patientid: this.state.patientid
    };


    var formBody = [];
    for (var property in Search) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(Search[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");


    var Authtoken = cookies.get('token')
    var finalAuthtoken = 'Bearer ' + Authtoken

    fetch('http://ec2-54-198-188-131.compute-1.amazonaws.com:3000/getnotes', {
      method: 'POST',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': finalAuthtoken

      },
      body: formBody

    })
      .then((resp) => {

        if (resp.status !== 200) {
          throw new Error("Not 200 response")
        }

        if (resp.ok) {
          var data = resp.json();
          return data;

        }
      })
      .then((result) => {

        this.setState({

          receivenote: result,
          DoctorName: result[0].doctorname,
        })
        console.log('res', result)
      })
      .catch((error) => {
        toastr.options = {
          positionClass: 'toast-bottom-left',
          hideDuration: 300000,
          timeOut: 100
        }
        toastr.clear()
        setTimeout(() => toastr.error(`No Notes`), 300)
      })




    this.setState({
      open: true,
    });

  };






  handleClose = () => {
    this.setState({ open: false });
  };
  handleCloses = () => {
    this.setState({ opens: false });
  };


  ViewDiagnosis= () => {
    var Search = {
      
      patientid: this.state.patientid
    };
console.log('id',this.state.patientid)

    var formBody = [];
    for (var property in Search) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(Search[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");


    var Authtoken = cookies.get('token')
    var finalAuthtoken = 'Bearer ' + Authtoken

    fetch('http://ec2-54-198-188-131.compute-1.amazonaws.com:3000/viewdiagnosis', {
      method: 'POST',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': finalAuthtoken

      },
      body: formBody

    }) 
    .then((resp) => {

      if (resp.status !== 200) {
        throw new Error("Not 200 response")
      }

      if (resp.ok) {
        var data = resp.json();
        return data;
      }
    })
    .then((result) => {

      console.log('res', result)
      this.setState(
      {
        Diagnosis:result
      }
      )
    })  
    .catch((error) => {
      toastr.options = {
        positionClass: 'toast-bottom-left',
        hideDuration: 300000,
        timeOut: 100
      }
      toastr.clear()
      setTimeout(() => toastr.error(`No Notes`), 300)
    })
    this.setState({
      opens: true,
    });
  }

  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    return (



      <div style={{ overflowX: "hidden" }}>
        <DoctorAppBar />
        <h2 style={{ color: '#2699FB', position: 'absolute' }}>Search patient</h2>

        <form onSubmit={this.handleSearch}>
          <br></br>
          <br></br>
          <TextField
            style={{ width: '20%' }}
            label="Search Patient"
            name="MR_No"
            required={true}
            value={this.state.MR_No}
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"

          />
          <br></br>
          <Button variant="outlined" style={{ backgroundColor: '#2699FB', }} type="submit"><b style={{ color: '#fff' }}>Search</b></Button>
        </form>
        {/* </div> */}
        <br></br>
        <div style={{ height: '45', width: '23',paddingLeft:'40%' }}>
        <Card
          className={classes.card}>

          <CardContent>
            {/* {this.state.rows.map(row => ( */}

            <Typography >
              <b>MR NO.:  </b>{this.state.MRNo_Rec}
              <br></br>
              <b>Name:  </b>{this.state.Name}
              <br></br>
              <b>Age: </b>{this.state.Age}
              
              {/* MR No:  {row.mr_no}
                <br></br>
                Age:  {row.age} */}
            </Typography>
            {/* ))} */}
          </CardContent>

        </Card>
        </div>
        <Table className='Patient Information'>
          <TableHead>
            <TableRow>
              {/* <TableCell >MR Number</TableCell>
              <TableCell> Name</TableCell>
              <TableCell >Age</TableCell> */}
              <TableCell >Date</TableCell>
              <TableCell >Blood Pressure</TableCell>
              <TableCell >Height</TableCell>
              <TableCell >RBS</TableCell>
              <TableCell >Pulse</TableCell>
              <TableCell >Weight</TableCell>

              <TableCell >Allergy</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map(row => (
              <TableRow key={row.id}>

                <TableCell className={classes.TableCell} >{row.datetimes}</TableCell>
                <TableCell className={classes.TableCell} >{row.bloodpressure}</TableCell>
                <TableCell className={classes.TableCell}>{row.height}</TableCell>
                <TableCell className={classes.TableCell}>{row.po2}</TableCell>
                <TableCell className={classes.TableCell}>{row.pulse}</TableCell>
                <TableCell className={classes.TableCell}>{row.weight}</TableCell>
                <TableCell className={classes.TableCell}>{row.allergie}</TableCell>

                <TableCell > {row.diagnosis}</TableCell>
               <TableCell>
                  <Button variant="outlined" color="secondary" onClick={() => { this.handleClickOpen(row) }}>
                    <b>
                      View Notes
        </b>
                  </Button>
                </TableCell>
                <TableCell>
                
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <br></br>
        <div>
          { this.state.showdaignosis?
        (<Button variant="outlined" color="secondary" onClick={() => { this.ViewDiagnosis() }}>
                    <b>
                      View Diagnosis History
        </b>
                  </Button>)
           : null }
                   {/* ))} */}
                  </div>
                  <div >

<Dialog
  fullWidth='true'
  maxWidth='lg'
  onClose={this.handleClose}
  aria-labelledby="customized-dialog-title"
  open={this.state.opens}
>
  <DialogTitle id="customized-dialog-title" onClose={this.handleCloses}>
  Diagnosis
</DialogTitle>
  <DialogContent>
    <Typography gutterBottom>
      {this.state.Diagnosis.map(row => (

        <div>

        
          <br></br>
         {row.diagnosis}
         <br></br>
                    Date: <b> {row.notedate}</b>
      
          <Divider />
        </div>


      ))}

    </Typography>
  </DialogContent>
  <DialogActions></DialogActions>
</Dialog>
</div>
        <div >

          <Dialog
            fullWidth='true'
            maxWidth='lg'
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={this.state.open}
          >
            <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
              Added Notes
          </DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                {this.state.receivenote.map(row => (

                  <div>

                    {row.notetext}
                    <br></br>
                    Added By: <b> {row.doctorname}</b>
                    <Divider />
                  </div>


                ))}

              </Typography>
            </DialogContent>
            <DialogActions></DialogActions>
          </Dialog>
        </div>
      
      
        {/* <div style={{ paddingLeft: 500, paddingTop: 100,position:'fixed' }}> */}
        <h3 style={{ color: '#2699FB' }}>Add Notes/Prescription</h3>
        <form onSubmit={this.AddNotes}>
          <TextField style={{ width: '80%' }}
            id="outlined-multiline-static"

            multiline
            rows="8"
            name="note"
            required={true}
            value={this.state.note}
            onChange={this.handleChange}

            margin="normal"
            variant="outlined"
          />
          <br></br>

          <TextField
            label="Add Diagnosis"
            name="Diagnosisinput"
            required={true}
            value={this.state.Diagnosisinput}
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
          />
          <br></br>
          <Button variant="outlined" style={{ backgroundColor: '#2699FB', }} type="submit"><b style={{ color: '#fff' }}>Add Notes</b></Button>
        </form>
        {/* </div> */}
      </div>

    )
  }
}
SearchPatient.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SearchPatient)






