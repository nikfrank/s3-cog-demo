import {
  Config,
  CognitoIdentityCredentials,
} from 'aws-sdk';

import {
  CognitoUser,
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


class Verify {
  constructor(next, done, err){
    this.next = next;
    this.done = done;
    this.err = err;
  }

  handleRequest(action){

    var userData = {
      Username : action.network.payload.email.trim(),
      Pool : userPool
    };

    var cognitoUser = new CognitoUser(userData);
    
    cognitoUser
      .confirmRegistration(action.network.payload.verifyCode, true, (err, result) => {
        if (err) {
          console.log(err);
          this.err({ payload: err });
        } else {
          console.log('call result: ', result);
          this.next({ payload: result });
          this.done();
        }
      });
    
  }
}

export default Verify;


export const VerifyMock = class VerifyMock {
  constructor(next){
    this.next = next
  }

  handleRequest( action ){
    this.next({ payload: 'stub' });
  }
};
