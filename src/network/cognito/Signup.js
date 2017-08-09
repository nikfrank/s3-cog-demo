import {
  Config,
  CognitoIdentityCredentials,
} from 'aws-sdk';

import {
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';

import React from 'react';
import ReactDOM from 'react-dom';


const appConfig = {
  region: 'eu-west-1',
  IdentityPoolId: 'eu-west-1:5f6c3098-8026-4e92-b138-348445f98e8a',
  UserPoolId: 'eu-west-1_bgcY4B0No',
  ClientId: '6k9v6h39ajlo75uco5nncgd1rl',
};

Config.region = appConfig.region;
Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: appConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});

class Signup {
  constructor(next, done, err){
    this.next = next;
    this.done = done;
    this.err = err;
  }

  handleRequest(action){
    const email = action.network.payload.email.trim();
    const password = action.network.payload.password.trim();
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.log(err);
        this.err({ payload: err });
      } else {
        console.log('user name is ' + result.user.getUsername());
        console.log('call result: ', result);
        this.next({ payload: result.user.getUsername() });
        this.done();
      }
    });

    
  }
}

export default Signup;


export const SignupMock = class SignupMock {
  constructor(next){
    this.next = next
  }

  handleRequest( action ){
    this.next({ payload: 'stub' });
  }
};
