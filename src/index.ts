import convert from 'convert-source-map';
import { createInstrumenter } from 'istanbul-lib-instrument';
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

/* tslint:disable-next-line:no-var-requires */
const schema = require('./schema.json');

/**
 * Source code inspired by `istanbul-instrumenter-loader`.
 * @see https://github.com/webpack-contrib/istanbul-instrumenter-loader
 */
export default function (source: string, sourceMap: any) {

  const defaults = {
    produceSourceMap: true
  };

  const options = Object.assign(defaults, getOptions(this));

  validateOptions(schema, options, {
    name: 'Istanbul Instrumenter Loader'
  });

  let srcMap = sourceMap;
  // Use inline source map, if none provided.
  if (!srcMap) {
    const inlineSourceMap = convert.fromSource(source);
    /* istanbul ignore else */
    if (inlineSourceMap) {
      srcMap = inlineSourceMap.sourcemap;
    }
  }

  const instrumenter = createInstrumenter(options);
  instrumenter.instrument(source, this.resourcePath, (error, instrumentedSource) => {
    this.callback(error, instrumentedSource, instrumenter.lastSourceMap());
  }, srcMap);

}
