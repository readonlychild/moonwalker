const aws = require('aws-sdk');
const moment = require('moment');
const s3 = new aws.S3({ apiVersion:'2006-03-01' });

const store = {
  s3: {
    bucket: process.env.S3_BUCKET,
    keypref: process.env.S3_KEY_PREFIX,
    profilePing: true
  },
  get: function (id) {
    let self = this;
    let parms = {
      Bucket: this.s3.bucket,
      Key: `${this.s3.keypref}/${self._getRecordPath(id)}`
    };
    let ticks_start = new Date().getTime();
    return new Promise ((resolve, reject) => {
      console.log('parms', parms);
      return s3.getObject(parms).promise()
      .then((data) => {
        let ticks_end = new Date().getTime();
        if (self.s3.profilePing) console.log(ticks_end - ticks_start, 'S3 get ping');
        resolve(JSON.parse(data.Body.toString('utf-8')));
      })
      .catch((s3err) => {
        console.log('store-s3', 'get', s3err.message);
        if (s3err.message == 'The specified key does not exist.') {
          resolve({});
        }
        if (s3err.message === 'Access Denied') {
          resolve({});
        }
        resolve(false);
      });
    });
  },
  save: function (id, obj) {
    let self = this;
    obj.id = id;
    obj.lastSave = moment().format();
    let parms = {
      Bucket: this.s3.bucket,
      Key: `${this.s3.keypref}/${self._getRecordPath(id)}`,
      Body: JSON.stringify(obj, false, 2),
      ContentType: 'text/json'
    };
    let ticks_start = new Date().getTime();
    return new Promise ((resolve, reject) => {
      return s3.putObject(parms).promise()
      .then((result) => {
        let ticks_end = new Date().getTime();
        if (self.s3.profilePing) console.log(ticks_end - ticks_start, 'S3 save ping');
        resolve(true);
      })
      .catch((s3err) => {
        console.log('store-s3', 'save', s3err.message);
        resolve(false);
      });
    });
    
  },
  _getRecordPath: function (id) {
    if (!id) return false;
    let path = id.toString();
    if (id.length > 5) {
      path = `${id.substr(0, 2)}/${id.substr(2, 2)}/${id}.json`;
    }
    return path;
  }
};

module.exports = store;
