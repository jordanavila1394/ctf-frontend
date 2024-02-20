const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
    plugins: [new webpack()],
    node: {
        global: true,
    },
};
