import AWS, { S3, Config } from 'aws-sdk';

const BucketName = 'techscope-jlm-demo';

let s3;

class UploadFile {
  constructor( next, done, err ){
    this.next = next;
    this.done = done;
    this.err = err;
  }

  handleRequest( action ){

    s3 = s3 || new S3({
      apiVersion: '2006-03-01',
      params: { Bucket: BucketName }
    });

    const files = action.network.payload.files;

    console.log(files);

    const  upload = new s3.upload({
      params: {
        Key: 'USERID/key-from-input.txt',
        Body: 'blob from input',
      },
    });

    return upload.send((err, res) => {
      console.log(res);
      if(err) this.err({ payload: err });
      else this.next({ payload: res });

      this.done();
    });
  }
}


export default UploadFile;
