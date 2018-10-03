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

	// Returns card component html for each movie
	let createMovieCard = currentMovie => {

		let beginningCard = [
			`<div class="col-md-6">`,
			`<div class="card">`,
			`<div class="card-body">`,
			`<div class="icon-section">`
			];

		// If the movie has been watched: push check mark icon with class of "watched" to the array
		if (currentMovie.viewed) {
			beginningCard.push(`<i class="fa fa-check-circle viewed-icon watched" 
				title="watch" data-id=${currentMovie.id} data-viewed=${currentMovie.viewed.toString()}></i>`);
		}
		// Otherwise, push the check mark icon without the "watched" class
		else {
			beginningCard.push(`<i class="fa fa-check-circle viewed-icon" 
				title="watched" data-id=${currentMovie.id} data-viewed=${currentMovie.viewed.toString()}></i>`);
		}

		let restOfCard = [
			`</div>`,
			`<div class="poster-section">`,
			`<img src=${currentMovie.img}>`,
			`</div>`,
			`<div class="info-section">`,
			`<h3>${currentMovie.title}</h3>`,
			`<p>Comments:</p>`,
			`<textarea type="text" class="form-control edit-comments" 
				style="display: none;" rows="3" data-id=${currentMovie.id}></textarea>`,
			`<p title="edit" class="comments-text">${currentMovie.comments}</p>`,
			`<button class="btn btn-secondary remove-movie" type="button" data-id=${currentMovie.id}>`,
			`<i class="fas fa-trash-alt"></i>`,
			`<span>Remove</span>`,
			`</button>`,
			`</div>`,
			`</div>`,
			`</div>`,
			`</div>`
		];

		// concatenate the beginningCard array and the restOfCard array
		let fullCard = beginningCard.concat(restOfCard);

		// Join array elements into a string
		return fullCard.join("");

	};


	let displaySavedMovies = movies => {
		$("#movies-saved-list").empty();

		// Display list of movies by...
		for (var i = 0; i < movies.length; i++) {
			
			// creating a row for every two movies OR
			// creating a row everytime you hit an even number
			if (i % 2 === 0) {
				let row = $("<div>");
				// give each row a number starting with 0
				row.addClass(`row row-${Math.floor(i / 2)}`);

				$("#movies-saved-list").append(row);
			}

			// create movie card component for each movie
			let movieCard = createMovieCard(movies[i]);

			// append movie cards to it's row
			$(`.row-${Math.floor(i / 2)}`).append(movieCard);

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
			$(event.target).attr("data-viewed", viewedStatus.toString());	

			// if the movie was watched, then add "watched" class (turn icon green)
			if (viewedStatus) {
				$(event.target).addClass("watched");
				$(event.target).attr("title", "watch");
			}
			// otherwise, remove class (turn icon black)
			else {
				$(event.target).removeClass("watched");
				$(event.target).attr("title", "watched");
			}
		});
	};

	let removeMovie = event => {
		// Store the movie id of the selected movie
			// using event.currentTarget instead of event.target since we
			// have various elements within the button tag
			// event.currentTag: the current DOM element within the event bubbling phase
			// event.target: the DOM element that initiated the event
		let movieId = $(event.currentTarget).attr("data-id");

		// Send delete request
		$.ajax({
			url: `/api/delete/${movieId}`,
			method: "DELETE"
		}).then(response => {
			// and then update #movies-saved-list 
			moviesSaved();
		});
	};

	// Displays textarea in order to edit comments
	let editComments = event => {
		// Store the p tag of the comments selected
		let comments = $(event.target);
		// Store the targeted movie's .info-section div
		let movieInfoSection = comments.parent();

		// Target the textarea tag of the .info-section
		let commentsEditing = movieInfoSection.children(".edit-comments");

		// Hide the comments...
		comments.hide();

		// And display the textarea focused with the comments
		commentsEditing.val(comments.text());
		commentsEditing.show();
		commentsEditing.focus();

	};

	let finishEditingComments = event => {

		// When a user presses "enter" key is released...
		if (event.keyCode === 13) {
			// Store new comments
			let newComments = {
				comments: $(event.target).val().trim()
			};
			let movieId = $(event.target).attr("data-id");
			
			$.ajax({
				url: `/api/comments/${movieId}`,
				method: `PUT`,
				contentType: "application/json",
				data: JSON.stringify(newComments)
			}).then(moviesSaved);
		}
	};

	// let cancelEditComments = () => {
	// 	console.log("cancel");
	// };

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

	// Remove movie from the list
	$("#movies-saved-list").on("click", ".remove-movie", removeMovie);

	// Edit comments of a movie
	$("#movies-saved-list").on("click", ".comments-text", editComments);

	// Finish editing comments of a movie
	$("#movies-saved-list").on("keyup", ".edit-comments", finishEditingComments);

	$("#movies-saved-list").on("blur", ".edit-comments", moviesSaved);

});