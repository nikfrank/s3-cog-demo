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

    const file = action.network.payload.file;

    const  upload = new S3.ManagedUpload({
      params: {
        Bucket: BucketName,
        Key: action.network.payload.filename,
        Body: file,
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
