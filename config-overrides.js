const { override, overrideDevServer, addWebpackPlugin } = require("customize-cra");
const CopyPlugin = require("copy-webpack-plugin");

const multipleEntry = require("react-app-rewire-multiple-entry")([
    {
        entry: "src/popup/index.js",
        template: "public/popup.html",
        outPath: "/popup.html",
    },
    {
        entry: "src/background/index.js",
        template: "public/background.html",
        outPath: "/background.html",
    },
]);
const devServerConfig = () => (config) => {
    return {
        ...config,
        writeToDisk: true,
    };
};

const copyPlugin = new CopyPlugin([
    {
        patterns: [{ from: "public/manifest.json", to: "" }],
    },
]);
module.exports = {
    webpack: function (config, env) {
        // ...add your webpack config,
        multipleEntry.addMultiEntry(config);
        config.output.filename = "static/js/[name].js";
        delete config.output.chunkFilename;
        delete config.optimization.splitChunks;
        delete config.optimization.runtimeChunk;

        config.entry = {
            ...config.entry,
            content: __dirname + "/src/content/index.js",
        };
        // override(
        //    addWebpackPlugin(
        //       copyPlugin
        //    ),
        //    multipleEntry.addMultiEntry,
        // )(config)
        addWebpackPlugin(copyPlugin)(config);
        return config;
    },
    devServer: overrideDevServer(devServerConfig()),
};
