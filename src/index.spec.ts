import {
  cleanupTests,
  prepareTest,
  resetMock
} from './fixtures/prepare-test';

prepareTest();

import loader from './index';

describe('Loader', () => {

  let mockIstanbulLibInstrument: any;
  let mockInstrumenter: any;
  let mockContext: any;

  beforeEach(() => {

    mockContext = {
      callback() {},
      resourcePath: 'foo.ts'
    };

    mockInstrumenter = {
      instrument: (source: string, resourcePath: string, callback: () => {}) => {
        callback();
      },
      lastSourceMap() {}
    };

    mockIstanbulLibInstrument = {
      createInstrumenter() {
        return mockInstrumenter;
      }
    };
  });

  afterAll(() => {
    cleanupTests();
  });

  function applyMocks(): void {
    resetMock('istanbul-lib-instrument', mockIstanbulLibInstrument);
  }

  it('should call istanbul instrumenter', () => {
    const instrumentSpy = spyOn(mockInstrumenter, 'instrument').and.callThrough();
    const callbackSpy = spyOn(mockContext, 'callback').and.callThrough();

    applyMocks();

    loader.apply(mockContext, ['Content here.', {}]);

    expect(instrumentSpy).toHaveBeenCalled();
    expect(callbackSpy).toHaveBeenCalled();
  });

  it('should use inline source map if none provided', () => {
    const instrumentSpy = spyOn(mockInstrumenter, 'instrument').and.callThrough();
    const mockSourceMap = {
      sourcemap: {
        foo: 'bar'
      }
    };

    applyMocks();

    resetMock('convert-source-map', {
      fromSource() {
        return mockSourceMap;
      }
    });

    loader.apply(mockContext, ['Content here.']);

    expect(instrumentSpy).toHaveBeenCalledWith(
      'Content here.',
      'foo.ts',
      jasmine.any(Function),
      mockSourceMap.sourcemap
    );
  });
});
