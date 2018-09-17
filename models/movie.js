// ====================== MOVIE MODEL ======================

	module.exports = (sequelize, DataTypes) => {
		let Movie = sequelize.define("Movie", {
			title: {
				type: DataTypes.STRING,
				allowNull: false
			},
			year: {
				type: DataTypes.STRING,
				allowNull: false
			},
			img: {
				type: DataTypes.STRING,
				allowNull: false
			},
			viewed: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			comments: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "None"
			}
		});

		return Movie;
	};