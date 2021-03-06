import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AdminAppbar from '../AdminAppbar';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
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
});
class DeleteEmployee extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
         EmployeeID: '',
        adminpassword: ''  

    }
  }
 handleChange({ target }) {

    this.setState({
      [target.name]: target.value

    })
  
  }


  handleSubmit = (event) =>{
    event.preventDefault();
   
    var name=cookies.get('username')
  
   var deleteemployee = {
      username: this.state.EmployeeID,
      password: this.state.adminpassword,
      adminusername: name
     
      
          };
    var formBody = [];
   
    for (var property in deleteemployee) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(deleteemployee[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

  
    var Authtoken = cookies.get('token')
    var finalAuthtoken = 'Bearer ' + Authtoken

    fetch('http://ec2-54-198-188-131.compute-1.amazonaws.com:3000/deleteuser', {
      method: 'POST',
      withCredentials: true,

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': finalAuthtoken

      },
      body: formBody

    })
    .then((resp) => {
      if (resp.ok) {
        toastr.options = {
          positionClass: 'toast-bottom-left',
          hideDuration: 300000,
          timeOut: 100
        }
        toastr.clear()
        setTimeout(() => toastr.success(`User Deleted`), 300)
      }

      else {
 toastr.options = {
          positionClass: 'toast-bottom-left',
          hideDuration: 300000,
          timeOut: 100
        }
        toastr.clear()
        setTimeout(() => toastr.error(`unable to delete`), 300)
      }

    }).catch(error=> {
        toastr.options = {
          positionClass: 'toast-bottom-left',
          hideDuration: 300000,
          timeOut: 100
        }
        toastr.clear()
        setTimeout(() => toastr.error(`Error in calling api`), 300)
      })




  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <h2 style={{ color: '#2699FB' }}>Delete User</h2>
        <AdminAppbar />
        <form onSubmit={this.handleSubmit}>
        <TextField

          label="Employee Name"
          name="EmployeeID"
          required={true}
          value={this.state.EmployeeID}
          onChange={this.handleChange}
          margin="normal"
          variant="outlined"
          className={classes.textField}
        />
        <br></br>
        <TextField
          label="Enter admin Password"
          name="adminpassword"
          required={true}
          value={this.state.adminpassword}
          onChange={this.handleChange}
          margin="normal"
          variant="outlined"
          className={classes.textField}
        />
        <br></br>
        <Button variant="contained" style={{ backgroundColor: 'red', width: 220 }} type="submit"><b style={{color:'#fff'}}>Delete</b></Button>
      </form>
      </div>
    )
  }
}
DeleteEmployee.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeleteEmployee)