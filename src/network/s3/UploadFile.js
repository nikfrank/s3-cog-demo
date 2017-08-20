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

    const { file, filename, identityId } = action.network.payload;

    s3.upload({
      Key: `home/${identityId}/${filename}`,
      Body: file,
    }, (err, res) => {
      console.log(err, res);
      if(err) console.log(err, 'err')|| this.err({ payload: err });
      else this.next({ payload: res });
      
      this.done();
    });
  }
}


export default UploadFile;
