// ====================== GLOBAL VARIABLES ======================

	// Import modules
	let db = require("../models/index.js");

	// Store Movie model
	let Movie = db.Movie;

// ====================== FUNCTIONS ======================
	let allMovies = response => {
		console.log("display all movies");
	};

	let addMovie = (request, response) => {
		console.log("add movie");
	};

	let updateView = (request, response) => {
		console.log("update viewed");
	};

	let updateComments = (request, response) => {
		console.log("update comments");
	};

	let removeMovie = (request, response) => {
		console.log("remove movie");
	};

// ====================== MAIN PROCESSES ======================

	module.exports = app => {
		app.get("/api/all", (allReq, allResp) => {
			allMovies(allResp);
		});

		app.post("/api/new", (newReq, newResp) => {
			addMovie(newReq, newResp);
		});

		app.put("/api/view/:id", (updtReq, updtResp) => {
			updateView(updtReq, updtResp);
		});

		app.put("/api/comments/:id", (updtReq, updtResp) => {
			updateComments(updtReq, updtResp);
		});

		app.delete("/api/remove/:id", (rmvReq, rmvResp) => {
			removeMovie(rmvReq, rmvResp);
		});
	};