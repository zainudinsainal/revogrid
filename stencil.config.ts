import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';
import { svelteOutputTarget } from '@stencil/svelte-output-target';
import { vueOutputTarget as vue2OutputTarget } from '@revolist/stencil-vue2-output-target';

const componentCorePackage = '@revolist/revogrid';
const parent = '../revogrid-proxy';
const entry = 'revogrid.ts';
const directivesProxyFile = (name: string, filepath = entry) =>
  `${parent}/${name}/src/${filepath}`;

export const config: Config = {
  // https://github.com/ionic-team/stencil/blob/master/src/declarations/stencil-public-compiler.ts
  enableCache: true,
  hashFileNames: true,
  hashedFileNameLength: 8,
  autoprefixCss: false,
  minifyCss: true,
  minifyJs: true,
  preamble: 'Built by Revolist OU',
  invisiblePrehydration: true,
  sourceMap: false,
  extras: {
    // This is to tackle an Angular specific performance issue:
    initializeNextTick: true,
    // Don't need any of these so setting them to "false":
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: false,
    // Required by Vite to bundle a Stencil project (https://github.com/vitejs/vite/issues/12434#issuecomment-1471305880)
    enableImportInjection: true,
  },

  namespace: 'revo-grid',
  taskQueue: 'async',
  globalScript: './src/global/global.ts',
  validatePrimaryPackageOutputTarget: true,
  nodeResolve: {
    preferBuiltins: true,
  },
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/global/_colors.scss',
        'src/global/_icons.scss',
        'src/global/_mixins.scss',
        'src/global/_buttons.scss',
      ],
    }),
  ],
  // proxies
  outputTargets: [
    vueOutputTarget({
      componentCorePackage,
      proxiesFile: directivesProxyFile('vue3'),
      includeDefineCustomElements: true,
      includePolyfills: false,
    }),
    // custom element, no polifil
    {
      type: 'dist-custom-elements',
      dir: 'custom-element',
      customElementsExportBehavior: 'bundle',
      externalRuntime: true,
      empty: true,
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      empty: true,
      isPrimaryPackageOutputTarget: true,
    },
  ],
};
