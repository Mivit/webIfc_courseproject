import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

export default {
    input: 'app.js',
    output: [
        {
            format: 'esm',
            file: 'dist/bundle.js'
        },
    ],
    plugins: [
        resolve(),
        copy({
            targets: [
                { src: 'node_modules/web-ifc/web-ifc.wasm', dest: 'dist' },
                { src: 'node_modules/web-ifc/web-ifc-mt.wasm', dest: 'dist' },
            ]
        })
    ]
};