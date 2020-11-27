const express = require("express")
const app = express()
const consign = require("consign")

consign()
    .include("users.json")
    .then("./middlewares.js")
    .then("./api")
    .then("./routes.js")
    .into(app)

app.listen(5000, () => {
    console.log("Aplicação rodando!")
})