import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { fromJS } from 'immutable';

class App extends Component {
  static get namespace(){
    return 'techscope-jlm-s3-demo-login';
  }

  static get actions(){
    return {
      signup: (email, password) => ({
        network: {
          handler: 'Signup',
          payload: { email, password },
          nextAction: { type: 'setUser' },
        },
      }),
      
      login: (email, password) => ({
        network: {
          handler: 'Login',
          payload: { email, password },
          nextAction: { type: 'setUser' },
        },
      }),

      
      verify: (email, verifyCode) => ({
        network: {
          handler: 'Verify',
          payload: { email, verifyCode },
          nextAction: { type: 'setUser' },
        },
      }),

      setEmail: (email) => ({
        type: 'setEmail',
        payload: email,
      }),

      setPassword: (password) => ({
        type: 'setPassword',
        payload: password,
      }),

      setVerifyCode: (verifyCode) => ({
        type: 'setVerifyCode',
        payload: verifyCode
      }),
    };
  }

  static get reducer(){
    return {
      setUser: (state, { payload }) =>
        state.set('user', payload),

      setEmail: (state, { payload }) =>
        state.set('email', payload),

      setPassword: (state, { payload }) =>
        state.set('password', payload),
      
      setVerifyCode: (state, { payload }) =>
        state.set('verifyCode', payload),
    }
  }

  static get initState(){
    return fromJS({
      email: '',
      password: '',
      verifyCode: '',
    });
  }

  setEmail = ({ target: { value: email }})=>{
    this.props.setEmail(email);
  }
  
  setPassword = ({ target: { value: password }})=>{
    this.props.setPassword(password);
  }
  
  setVerifyCode = ({ target: { value: verifyCode }})=>{
    this.props.setVerifyCode(verifyCode);
  }

  
  render() {

    const email = this.props.subState.get('email');
    const password = this.props.subState.get('password');
    const verifyCode = this.props.subState.get('verifyCode');
    
    return (
      <div className="App">

        email
        <input type="email" value={email} onChange={this.setEmail} />
        
        password
        <input type="password" value={password} onChange={this.setPassword} />

        verify
        <input type="text" value={verifyCode} onChange={this.setVerifyCode} />

        <button onClick={()=> this.props.signup(email, password)}> sign up </button>
        <button onClick={()=> this.props.verify(email, verifyCode)}> verify </button>
        <button onClick={()=> this.props.login(email, password)}> log in </button>

        {JSON.stringify(this.props.subState.get('user'))}
      </div>
    );
  }
}

export default App;
