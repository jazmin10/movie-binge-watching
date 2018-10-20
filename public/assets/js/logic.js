$(document).ready(() => {
// ====================== FUNCTIONS ======================

	// Grabs the movie entered in the search form
	let movieSearch = event => {
		event.preventDefault();
		
		let userInput = $(`#movie-input`).val().trim();

		// If a blank form was entered, then mark input form "red"
		if (!userInput) {
			$(`#movie-input`).addClass(`form-error`);
		}
		// Otherwise, if a value was entered, then start the search
		else {
			$(`#movie-input`).val(``);
			userInput = userInput.replace(/ /g, `+`); // replace " " with "+"

			searchMovie(userInput);
		}
	};

	// Removes the form-error class (the class displays the field in red)
	let formFocus = () => {
		$(`#movie-input`).removeClass(`form-error`);
	};

	// Send request to OMDB API to obtain movie search results
	let searchMovie = movieName => {
		$.ajax({
			url: `http://www.omdbapi.com/?apikey=4b1d9a31&type=movie&r=json&page=1&s=${movieName}`,
			method: `GET`
		}).then(response => {
			// If we obtain results, then display the movie results
			displaySearchResults(response);
		}).catch(err => {
			// If an error occurred, then alert user
			alert(`Oops! Something went wrong`);
		});
	};

	let createResultDiv = (movieInfo, rowNumber) => {
		let beginningCard = [
			`<div class="movie-result col-md-${rowNumber}">`,
			`<h5>${movieInfo.Title}</h5>`,
		];

		if (movieInfo.Poster === `N/A`) {
			beginningCard.push(`<img src="https://www.movieinsider.com/images/none_175px.jpg"
				alt="No movie poster found">`);
		}
		else {
			beginningCard.push(`<img src=${movieInfo.Poster} alt="No movie poster found">`);
		}

		let restOfCard = [
			`<button class="btn btn-primary add-movie" data-title=${movieInfo.Title} 
			data-year=${movieInfo.Year} data-img=${movieInfo.Poster}>Add</button>`,
			`</div>`
		];

		let fullSearchResult = beginningCard.concat(restOfCard);

		return fullSearchResult.join(``);
	};

	// Displays up to three search results in the modal
	let displaySearchResults = (movieResults, maxResults = 3) => {
		$(`#results-modal .modal-body`).empty();
		
		// If search results are returned, then display 
		// movies' title, poster, and add button
		if (movieResults.Response === `True`) {
			let movies = movieResults.Search;
			let movieCount = maxResults;

			// If search results are less than maxResults number,
			// then set movieCount to number of searchs
			if (movies.length < maxResults) {
				movieCount = movies.length;
			}

			let row = $(`<div>`);
			row.addClass(`row`);

			for (var i = 0; i < movieCount; i++) {

				let movieDiv = createResultDiv(movies[i], 12 / movieCount);
				row.append(movieDiv);
			}

			$(`#results-modal .modal-body`).append(row);
		}
		// If a response was returned, but that response has no search results... 
		else {
			$(`#results-modal .modal-body`).html(`<h4>No results. Try again.</h4>`);
		}

		// Show the modal
		$(`#results-modal`).modal(`toggle`);
	};

	// Save new movie to the list of saved movies in the database
	let addMovie = (event) => {
		
		let movieInfo = {
			title: $(event.target).attr(`data-title`),
			year: $(event.target).attr(`data-year`),
			img: $(event.target).attr(`data-img`)
		};

		$.ajax({
			url: `/api/new`,
			method: `POST`,
			contentType: `application/json`,
			data: JSON.stringify(movieInfo)
		}).then(response => {
			// and then hide modal and grab new list of movies saved
			$(`#results-modal`).modal(`hide`);
			moviesSaved();
		});

	};

	// Retrieve list of saved movies from database
	let moviesSaved = () => {
		$.ajax({
			url: `/api/all`,
			method: `GET`
		}).then(response => {
			// and then display list of saved movies
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

		// let restOfCard = [
		// 	`</div>`,
		// 	`<div class="poster-section">`,
		// 	`<img src=${currentMovie.img}>`,
		// 	`</div>`,
		// 	`<div class="info-section">`,
		// 	`<h3>${currentMovie.title}</h3>`,
		// 	`<p>Comments:</p>`,
		// 	`<textarea type="text" class="form-control edit-comments" 
		// 		style="display: none;" rows="3" data-id=${currentMovie.id}></textarea>`,
		// 	`<p title="edit" class="comments-text">${currentMovie.comments}</p>`,
		// 	`<button class="btn btn-secondary remove-movie" type="button" data-id=${currentMovie.id}>`,
		// 	`<i class="fas fa-trash-alt"></i>`,
		// 	`<span>Remove</span>`,
		// 	`</button>`,
		// 	`</div>`,
		// 	`</div>`,
		// 	`</div>`,
		// 	`</div>`
		// ];



		// ===== TEST =====
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
			`<button class="btn btn-primary save-comments" style="display: none;">Save</button>`,
			`<button class="btn btn-secondary cancel-edits" style="display: none;">Cancel</button>`,
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

		// ===================

		// concatenate the beginningCard array and the restOfCard array
		let fullCard = beginningCard.concat(restOfCard);

		// Join array elements into a string
		return fullCard.join(``);

	};

	// Display list of saved movies
	let displaySavedMovies = movies => {
		$(`#movies-saved-list`).empty();

		// Display list of movies by...
		for (var i = 0; i < movies.length; i++) {
			
			// creating a row for every two movies OR
			// creating a row everytime you hit an even number
			if (i % 2 === 0) {
				let row = $(`<div>`);
				// give each row a number starting with 0
				row.addClass(`row row-${Math.floor(i / 2)}`);

				$(`#movies-saved-list`).append(row);
			}

			// create movie card component for each movie
			let movieCard = createMovieCard(movies[i]);

			// append movie cards to it's row
			$(`.row-${Math.floor(i / 2)}`).append(movieCard);

		}
	};

	// Updates movie's watch/unwatched status along with check mark
	let movieViewStatus = (event) => {
		
		let viewedStatus = $(event.target).attr(`data-viewed`);
		let movieId = $(event.target).attr(`data-id`);

		// Turn viewedStatus value to a boolean and 
		// to the new viewed value it needs to be updated to
		if (viewedStatus === `true`) {
			viewedStatus = false;
		}
		else {
			viewedStatus = true;
		}

		let movieUpdate = {
			viewed: viewedStatus
		};

		$.ajax({
			url: `/api/view/${movieId}`,
			method: `PUT`,
			data: movieUpdate
		}).then(response => {
			// and then update the "data-viewed" attribute to the new viewed value
			$(event.target).attr(`data-viewed`, viewedStatus.toString());	

			// if the movie was watched, then add "watched" class (turn icon green)
			if (viewedStatus) {
				$(event.target).addClass(`watched`);
				$(event.target).attr(`title`, `watch`);
			}
			// otherwise, remove class (turn icon black)
			else {
				$(event.target).removeClass(`watched`);
				$(event.target).attr(`title`, `watched`);
			}
		});
	};

	// Removes movies from list of saved movies
	let removeMovie = event => {
		// using event.currentTarget instead of event.target since we
		// have various elements within the button tag
		// event.currentTag: the current DOM element within the event bubbling phase
		// event.target: the DOM element that initiated the event
		let movieId = $(event.currentTarget).attr(`data-id`);

		$.ajax({
			url: `/api/delete/${movieId}`,
			method: `DELETE`
		}).then(response => {
			// and then update list of saved movies
			moviesSaved();
		});
	};

	// Displays comments' edit form of a movie
	// let editComments = event => {
	// 	// Store the p tag of the comments selected
	// 	let comments = $(event.target);
	// 	// Store the targeted movie's .info-section div
	// 	let movieInfoSection = comments.parent();
	// 	// Target the textarea tag of the .info-section
	// 	let commentsEditing = movieInfoSection.children(`.edit-comments`);

	// 	// Hide the comments...
	// 	comments.hide();

	// 	// And display the textarea focused with the comments
	// 	commentsEditing.val(comments.text());
	// 	commentsEditing.show();
	// 	commentsEditing.focus();

	// };


	// Displays comments' edit form of a movie
	let editComments = event => {
		// Store the p tag of the comments selected
		let comments = $(event.target);
		// Store the targeted movie's .info-section div
		let movieInfoSection = comments.parent();
		// Target the textarea tag, remove movie button, save comments button,
		// and cancel edits button
		let commentsEditing = movieInfoSection.children(`.edit-comments`);
		let removeMovieBtn = movieInfoSection.children(`.remove-movie`);
		let saveCommentsBtn = movieInfoSection.children(`.save-comments`);
		let cancelEditsBtn = movieInfoSection.children(`.cancel-edits`);

		// Hide comments and remove movie button
		comments.hide();
		removeMovieBtn.hide();

		// Display edit comments form along with save and cancel buttons
		commentsEditing.val(comments.text());
		commentsEditing.show();
		commentsEditing.focus();
		saveCommentsBtn.show();
		cancelEditsBtn.show();
	};

	// Save new comments after editing is finished
	// let finishEditingComments = event => {

	// 	// When a user presses "enter" key is released...
	// 	if (event.keyCode === 13) {
	// 		// Store new comments
	// 		let newComments = {
	// 			comments: $(event.target).val().trim()
	// 		};
	// 		let movieId = $(event.target).attr(`data-id`);
			
	// 		$.ajax({
	// 			url: `/api/comments/${movieId}`,
	// 			method: `PUT`,
	// 			contentType: `application/json`,
	// 			data: JSON.stringify(newComments)
	// 		}).then(moviesSaved);
	// 	}
	// };

	// Save new comments after editing is finished
	let finishEditingComments = event => {
		let movieInfoSection = $(event.target).parent();

		// Store new comments in the db
		let newComments = {
			comments: movieInfoSection.children(`.edit-comments`).val().trim()
		};
		let movieId = movieInfoSection.children(`.edit-comments`).attr(`data-id`);
		
		$.ajax({
			url: `/api/comments/${movieId}`,
			method: `PUT`,
			contentType: `application/json`,
			data: JSON.stringify(newComments)
		}).then(moviesSaved);

	};




// ====================== MAIN PROCESSES ======================

	// On initial load, grab list of saved movies
	moviesSaved();

	// When the search form is submitted...
	$(`#search-form .btn`).on(`click`, movieSearch);

	// When the input field in the search form is focused...
	$(`#movie-input`).focus(formFocus);

	// When an add button is clicked in the search results modal...
	$(`#search-results`).on(`click`, `.add-movie`, addMovie);

	// When a check mark icon on the list of saved movies is clicked...
	$(`#movies-saved-list`).on(`click`, `.viewed-icon`, movieViewStatus);

	// When a remove button on the list of saved movies is clicked...
	$(`#movies-saved-list`).on(`click`, `.remove-movie`, removeMovie);

	// When a comments section on the list of saved movies is clicked...
	// $(`#movies-saved-list`).on(`click`, `.comments-text`, editComments);
	$(`#movies-saved-list`).on(`click`, `.comments-text`, editCommentsTest);

	// When a key is pressed and released in the comments' edit form...
	// $(`#movies-saved-list`).on(`keyup`, `.edit-comments`, finishEditingComments);
	$(`#movies-saved-list`).on(`click`, `.save-comments`, finishEditingCommentsTest);

	// When the comments' edit form is unfocused...
	// $(`#movies-saved-list`).on(`blur`, `.edit-comments`, moviesSaved);
	$(`#movies-saved-list`).on(`click`, `.cancel-edits`, moviesSaved);

});