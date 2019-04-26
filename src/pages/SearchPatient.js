import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios'
import toastr from 'toastr'
import Button from '@material-ui/core/Button';
import DoctorAppBar from '../DoctorAppbar'
import Cookies from 'universal-cookie';

const cookies = new Cookies();


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,



  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: '40',

  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});



class SearchExistingPatient extends Component {
  constructor() {
    super();
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.AddNotes = this.AddNotes.bind(this);
    this.state = {

      MR_No: '',
      Name: '',
      Fathername: '',
      Age: '',
      multiline: '',
      note:'',
      patientid:''
    }


  }



  handleChange({ target }) {
    this.setState({
      [target.name]: target.value

    })
    console.log('Register', this.state.MR_No)
  }




  handleSearch() {

    var Search = {
      patientmrnumber: this.state.MR_No
    };


    var formBody = [];
    for (var property in Search) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(Search[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    console.log("Form Body", formBody);
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
        console.log("Response from server", result);
        this.setState({ Name: result[0].patientname, Fathername: result[0].fathername, Age: result[0].age , patientid:result[0].patientid });
        console.log("State after setting", this.state)
      })
      .catch((error) => {
        toastr.options = {
          positionClass: 'toast-top-right',
          hideDuration: 300000,
          timeOut: 100
        }
        toastr.clear()
        setTimeout(() => toastr.success(`Patient Not found`), 300)
      })

  }
  



  AddNotes() {
    console.log('add notes');
        var Search = {
            patientid: this.state.patientid,
            note: this.state.note,
            date: new Date()
    };


       var formBody = [];
    for (var property in Search) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(Search[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    console.log("Form Body", formBody);
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
          positionClass: 'toast-top-right',
          hideDuration: 3000,
          timeOut: 100
        }
        toastr.clear()
        setTimeout(() => toastr.success(`Note Added`), 300)
        }
      })
      .catch((error) => {
        toastr.options = {
          positionClass: 'toast-top-right',
          hideDuration: 300000,
          timeOut: 100
        }
        toastr.clear()
        setTimeout(() => toastr.error(`Error occured`), 300)
      })





  }






  render() {
    const { classes } = this.props;
    return (
      <div>
        <div>
        <DoctorAppBar/>
          <h2 style={{ color: '#2699FB', position: 'absolute' }}>Search patient</h2>
          <TextField
            label="Search Patient"
            name="MR_No"
            value={this.state.MR_No}
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
            className={classes.textField}
          />
          <Button variant="outlined" style={{ backgroundColor: '#2699FB', marginTop: '2%' }} onClick={this.handleSearch}>Search</Button>
          <div style={{paddingRight:1000,paddingTop:100}}>
         <h4>{this.state.Name}</h4>
         <h4>{this.state.Fathername}</h4>
             <h4>{this.state.Age}</h4>
          </div>
        </div>
        <div style={{ paddingLeft: 500, paddingTop: 100,position:'fixed' }}>
        <h3 style={{ color: '#2699FB'}}>Notes/Diagnostics Results/Prescription</h3>
          <TextField style={{ width: '200%' }}
            id="outlined-multiline-static"

            multiline
            rows="10"
            name="note"
            value={this.state.note}
            onChange={this.handleChange}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <br></br>
          <Button variant="outlined" style={{ backgroundColor: '#2699FB', marginTop: '2%', }} onClick={this.AddNotes}>Add Notes</Button>
        </div>
      </div>

    )
  }
}
SearchExistingPatient.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SearchExistingPatient)