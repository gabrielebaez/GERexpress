
const express = require('express')
const app = express()
var bodyParser = require('body-parser');

// configure app to get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var g = require('ger');
var esm = new g.MemESM(); // Create a new event manager
var ger = new g.GER(esm); // Initialize ger with the event manager

/////////////////////////////////////////////////////

app.get('/', function(req, res){
    res.send('hello recommender');
})


app.post('/create_namespace', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    body = req.body;

    ger.initialize_namespace(body.namespace)
        .then((namespace) => {
            res.send(JSON.stringify({ message: `namespace ${body.namespace} registrado.` }));
        })
        .catch((reason) => {
            res.send(JSON.stringify({ message: 'error' }));
        })
})


app.post('/destroy_namespace', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    body = req.body;

    ger.destroy_namespace(body.namespace)
    .then((namespace) => {
        res.send(JSON.stringify({ message: `namespace ${body.namespace} borrado.` }));
    })
    .catch((reason) => {
        res.send(JSON.stringify({ message: 'error' }));
    })
})


app.post('/add_events', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    body = req.body;

    ger.events(body.events)
        .then((events) => {
            res.send(JSON.stringify(events))
        })
        .catch((reason) => {
            res.send(JSON.stringify({ message: 'error', reason: reason }));
        })
})


app.get('/events/:namespace', function(req, res){
    res.setHeader('Content-Type', 'application/json');

    ger.find_events(req.params.namespace)
        .then((events)=>{
            res.send(JSON.stringify({ events: events }));
        })
        .catch((reason)=>{
            res.send(JSON.stringify({ message: 'error', reason: reason }))
        })
})


app.post('/recommendations', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    body = req.body;

    ger.recommendations_for_person(body.namespace, body.person, {actions: {likes: 1}})
        .then(function(recommendations){
            res.send(JSON.stringify(recommendations,null,2));
        })
})


app.post('/recommendations_for_thing', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    body = req.body;

    ger.recommendations_for_thing(body.namespace, body.thing, body.configuration)
        .then((response)=>{
            res.send(JSON.stringify({recommendations: response}));
        })
        .catch((reason)=>{
            res.send(JSON.stringify({message: reason}));
        })
})


app.post('/thing_neighbourhood', function(req, res){
    res.setHeader('Content-Type','application/json');
    body = req.body;

    ger.thing_neighbourhood(body.namespace, body.thing, body.actions)
        .then((response)=>{
            res.send(JSON.stringify({neighbourhood: response}));
        })
        .catch((reason)=>{
            res.send(JSON.stringify({message: reason}))
        })
})

/////////////////////////////////////////////////////

app.listen(3000, function(){
    console.log('example app listening on port 3000')
})
