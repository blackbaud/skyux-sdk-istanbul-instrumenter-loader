const remapIstanbul = require('remap-istanbul');
const path = require('path');

const coverageDirectory = path.resolve(process.cwd(), 'coverage');

const collector = remapIstanbul.remap(
  remapIstanbul.loadCoverage(path.resolve(coverageDirectory, 'coverage-final.json'))
);

remapIstanbul.writeReport(collector, 'text-summary');
remapIstanbul.writeReport(collector, 'html', {}, coverageDirectory);
remapIstanbul.writeReport(collector, 'json', { dir: coverageDirectory });
