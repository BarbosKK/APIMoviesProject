const GamesController = require('../controllers/GamesController');
module.exports = (app) => {
    app.route("/games")
        .get(GamesController.getAll)
        .post(GamesController.create)
    app.route("/games/:id")
        .get(GamesController.getById)
        .put(GamesController.editById)
        .delete(GamesController.deleteById)
}