/* eslint-disable */
/* pages/api/rollup.js */
import { unescape } from "querystring";
import { rollup, InputOption } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export const rollupCodeAsync = async (code: string) => {
  try {
    const userCode = unescape(code);
    const inputFileName = 'InputComponent.js';
    const modules: InputOption = {
      [inputFileName]: userCode,
    };

    // Configure Rollup with the replace plugin to handle process.env
    const bundle = await rollup({
      input: inputFileName,
      external: ['react', 'react-dom'],
      plugins: [
        // Add necessary Rollup plugins for handling React and other JS features
        babel({
          babelHelpers: 'bundled',
          presets: ['@babel/preset-react'], // Add more presets and plugins as needed
        }),
        commonjs(),
        nodeResolve(),
        {
          name: 'dynamic-import',
          resolveId(source: string) {
            return modules[source] ? source : null;
          },
          load(id: string) {
            return modules[id] ? modules[id] : null;
          }
        },
      ]
    });

    // Generate bundle
    const { output } = await bundle.generate({ format: 'iife', name: 'Component' });
    const result = output[0].code;

    // Send the bundled code back
    return { code: result };
  } catch (err: any) {
    console.error(err);
    return { code: 'Error bundling code' };
  }
}
