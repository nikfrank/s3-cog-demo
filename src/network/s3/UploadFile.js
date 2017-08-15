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

    return this.done();

    
    s3.listObjects({
      Prefix: 'home/'+action.network.payload.II
    }, (err, data) => {
      console.log(err, data);
      if(err) this.err({ payload: err });
      else this.next({ payload: data.Contents.map(o => o.Key) });

      this.done();
    });
  }
}


export default UploadFile;
