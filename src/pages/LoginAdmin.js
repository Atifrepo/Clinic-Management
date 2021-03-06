import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

export default class LoginAdmin extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {

      labelWidth: 0,
      username: '',
      password: '',
      role: '',
      name: 'hai',


    }

  }
 
  handleChange({ target }) {

    this.setState({
      [target.name]: target.value
    })
   
  }



  handleSubmit = (event) => {
    event.preventDefault();
    var details = {
      username: this.state.username,
      password: this.state.password,
      role: "Admin"
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
   
    formBody = formBody.join("&");

    fetch('http://ec2-54-198-188-131.compute-1.amazonaws.com:3000/loginuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(function (resp) {
      if (resp.ok) {
        return resp.json()
      }
    }).then(function (data) {
      cookies.set('token', data.token, { path: '/' });
      console.log(cookies.get('token'));
      cookies.set('username', data.username, { path: '/' });
      console.log(cookies.get('username'));
      cookies.set('roles', data.roles, { path: '/' });
      console.log(cookies.get('roles'));
  
      if (data.roles == 'Admin') {
        window.location.href = '/AddEmployee';
        console.log('login role', data.roles)
      }



    })


      .catch(function (error) {
      
      })






  }
  render() {


    return (
      <div>

        <form onSubmit={this.handleSubmit}>

          <br></br>
          <br></br>
          <br></br>
          <br></br>

          <TextField
            name="username"
            required={true}
            label="Employee ID"
            value={this.state.username}
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
          />
          <br></br>

          <TextField
            name="password"
            required={true}
            id="outlined-password-input"
            label="Password"

            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            autoComplete="current-password"
            margin="normal"
            variant="outlined"
          />
          <br></br>
          <br></br>

         
         <Button variant="contained" style={{ backgroundColor: '#2699FB', width: 220 }} type="submit"><b style={{color:'#fff'}}>login</b></Button>
        </form>
      </div>
    )
  }
}