const path = require("path");

module.exports = [
    {
        name: "dev",
        entry: {
            embed: path.resolve(__dirname, "embed.js"),
            count: path.resolve(__dirname, "count.js"),
        },
        mode: "development",
        devtool: "source-map",
        target: ["web", "es5"],
        resolve: {
            modules: [
                path.resolve(__dirname),
                "node_modules",
            ],
        },
        module: {
            rules: [
                {
                    test: /\.svg/,
                    type: "asset/source",
                },
            ],
        },
        output: {
            filename: "[name].dev.js",
            path: path.resolve(__dirname),
        },
    },
    {
        name: "prod",
        dependencies: ["dev"],
        mode: "production",
        optimization: {
            usedExports: true,
        },
        devtool: false,
        output: {
            filename: "[name].min.js",
            path: path.resolve(__dirname),
        },
    },
];
module.exports.parallelism = 4;
