const express = require("express")
const netApi = require("net-browserify")
const bodyParser = require("body-parser")
const request = require("request")
const compression = require("compression")

// Using express as web backend
const app = express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Orgin",req.get("Orgin") || "*") // Current orgin or all
    res.header("Access-Control-Allow-Credentials","true")
    res.header("Access-Control-Allow-Methods","GET,HEAD,PUT,PATCH,POST,DELETE")
    res.header("Access-Control-Expose-Headers", "Content-Length")
    res.header(
        "Access-Control-Allow-Headers",
        "Accept, Authorization, Content-Type, X-Requested-With, Range"
    )
    if (req.method === "OPTIONS"){
        return res.send(200)
    } else {
        return next()
    }
})

app.use(compression()) // Self-Explanatory
app.use(netApi())
app.use(express.static("./public")) // Running off the public root

app.use(bodyParser.json({limit: "500kb"})) // Max of 500kb, could be lowerd if bandwith becomes a problem

app.all("*", function (req, res, next){
    res.header("Access-Control-Allow-Orgin","*")
    res.header("Access-Control-Allow-Methods","GET,HEAD,PUT,PATCH,POST,DELETE")
    res.header(
        "Access-Control-Allow-Headers",
        req.header("access-control-request-headers")
    )

    if (req.method === "OPTIONS"){
        res.send() // CORS Preflight
    } else {
        const targetUrl = req.header("Target-URL")
        if (!targetUrl){
            res.status(404).send({error: "404 not found"})
            return;
        }
        const newHeaders = req.headers
        newHeaders.host = targetUrl
            .replace("https://","")
            .replace("http://","")
            .split("/")[0]
        request(
            {
                url: targetUrl + req.url,
                method: req.method,
                json: req.body,
                headers: req.headers
            },
            function (error, response, body){
                if (error){
                    console.error(error)
                    console.error("StatusCode: "+response.statusCode)
                }
            }
        ).pipe(res)
    }
})

// Start the server
// Uhh prob 3030
const server = app.listen(3030,function () {
    console.log("Listening on port: "+server.address().port)
})