import AWS, {
  Config,
  CognitoIdentity,
  CognitoIdentityCredentials,
} from 'aws-sdk';

import {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

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


class Login {
  constructor(next, done, err){
    this.next = next;
    this.done = done;
    this.err = err;
  }

  handleRequest(action){

    var authenticationData = {
      Username: action.network.payload.email,
      Password: action.network.payload.password,
    };

    var authenticationDetails = new AuthenticationDetails(authenticationData);

    var userData = {
      Username: action.network.payload.email,
      Pool: userPool,
    };

    var cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        
        const nuCC = Config.credentials = new CognitoIdentityCredentials({
          IdentityPoolId: appConfig.IdentityPoolId,
          Logins: {
            ['cognito-idp.eu-west-1.amazonaws.com/'+appConfig.UserPoolId]:
            result.getIdToken().getJwtToken()
          },
        });

        // evil global aws
        AWS.config.update({
          region: 'eu-west-1',
          credentials: nuCC,
        });

        (new CognitoIdentity()).getId({
          IdentityPoolId: appConfig.IdentityPoolId,
          Logins: {
            ['cognito-idp.eu-west-1.amazonaws.com/'+appConfig.UserPoolId]:
            result.getIdToken().getJwtToken()
          },
          AccountId: '735148112467',
        }, (err, data)=>{
          console.log(err, data, 'id');
          this.next({ payload: data.IdentityId });
          this.done();
          
        });
        
        // Instantiate aws sdk service objects now that
        // the credentials have been updated. 
        // example: var s3 = new AWS.S3(); 

        
      },
      
      onFailure: err => console.log(err) || this.err({ payload: err }),
      
    });

    
  }
}

export default Login;


export const LoginMock = class LoginMock {
  constructor(next){
    this.next = next
  }

  handleRequest( action ){
    this.next({ payload: 'stub' });
  }
};
