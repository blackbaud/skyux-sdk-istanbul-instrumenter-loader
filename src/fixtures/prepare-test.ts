import rewiremock from 'rewiremock';

let isActive = false;

export function prepareTest(): void {
  if (isActive) {
    return;
  }

  rewiremock('convert-source-map').with({
    fromSource() {}
  }).dynamic();

  rewiremock('istanbul-lib-instrument').with({
    createInstrumenter() {}
  }).dynamic();

  rewiremock('loader-utils').with({
    getOptions() {}
  }).dynamic();

  rewiremock('schema-utils').with(
    () => {}
  ).dynamic();

  rewiremock.enable();

  isActive = true;
}

export function cleanupTests(): void {
  rewiremock.disable();
  isActive = false;
}

export function resetMock(name: string, value: any): void {
  rewiremock.getMock(name).with(value);
}
