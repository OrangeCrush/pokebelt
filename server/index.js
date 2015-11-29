#!/usr/bin/env node

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/../public', { maxage: 0 })); 

var port = 3000;
app.listen(process.env.PORT || port);
console.log("App listening on port: " + port);

