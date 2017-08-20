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

      listBucket: (identityId) => ({
        network: {
          handler: 'ListBucket',
          payload: { identityId },
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

      uploadFile: (file, filename, identityId) => ({
        network: {
          handler: 'UploadFile',
          payload: { file, filename, identityId },
          nextAction: { type: 'successFileUpload' },
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

      setIdentityId: (state, {payload}) => state.set('identityId', payload),

      setFile: (state, {payload}) => state.set('file', payload),

      successFileUpload: (state, {payload}) => console.log(payload)||state.set('uploadedFile', 'hooray'),
    }
  }

  static get initState() {
    return fromJS({
      email: '',
      password: '',
      verifyCode: '',
      identityId: '',
      file: '',
      fileList: [],
      uploadedFile: '',
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
    this.props.uploadFile( e.target.files[0], e.target.value.slice(12), this.props.subState.get('identityId') );
  }

  render() {

    const email = this.props.subState.get('email');
    const password = this.props.subState.get('password');
    const verifyCode = this.props.subState.get('verifyCode');

    const fileList = this.props.subState.get('fileList');
    const file = this.props.subState.get('file');
    
    const uploadedFile = this.props.subState.get('uploadedFile');

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
          {this.props.subState.get('identityId')}
        </div>

        <hr/>

        <button onClick={() => this.props.listBucket(this.props.subState.get('identityId'))}>
          list files
        </button>

        {
          fileList.map((file, i) => (
            <div key={i} onClick={() => this.props.getFile(file)}>{file}</div>
          ))
        }

        <input id="upload" ref="upload" type="file" accept="text/*"
               onChange={this.readFile}
               onClick={(event)=> event.target.value = null}/>

        <hr/>

        <pre style={{ textAlign: 'left' }}>{file}</pre>

        <hr/>

        {
          uploadedFile
        }
      </div>
    );
  }
}

export default App;
