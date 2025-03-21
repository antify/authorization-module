import {defineBuildConfig} from 'unbuild';

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/module',
    'src/package',
    {
      input: 'src/cli',
      builder: 'mkdist',
      outDir: 'dist/cli',
    }
  ],
  externals: [
    // TODO:: doublecheck with code
    '@antify/database',
    '@antify/ui-module',
    '@antify/validate',
    '@fortawesome/free-solid-svg-icons',
    'crypto',
    'date-fns',
    'h3',
    'jose',
    'mongoose',
    'ofetch',
    'pathe',
    'pinia',
    '#vue-router'
  ],
  failOnWarn: false,
});
