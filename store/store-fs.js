const fs = require('fs');
const path = require('path');
const moment = require('moment');

const store = {
  get: function (id) {
    var self = this;
    return new Promise ((resolve, reject) => {
      if (id) id = id.toString();
      let path = id;
      if (id.toString().length > 5) {
        path = `./records/${id.substr(0,2)}/${id.substr(2,2)}/${id}.json`;
        self._ensureDirectoryExistence(`${path}`);
      } else {
        path += '.json';
      }
      console.log('store.path', path);
      fs.readFile(`${path}`, (err, data) => {
        if (err) {
          console.log(err);
          if (err.code === 'ENOENT') {
            resolve({});
          } else {
            resolve(false);
          }
        } else {
          if (!data) {
            resolve(false);
          }
          try {
            let obj = JSON.parse(data);
            obj.id = id;
            resolve(obj);
          } catch (ex) {
            console.log('file exists but not JSON!', path);
            reject({ message: ex.message, probable: 'file exists but not JSON.' });
            //resolve (false);
          }
        }
      });
    });
  },
  save: function (id, obj) {
    var self = this;
    obj.lastSave = moment().format();

    return new Promise ((resolve, reject) => {
      if (!id) reject('No id o_O');
      id = id.toString();
      let path = id;
      if (id.toString().length > 5) {
        path = `./records/${id.substr(0,2)}/${id.substr(2,2)}/${id}.json`;
        self._ensureDirectoryExistence(`${path}`);
      } else {
        path += '.json';
      }
      fs.writeFile(`${path}`, JSON.stringify(obj), (err) => {
        if (err) reject({ message: 'Could not save file!' });
        resolve(true);
      });
    });
  },
  _ensureDirectoryExistence (filePath) {
    let dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) return true;
    this._ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }
};

module.exports = store;
