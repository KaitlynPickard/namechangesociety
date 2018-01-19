let express = require('express'),
    users = require('./server/users'),
    app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.send('Hello World!');
})

app.get('/users', users.getAllUsers);
app.get('/users/:id', users.getUser);
app.get('/createUser', users.createUser);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});