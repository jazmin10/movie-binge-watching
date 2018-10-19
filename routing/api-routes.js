// ====================== GLOBAL VARIABLES ======================

	// Import modules
	let db = require(`../models/index.js`);

	// Store Movie model
	let Movie = db.Movie;

// ====================== FUNCTIONS ======================
	let allMovies = response => {

		// Response with an array of the movies in the db
		Movie.findAll().then(results => {
			response.json(results);
		});
	};

	let addMovie = (request, response) => {
		// Store title, year, and img values from the body of the request
		let { title, year, img } = request.body;
		let movie = { title, year, img };

		// Add movie to the db and respond with the new row values
		Movie.create(movie).then(results => {
			response.json(results);
		});
	};

	let updateView = (request, response) => {
		// Store viewed value from the body of the request
		let { viewed } = request.body;
		// Store id of the movie from the request url
		let { id } = request.params;

		let newValue = { viewed: viewed };
		let condition = { where: { id } };

		// Update the viewed value of the specified movie
		// and respond with number of affected rows
		Movie.update(newValue, condition).then(results => {
			response.json(results);
		});
	};

	let updateComments = (request, response) => {
		// Store the comments value from the body of the request
		let { comments } = request.body;
		// Store the id of the movie from the request url
		let { id } = request.params;

		if (!comments) {
			comments = `None`;
		}

		let newValue = { comments: comments };
		let condition = { where: { id } };

		// Update the comments value of the specified movie
		// and response with the number of affected rows
		Movie.update(newValue, condition).then(results => {
			response.json(results);
		});
	};

	let removeMovie = (request, response) => {
		// Store the id value from the request url
		let { id } = request.params;

		let condition = { where: { id } };

		// Delete the specified movie and return the number of
		// affected rows
		Movie.destroy(condition).then(results => {
			response.json(results);
		});
	};

// ====================== MAIN PROCESSES ======================

	module.exports = app => {

		// Finds all movies in the db
		app.get(`/api/all`, (allReq, allResp) => {
			allMovies(allResp);
		});

		// Adds a movie to the db
		app.post(`/api/new`, (newReq, newResp) => {
			addMovie(newReq, newResp);
		});

		// Updates the viewed value of a specific movie in the db
		app.put(`/api/view/:id`, (updtReq, updtResp) => {
			updateView(updtReq, updtResp);
		});

		// Updates comments of a specific movie in the db
		app.put(`/api/comments/:id`, (updtReq, updtResp) => {
			updateComments(updtReq, updtResp);
		});

		// Deletes a movie from the db
		app.delete(`/api/delete/:id`, (rmvReq, rmvResp) => {
			removeMovie(rmvReq, rmvResp);
		});
	};