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
			userInput = userInput.replace(/ /g, "+"); // replace " " with "+"

			searchMovie(userInput);
		}
	};

	// Everytime the form input is focused, remove the form-error
	// class (the class displays the field in red)
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
			displaySearchResults(response);
		}).catch(err => {
			// If an error occurred, then alert user
			alert("Oops! Something went wrong");
		});
	};

	// Displays top three results of the search
	let displaySearchResults = movieResults => {
		$("#results-modal .modal-body").empty();

		// If results are returned, then display top three results in the modal
		if (movieResults.Response === "True") {
			let movies = movieResults.Search;
			let movieCount = movies.length;

			if (movies.length >= 3) {
				movieCount = 3;
			}

			let row = $("<div>");
			row.addClass("row");

			// For movie results: display movie title, poster, and add button
			for (var i = 0; i < movieCount; i++) {
				
				// Create html elements
				let movieDiv = $("<div>");
				let titleDiv = $("<h5>");
				let imgTag = $("<img>");
				let button = $("<button>");

				// Adding classes
				movieDiv.addClass(`movie-result col-md-${12 / movieCount}`);
				button.addClass("btn btn-primary add-movie");

				// Adding attributes to html tags
				if (movies[i].Poster === "N/A") {
					imgTag.attr("src", "https://www.movieinsider.com/images/none_175px.jpg");
				}
				else {
					imgTag.attr("src", movies[i].Poster);
				}
				
				imgTag.attr("alt", "No movie poster found");
				button.attr("data-title", movies[i].Title);
				button.attr("data-year", movies[i].Year);
				button.attr("data-img", movies[i].Poster);

				// Add text 
				titleDiv.text(movies[i].Title);
				button.text("Add");

				// Append elements
				movieDiv.append(titleDiv)
								.append(imgTag)
								.append(button);

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

	let addMovie = (event) => {
		
		let movieInfo = {
			title: $(event.target).attr("data-title"),
			year: $(event.target).attr("data-year"),
			img: $(event.target).attr("data-img")
		};

		// Save movie information to the database
		$.ajax({
			url: "/api/new",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(movieInfo)
		}).then(response => {
			// and then hide modal and grab new list of movies saved
			$("#results-modal").modal("hide");
			moviesSaved();
		});

	};

	let moviesSaved = () => {
		// Retrieve list of movies saved in database
		$.ajax({
			url: "/api/all",
			method: "GET"
		}).then(response => {
			// and then display list of movies
			displaySavedMovies(response);
		});
	};


	let displaySavedMovies = movies => {
		$(".container").empty();

		// Display list of movies by...
		for (var i = 0; i < movies.length; i++) {
			
			// creating a row for every two movies
			// or create a row when you hit an even number
			if (i % 2 === 0) {
				let row = $("<div>");
				// give each row a row number starting with 0
				row.addClass(`row row-${Math.floor(i / 2)}`);

				$(".container").append(row);
			}

			// create html elements for a each movie
			let colDiv = $("<div>");
			let cardDiv = $("<div>");
			let cardBodyDiv = $("<div>");
			let iconDiv = $("<div>");
			let imgDiv = $("<div>");
			let infoDiv = $("<div>");
			let iconTag = $("<i>");
			let imgTag = $("<img>");
			let titleTag = $("<h3>");
			let commentsTitleTag = $("<p>");
			let commentsTag = $("<p>");

			// Add classes to elements
			colDiv.addClass("col-md-6");
			cardDiv.addClass("card");
			cardBodyDiv.addClass("card-body");
			iconTag.addClass("fas fa-check-circle viewed-icon");

			// Add attributes
			iconTag.attr("data-viewed", movies[i].viewed.toString());
			iconTag.attr("data-id", movies[i].id);
			imgTag.attr("src", movies[i].img); // movie poster

			// Add text
			titleTag.text(movies[i].title); // movie name
			commentsTitleTag.text("Comments:"); 
			commentsTag.text(movies[i].comments); // movie comments

			// Append elements
			iconDiv.append(iconTag);

			imgDiv.append(imgTag); 

			infoDiv.append(titleTag)
				.append(commentsTitleTag)
				.append(commentsTag);

			cardBodyDiv.append(iconDiv)
				.append(imgDiv)
				.append(infoDiv);

			cardDiv.append(cardBodyDiv);
			colDiv.append(cardDiv);

			// append movie div to it's row
			$(`.row-${Math.floor(i / 2)}`).append(colDiv);

		}
	};

	let movieViewStatus = (event) => {
		// Store current viewed and id values of the movie selected
		let viewedStatus = $(event.target).attr("data-viewed");
		let movieId = $(event.target).attr("data-id");

		// Turn viewedStatus value to a boolean and 
		// to the new viewed value it needs to be updated to
		if (viewedStatus === "true") {
			viewedStatus = false;
		}
		else {
			viewedStatus = true;
		}

		let movieUpdate = {
			viewed: viewedStatus
		};

		// Update the viewed status in the db
		$.ajax({
			url: `/api/view/${movieId}`,
			method: "PUT",
			data: movieUpdate
		}).then(response => {
			// and then update the "data-viewed" attribute to the new viewed value
			console.log("viewed status updated");
			$(event.target).attr("data-viewed", viewedStatus.toString());		
		});
	};


// ====================== MAIN PROCESSES ======================

	// On initial load, grab movies saved in database
	moviesSaved();

	// Start movie search when search form is submitted
	$("#search-form .btn").on("click", movieSearch);

	// $("#search-form .btn").on("click", event => {
	// 	event.preventDefault();

	// 	$("#results-modal").modal("toggle");
	// })

	// Removes "form-error" styling class when input field in search form is focused
	$("#movie-input").focus(formFocus);

	// Adds movie selected from search results
	$("#search-results").on("click", ".add-movie", addMovie);

	// Updates viewed status of a movie
	$("#movies-saved-list").on("click", ".viewed-icon", movieViewStatus);

});