const { publishConfig } = require('./../../../config.json');
const store = require('./../../../store/store-s3.js');

const handler = {
  type: 'S3',
  save: function (postData) {
    let key = postData.key;
    return new Promise ((resolve, reject) => {
      const titlemapkey = `${postData.guildId}/_titlemap`;
      return store.get(titlemapkey)
      .then((titlemap) => {

        if (!titlemap) {
          console.log('HANDLER - no titlemap o_O');
          resolve(false);
          return;
        }

        titlemap[`m${postData.channelId}`] = {
          title: postData.title,
          cat: postData.cat
        };

        console.log('titlemap', titlemap);
        let savepromises = [];
        savepromises.push(store.save(titlemapkey, titlemap));
        savepromises.push(store.save(key, postData));
      
        return Promise.all(savepromises)
        .then(() => {
          resolve(true);
        })
        .catch((s3err) => {
          console.log('s3.save', s3err.message);
          resolve(false);
        });
      });
    });
  }
};

module.exports = handler;
