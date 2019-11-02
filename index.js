const app = require('express')(),
	db = require('./config/db'),
    consign = require('consign')
    
consign()
    .then('./config/middleware.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.db = db

app.listen(3000, function() {
	console.log('Backend Executando');
});
