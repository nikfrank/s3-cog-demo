import AWS, { S3, Config } from 'aws-sdk';

const BucketName = 'techscope-jlm-demo';

let s3;

class GetFile {
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

    s3.getObject({
      Key: action.network.payload.file
    }, (err, data) => {
      if(err) this.err({ payload: err });
      else this.next({ payload: data.Body.toString('utf-8') });

      this.done();
    });
  }
}


export default GetFile;
