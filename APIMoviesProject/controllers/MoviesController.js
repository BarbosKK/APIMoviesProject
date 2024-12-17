const {db} = require("../db");
const Utils = require("./utils");

exports.getAll = async (req, res) => { 
    const games = await db.games.findAll();
    res.send(games.map(({id, name}) => {return {id, name}}))
}
exports.getById = async (req, res) => {
    const game = await getGame(req, res);
    if (!game) { return};
    return res.send(game);
    }
exports.create = async (req, res) => {
    if (!req.body.GameName || 
        !req.body.ReleaseDateEU ||
        !req.body.ReviewScore) 
    {   return res.status(400).send({error: "One or multiple parameters are missing"});    }
    let newGame = {        
        GameName: req.body.GameName,
        ReleaseDateEU: req.body.ReleaseDateEU,
        ReviewScore: req.body.ReviewScore
    }
    const createdGame = await db.games.create(newGame);
    res.status(201)
        .location(`${Utils.getBaseURL(req)}/games/${createdGame.GameID}`)
        .send(createdGame.GameID);
}
exports.editById = async (req,res) => {
    const game = await getGame(req, res);
    if (!game) { return };
    if (!req.body.GameName || 
        !req.body.ReleaseDateEU ||
        !req.body.ReviewScore) 
    {   return res.status(400).send({error: "One or multiple parameters are missing"});    }
    game.GameName = req.body.GameName
    game.ReleaseDateEU = req.body.ReleaseDateEU
    game.ReviewScore = req.body.ReviewScore
    await game.save();
    return res.status(201)
        .location(`${Utils.getBaseURL(req)}/games/${game.GameID}`)
        .send(game);
}
exports.deleteById = async (req, res) => {
    const game = await getGame(req,res);
    if (!game) { return };
    await game.destroy();
    res.status(204).send({error: "No Content"});
    
}
const getGame = async (req, res) => {
    const idNumber = parseInt(req.params.GameID);
    if (isNaN(idNumber)) {
        res.status(400).send({error: `Invalid game ID ${req.params.GameID}`});
        return null;
    }
    const game = await db.games.findByPk(idNumber);
    if (!game) {
        res.status(404).send({error: "Game not found"});
        return null;
    }
    return game;
}