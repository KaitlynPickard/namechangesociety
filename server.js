let express = require('express');
let users = require('./server/users');
let admin = require('./server/admin');
let auth = require('./server/auth');
let app = express();

app.set('port', process.env.PORT || 3000);

app.use('/', express.static(__dirname + '/www'));

app.get('/getUserName/:userID/:date?', users.getUserName);
app.get('/getUserNameHistory/:userID', users.getUserNameHistory);
app.get('/getUserQueuedName/:userID', users.getUserQueuedName);
app.get('/checkIfCurrentNameExpired/:userID', users.checkIfCurrentNameExpired);
app.get('/getExpiringNames', users.getExpiringNames);
app.get('/setUserName/:userID/:firstName/:lastName/:startDate?', users.setUserName);

app.get('/getAllUsersNames', admin.getAllUsersNames);
app.get('/getAllQueuedNames', admin.getAllQueuedNames);
app.get('/getExpiredNames', admin.getExpiredNames);

app.get('/createUser/:firstName/:lastName/:password', auth.createUser);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});