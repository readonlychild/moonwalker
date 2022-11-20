const store = require('./../../../store/store-fs.js');
const moment = require('moment');

const handler = {
  type: 'FS',
  save: function (postData) {
    let key = `${postData.key}`;
    return new Promise ((resolve, reject) => {
      const titlemapkey = `${postData.guildId}/_titlemap`;
      return store.get(titlemapkey)
      .then((titlemap) => {
        
        if (!titlemap) {
          console.log('HANDLER[fs] - no titlemap o_O');
          resolve(false);
          return;
        }

        titlemap[`m${postData.channelId}`] = {
          title: postData.title || postData.name,
          cat: postData.cat,
          published: moment().format(),
          tags: postData.tags
        };

        let savepromises = [];
        savepromises.push(store.save(titlemapkey, titlemap));
        savepromises.push(store.save(key, postData));
        
        return Promise.all(savepromises)
        .then(() => {
          resolve(true);
        })
        .catch((fserr) => {
          console.log('fs.save', fserr.message);
          resolve(false);
        });
      });
    });
  }
};

module.exports = handler;
