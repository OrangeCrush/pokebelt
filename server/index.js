#!/usr/bin/env node

'use strict';

let express = require('express');
let app = express();

app.use(express.static(__dirname + '/../public', {maxage: 0}));

let port = 3000;
app.listen(process.env.PORT || port);
console.log('App listening on port: ' + port);

