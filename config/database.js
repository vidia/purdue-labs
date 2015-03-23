//database.js
module.exports = {
    geturl : function() {
      if(process.env.MONGOLAB_URI) {
        return process.env.MONGOLAB_URI;
      } else {
        return 'mongodb://localhost:27017/purdue-labs';
      }
    }
};
