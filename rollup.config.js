const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const pkg = require('./package');

const now = new Date();

module.exports = {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/sensorPicker.js',
            format: 'umd',
        },
        {
            file: 'dist/sensorPicker.common.js',
            format: 'cjs',
        },
        {
            file: 'dist/sensorPicker.esm.js',
            format: 'es',
        },
        {
            file: 'docs/js/sensorPicker.js',
            format: 'umd',
        },
    ],
    name: 'sensorPicker',
    external: ['jquery'],
    globals: {
        jquery: 'jQuery',
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
        }),
    ],
    banner: `/*!
 * sensorPicker v${pkg.version}
 * https://github.com/${pkg.repository}
 *
 * Copyright (c) 2014-${now.getFullYear()} ${pkg.author.name}
 * Released under the ${pkg.license} license
 *
 * Date: ${now.toISOString()}
 */
`,
};
