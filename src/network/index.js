import Signup from './cognito/Signup';
import Login from './cognito/Login';
import Verify from './cognito/Verify';
import GetCurrentUser from './cognito/GetCurrentUser';

import ListBucket from './s3/ListBucket';
import GetFile from './s3/GetFile';

export default {
  Signup,
  Login,
  Verify,
  GetCurrentUser,

  ListBucket,
  GetFile,
};
