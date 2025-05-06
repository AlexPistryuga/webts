import path from 'path'

import type { AliasOptions } from 'vite'

export const alias: AliasOptions = {
    '@': path.resolve(__dirname, 'src'),
    '@configs': path.resolve(__dirname, 'configs'),
    '@helpers': path.resolve(__dirname, 'src/helpers'),
    '@graphql': path.resolve(__dirname, 'src/graphql'),
    '@packageJson': path.resolve(__dirname, 'package.json'),
    '@tada-server': path.resolve(__dirname, 'generated/tada/server-graphql'),
    '@tada-client': path.resolve(__dirname, 'generated/tada/initTadaClient'),

    util: 'rollup-plugin-node-polyfills/polyfills/util',
    assert: 'rollup-plugin-node-polyfills/polyfills/assert',
    os: 'rollup-plugin-node-polyfills/polyfills/os',
    buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
    process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
    fs: 'rollup-plugin-node-polyfills/polyfills/empty',
    net: 'rollup-plugin-node-polyfills/polyfills/empty',
    path: 'rollup-plugin-node-polyfills/polyfills/empty',
    http: 'rollup-plugin-node-polyfills/polyfills/http',
    crypto: 'rollup-plugin-node-polyfills/polyfills/empty',
    stream: 'rollup-plugin-node-polyfills/polyfills/stream',
    zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
    constants: 'rollup-plugin-node-polyfills/polyfills/constants',
    querystring: 'rollup-plugin-node-polyfills/polyfills/empty',
    dgram: 'rollup-plugin-node-polyfills/polyfills/empty',
    dns: 'rollup-plugin-node-polyfills/polyfills/empty',
    tls: 'rollup-plugin-node-polyfills/polyfills/empty',
    events: 'rollup-plugin-node-polyfills/polyfills/events',
    url: 'rollup-plugin-node-polyfills/polyfills/url',
    'node:http': 'rollup-plugin-node-polyfills/polyfills/empty',
    'node:path': 'rollup-plugin-node-polyfills/polyfills/empty',
    'node:crypto': 'rollup-plugin-node-polyfills/polyfills/empty',
}
