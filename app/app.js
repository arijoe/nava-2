const Controller = require('./controller');
const FileMapper = require('./fileMapper');
const MockDao = require('./mockDao'); //used for testing
const NavaDao = require('./navaDao');
const FileReader = require('./fileReader');

const dao = new NavaDao(); // change this line to toggle between test and live
const fileReader = new FileReader();
const controller = new Controller(dao);

new FileMapper().getFileMap()
	.then( fileMap => {
		return fileReader.formatDataFromFiles(fileMap);
	})
	.then( files => {
		return fileReader.cullDataFromFiles(files);
	})
	.then( data => {
		return controller.insertData(data);
	})
	.then( message => {
		console.log(message);
	})
	.catch( err => {
		console.error(err);
	})
	.finally( () => {
		console.log('Finished execution.');
	})
