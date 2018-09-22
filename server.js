// ====================== GLOBAL VARIABLES ======================

	// Import modules
	let express = require("express");
	let bodyParser = require("body-parser");
	let db = require("./models/index.js");

	let app = express();
	let PORT = process.env.PORT || 3000;

	// Middleware
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.text());
	app.use(bodyParser.json({ type: "application/vnd.api+json" }));
	app.use(express.static("public"));

// ====================== MAIN PROCESSES ======================

	// Import api-routes
	require("./routing/api-routes.js")(app);

	// Connect to the db and then start the server
	db.sequelize.sync().then(() => {
		app.listen(PORT, () => {
			console.log("listening on PORT:", PORT);
		});
	});