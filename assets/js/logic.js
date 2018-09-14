$(document).ready(() => {
// ====================== FUNCTIONS ======================

	// Grabs the movie entered in the search form
	let movieSearch = event => {
		event.preventDefault();
		
		let userInput = $("#movie-input").val().trim();

		if (userInput === "") {
			$("#movie-input").addClass("form-error");
		}
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
			displayResults(response);
		}).catch(err => {
			alert("Oops! Something went wrong");
		});
	};

	// Displays top three results of the search
	let displayResults = movieResults => {
		if (movieResults.Response === "True") {
			let movieCount = 3;

			movieResults.Search.forEach(currMovie => {
				
			})
		} 
		else {
			$("#results-modal .modal-body").html("<h4>No results. Try again.</h4>");

			$("#results-modal").modal("toggle");
		}
	};


// ====================== MAIN PROCESSES ======================

	$("#search-form .btn").on("click", movieSearch);

	$("#movie-input").focus(formFocus);
});