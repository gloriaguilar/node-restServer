/**
 * Created by Gloria on 23/07/2020.
 */

const express = require("express");
const app     = express();

app.use(require("./login"));
app.use(require("./usuario"));


module.exports=app;