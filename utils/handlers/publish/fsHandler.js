const fs = require('fs');
const { publishConfig } = require('./../../../config.json');

const handler = {
  type: 'FS',
  save: function (postData) {

    let filename = `${postData.key.replace(/\//g, '_')}.json`;
    let folder = publishConfig.FS_DIR || 'c:/temp/moonwalks/';
    
    return new Promise ((resolve, reject) => {
      fs.writeFileSync(`${folder}${filename}`, JSON.stringify(threadData, null, 2));
      resolve(true);
    });
  }
};

module.exports = handler;
