let express = require('express'),
    users = require('./server/users'),
    admin = require('./server/admin'),
    auth = require('./server/auth'),
    app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.send('Hello World!');
})

app.get('/getUserName/:userID/:date?', users.getUserName);
app.get('/getUserNameHistory/:userID', users.getUserNameHistory);
app.get('/getUserQueuedName/:userID', users.getUserQueuedName);
app.get('/checkIfCurrentNameExpired/:userID', users.checkIfCurrentNameExpired);
app.get('/getExpiringNames', users.getExpiringNames);
app.get('/setUserName/:userID/:firstName/:lastName/:startDate?', users.setUserName);

app.get('/getAllUsersNames', admin.getAllUsersNames);
app.get('/getAllQueuedNames', admin.getAllQueuedNames);
app.get('/getExpiredNames', admin.getExpiredNames);

app.get('/createUser', auth.createUser);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});