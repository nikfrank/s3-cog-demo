import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import {fromJS} from 'immutable';

class App extends Component {
  static get namespace() {
    return 'techscope-jlm-s3-demo-login';
  }

  static get actions() {
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
          nextAction: { type: 'setIdentityId' },
        },
      }),

      getCurrentUser: () => ({
        network: {
          handler: 'GetCurrentUser',
          nextAction: { type: 'setIdentityId' },
        },
      }),

      listBucket: (IdentityId) => ({
        network: {
          handler: 'ListBucket',
          payload: { IdentityId },
          nextAction: { type: 'setList' },
        },
      }),

      getFile: (file) => ({
        network: {
          handler: 'GetFile',
          payload: { file },
          nextAction: { type: 'setFile' },
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
        payload: verifyCode,
      }),

      uploadFile: (filename, file) => ({
        network: {
          handler: 'UploadFile',
          payload: { filename, file },
        },
      }),
    };
  }

  static get reducer() {
    return {
      setUser: (state, {payload}) => state.set('user', payload),

      setEmail: (state, {payload}) => state.set('email', payload),

      setPassword: (state, {payload}) => state.set('password', payload),

      setVerifyCode: (state, {payload}) => state.set('verifyCode', payload),

      setList: (state, {payload}) => state.set('fileList', fromJS(payload)),

      setIdentityId: (state, {payload}) => state.set('IdentityId', payload),

      setFile: (state, {payload}) => state.set('file', payload),
    }
  }

  static get initState() {
    return fromJS({
      email: '',
      password: '',
      verifyCode: '',
      IdentityId: '',
      file: '',
      fileList: [],
    });
  }

  componentDidMount() {
    this.props.getCurrentUser();
  }

  setEmail = ({ target: { value: email } }) => {
    this.props.setEmail(email);
  }

  setPassword = ({ target: { value: password } }) => {
    this.props.setPassword(password);
  }

  setVerifyCode = ({ target: { value: verifyCode } }) => {
    this.props.setVerifyCode(verifyCode);
  }

  
  readFile = e => {
    const filename = e.target.value.split(/[\\\/]/).slice(-1)[0];
    const IdentityId = this.props.subState.get('IdentityId');
    
    this.props.uploadFile( `${IdentityId}/${filename}`, e.target.files[0] );
  }

  render() {

    const email = this.props.subState.get('email');
    const password = this.props.subState.get('password');
    const verifyCode = this.props.subState.get('verifyCode');

    const IdentityId = this.props.subState.get('IdentityId');
    
    const fileList = this.props.subState.get('fileList');
    const file = this.props.subState.get('file');

    return (
      <div className="App">
        <div>

          <input type="email" value={email} onChange={this.setEmail} placeholder='Email'/>

          <input type="password" value={password} onChange={this.setPassword} placeholder='Password'/>

          verify
          <input type="text" value={verifyCode} onChange={this.setVerifyCode}/>

          <button onClick={() => this.props.signup(email, password)}>
            sign up
          </button>
          <button onClick={() => this.props.verify(email, verifyCode)}>
            verify
          </button>
          <button onClick={() => this.props.login(email, password)}>
            log in
          </button>

          {JSON.stringify(this.props.subState.get('user'))}
          {this.props.subState.get('IdentityId')}
        </div>

        <hr/>

        <button onClick={() => this.props.listBucket(IdentityId)}>
          list files
        </button>

        {
          fileList.map((file, i) => console.log(file) || (
            <div key={i} onClick={() => this.props.getFile(file)}>{file}</div>
          ))
        }

        <input id="upload" ref="upload" type="file" accept="text/*"
               onChange={this.readFile}
               onClick={(event)=> event.target.value = null}/>

        <hr/>

        <pre style={{ textAlign: 'left' }}>{file}</pre>
      </div>
    );
  }
}

export default App;
