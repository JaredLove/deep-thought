const mongoose = require('mongoose');
// || 'mongodb://localhost/deep-thoughts'
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoose.connection;
