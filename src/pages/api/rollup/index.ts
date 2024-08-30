import type { NextApiRequest, NextApiResponse } from 'next';
import { unescape } from 'querystring';
import { rollup, RollupBuild, InputOption, AddonFunction } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import nodePolyfills from 'rollup-plugin-polyfill-node';
//import typescript from '@rollup/plugin-typescript';

//import { Button } from '../../../components/ui/button';

type Data = {
  code?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }
  if (req.method === 'POST') {
    try {
      const { code } = req.body;
      const userCode = unescape(code);
      const inputFileName = 'InputComponent.js';
      const modules: InputOption = {
        [inputFileName]: userCode,
      };
      const bundle: RollupBuild = await rollup({
        input: [inputFileName],
        external: ['react', 'react-dom'],
        plugins: [
          babel({
            babelHelpers: 'bundled',
            presets: ['@babel/preset-react'],
          }),
          commonjs(),

          nodeResolve({
            browser: true,
            preferBuiltins: false,
          }),
          nodePolyfills(),

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

      const { output } = await bundle.generate({
        format: 'iife', name: 'Component',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        }
      });
      const result = output[0].code;
      res.status(200).json({ code: result });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
