import convert from 'convert-source-map';
import { createInstrumenter } from 'istanbul-lib-instrument';
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

const schema = {
  type: 'object',
  properties: {
    debug: {
      type: 'boolean'
    },
    compact: {
      type: 'boolean'
    },
    autoWrap: {
      type: 'boolean'
    },
    esModules: {
      type: 'boolean'
    },
    coverageVariable: {
      type: 'string'
    },
    preserveComments: {
      type: 'boolean'
    },
    produceSourceMap: {
      type: 'boolean'
    }
  },
  additionalProperties: true
};

export default function (source, sourceMap) {

  const defaults = {
    produceSourceMap: true
  };

  const options = Object.assign(
    defaults,
    getOptions(this)
  );

  validateOptions(schema, options, 'Istanbul Instrumenter Loader');

  let srcMap = sourceMap;
  // use inline source map, if any
  if (!srcMap) {
    const inlineSourceMap = convert.fromSource(source);
    if (inlineSourceMap) {
      srcMap = inlineSourceMap.sourcemap;
    }
  }

  const instrumenter = createInstrumenter(options);

  instrumenter.instrument(
    source,
    this.resourcePath,
    (error, instrumentedSource) => {
      this.callback(error, instrumentedSource, instrumenter.lastSourceMap());
    },
    srcMap
  );

}
