// webpack build configuration(debug)

module.exports = {
	entry: "./src/Main.tsx",
	output: { filename: "./dist/bundle.js" },
	devtool: "source-map",
	resolve: { extensions: [".ts", ".tsx", ".js"] },
	module: {
		rules: [
			{ test: /\.tsx?$/, use: [{ loader: "ts-loader" }] }
		]
	},
	target: "atom"
};
