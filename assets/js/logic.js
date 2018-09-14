$(document).ready(() => {
// ====================== FUNCTIONS ======================

	// Grabs the movie entered in the search form
	let movieSearch = event => {
		event.preventDefault();
		
		let userInput = $("#movie-input").val().trim();

		// If a blank form was entered, then mark input form "red"
		if (userInput === "") {
			$("#movie-input").addClass("form-error");
		}
		// Otherwise, if a value was entered, then start the search
		else {
			$("#movie-input").val("");

			searchMovie(userInput);
		}
	};

	// Everytime the form input is focused, remove the form-error
	// class (displays the field in red)
	let formFocus = () => {
		$("#movie-input").removeClass("form-error");
	};

	// Obtain search results
	let searchMovie = movieName => {
		$.ajax({
			url: `http://www.omdbapi.com/?apikey=4b1d9a31&type=movie&r=json&page=1&s=${movieName}`,
			method: "GET"
		}).then(response => {
			// If we obtain results, then display the movie results
			displayResults(response);
		}).catch(err => {
			// If an error occurred, then alert user
			alert("Oops! Something went wrong");
		});
	};

	// Displays top three results of the search
	let displayResults = movieResults => {
		$("#results-modal .modal-body").empty();

		// If results are returned, then display top three results in the modal
		if (movieResults.Response === "True") {
			let movieCount = 3;
			let movies = movieResults.Search;

			let row = $("<div>");
			row.addClass("row");

			// For the top three results, display movie title, poster, and add button
			for (var i = 0; i < movieCount; i++) {
				let movieDiv = $("<div>");
				let titleDiv = $("<h5>");
				let imgTag = $("<img>");
				let button = $("<button>");

				movieDiv.addClass("col-md-4 movie-result");
				button.addClass("btn btn-primary");

				imgTag.attr("src", movies[i].Poster);
				button.attr("type", "submit");

				titleDiv.text(movies[i].Title);
				button.text("Add");

				movieDiv.append(titleDiv).append(imgTag).append(button);

				row.append(movieDiv);
			}

			$("#results-modal .modal-body").append(row);
		}
		// If a response was returned, but that response has no search results... 
		else {
			$("#results-modal .modal-body").html("<h4>No results. Try again.</h4>");
		}

		// Show the modal
		$("#results-modal").modal("toggle");
	};


// ====================== MAIN PROCESSES ======================

	$("#search-form .btn").on("click", movieSearch);

	// $("#search-form .btn").on("click", event => {
	// 	event.preventDefault();

	// 	$("#results-modal").modal("toggle");
	// })

	$("#movie-input").focus(formFocus);
});