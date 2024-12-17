require('dotenv').config();

const port = process.env.PORT || 3001;
const host = 'localhost';
const express = require('express');
const cors = require('cors');
const app = express();

const swaggerUI = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDoc = yamljs.load('./docs/swagger.yaml');

const {sync} = require('./db');


const users = [
    {
        ID: 1,
        Username: "xXtittyslayer666Xx",
        Firstname: "Mihkel",
        Lastname: "Jaakson",
        Email: "mihkel@example.com",
        SecureLevel: 0,
        LevelKey: "0-0"
    },
    {
        ID: 2,
        Username: "BluePill",
        Firstname: "Olle",
        Lastname: "Õlle",
        Email: "Olleolle@example.com",
        SecureLevel: 0,
        LevelKey: "0-1"
    },
    {
        ID: 2,
        Username: "SuperMadis",
        Firstname: "Mattias",
        Lastname: "Moderaator",
        Email: "suma@example.com",
        SecureLevel: 0,
        LevelKey: "1-0"
    },
    {
        ID: 3,
        Username: "Admin",
        Firstname: "Admin",
        Lastname: "istraator",
        Email: "Olleolle@example.com",
        SecureLevel: 1,
        LevelKey: "0-0"
    },
]

app.use(cors());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(express.json());

app.get("/", (req, res) => {
    res.send(`Server running. Documentation at <a href="http://${host}:${port}/docs">/docs</a>`);
})

require("./routes/gameRoutes")(app);

app.get("/users", (req, res) => { res.status(200).send(users)})

app.get("/users/:id", (req, res) => {
    if (typeof users[req.params.id -1] === "undefined") {
        return res.status(404).send({error: "User not found"});
    }
    if (req.params.id == null) {
        return res.status(400).send({error: "Invalid user ID specified"});
    }
    res.status(200).send(users[req.params.id-1])
})
app.post('/users', (req, res) => {
    // ID: 1,
    //     Username: "xXtittyslayer666Xx",
    //     Firstname: "Mihkel",
    //     Lastname: "Jaakson",
    //     Email: "mihkel@example.com",
    //     SecureLevel: 0,
    //     LevelKey: "0-0"
    if (!req.body.Username ||
        !req.body.Firstname||
        !req.body.Lastname||
        !req.body.Email||
        !req.body.SecureLevel||
        !req.body.LevelKey) 
    {
        return res.status(400).send({error: "One or multiple parameters are missing"});
    }

    let user = {
        ID: users.length +1,
        Username: req.body.Username,
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        Email: req.body.Email,
        SecureLevel: req.body.SecureLevel,
        LevelKey: req.body.LevelKey,
    }
    users.push(user);
    res.status(201)
        .location(`${getBaseURL(req)}/users/${users.length}`)
        .send(user);
})

app.put('/users/:id', (req, res) => {
    if (req.params.id == null) {
        return res.status(404).send({error: "User not found"});
    }
    if (!req.body.Username ||
        !req.body.Firstname||
        !req.body.Lastname||
        !req.body.Email||
        !req.body.SecureLevel||
        !req.body.LevelKey) 
    {
        return res.status(400).send({error: "One or multiple parameters are missing"});
    }
    let user = {
        ID: parseInt(req.body.id+1),
        Username: req.body.Username,
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        Email: req.body.Email,
        SecureLevel: req.body.SecureLevel,
        LevelKey: req.body.LevelKey,
    }
    user.ID = parseInt(req.body.ID);
    users.splice((req.body.ID-1), 1, user);
    res.status(201)
        .location(`${getBaseURL(req)}/users/${users.length}`)
        .send(user);
})

app.delete('/users/:id', (req, res) => {
    if(typeof users[req.params.id -1] === 'undefined') {
        return res.status(404).send({error: "User not found"});
    }
    users.splice(req.params.id-1, 1);

    res.status(204).send({error: "No Content"});
})

app.listen(port, async() => {
    if (process.env.SYNC === 'true') {
        await sync();
    }
    console.log(`Api on saadaval aadressil: http://${host}:${port}`);
});