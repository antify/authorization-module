import {
  defineBuildConfig,
} from 'unbuild';

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/module',
    'src/package',
  ],
  externals: [
    'mongoose',
    'pathe',
  ],
});
