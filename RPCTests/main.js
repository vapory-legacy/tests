//requires npm
//requires installed node v6
//requires vapory vap path on input

var async = require("async");
var utils = require('./modules/utils.js');
var testutils = require('./modules/testutils.js');
var vapconsole = require('./modules/vapconsole.js');

var vappath = process.argv[2];
var testdir = __dirname + "/dynamic";
var workdir = __dirname;

var dynamic = {};

function cb(){}
function main()
{
if (!vappath || !utils.fileExists(vappath))
{
	utils.cLog("Executable '" + vappath + "' not found!");
	utils.cLog("Please, set vap path. Usage: node main.js <vappath>");
	return;
}

testutils.readTestsInFolder(workdir + "/scripts/tests");
async.series([
function(cb) {
	utils.setDebug(false);
	vapconsole.startNode(vappath, testdir + "/vapnode1", testdir + "/genesis.json", 30305, cb);
},
function(cb) {
	prepareDynamicVars(cb);
},
function(cb) {
	vapconsole.stopNode(testdir + "/vapnode1", cb);
},
function(cb) {
	vapconsole.startNode(vappath, testdir + "/vapnode1", testdir + "/genesis.json", 30305, cb);
	dynamic["node1_port"] = "30305";
},
function(cb) {
	vapconsole.startNode(vappath, testdir + "/vapnode2", testdir + "/genesis.json", 30306, cb);
	dynamic["node2_port"] = "30306";
},
function(cb) {
	runAllTests(cb);	
},
function(cb) {
	vapconsole.stopNode(testdir + "/vapnode1", cb);
	vapconsole.stopNode(testdir + "/vapnode2", cb);
}
], function() { 
	utils.rmdir(testdir); }
)
}//main



function prepareDynamicVars(finished)
{
  async.series([
	function(cb) {		
		vapconsole.runScriptOnNode(testdir + "/vapnode1", workdir + "/scripts/testNewAccount.js", {}, cb);
	},
	function(cb) {
		dynamic["account"] = vapconsole.getLastResponse();
		utils.mkdir(testdir);
		testutils.generateCustomGenesis(testdir + '/genesis.json', workdir + "/scripts/genesis.json", dynamic["account"], cb);
	},
	function(cb) {
		vapconsole.runScriptOnNode(testdir + "/vapnode1", workdir + "/scripts/getNodeInfo.js", {}, cb);
	},
	function(cb) {
		dynamic["node1_ID"] = vapconsole.getLastResponse().id;
		cb();
	}
  ], function() { finished(); })
}

function runAllTests(finished)
{
	var currentTest = -1;
	var updateDynamic = function(){};

	function nextTest()
	{
	   currentTest++;
	   if (currentTest == testutils.getTestCount())
		finished();
	   else
	   {
		var testObject = testutils.getTestNumber(currentTest);
		var nodepath;
		if (testObject.node == '01')
			nodepath = testdir + "/vapnode1";
		if (testObject.node == '02')
			nodepath = testdir + "/vapnode2";

		vapconsole.runScriptOnNode(nodepath, testObject.file, dynamic, updateDynamic);
	   }
	}

	updateDynamic = function updateDynamic()
	{
		async.series([
			function(cb) {
				vapconsole.runScriptOnNode(testdir + "/vapnode1", workdir + "/scripts/getLastBlock.js", {}, cb);
			},
			function(cb) {
				dynamic["node1_lastblock"] = vapconsole.getLastResponse();
				cb();
			},
			function(cb) {
				vapconsole.runScriptOnNode(testdir + "/vapnode2", workdir +  "/scripts/getLastBlock.js", {}, cb);
			},
			function(cb) {
				dynamic["node2_lastblock"] = vapconsole.getLastResponse();
				cb();
			}
	    	], function() { nextTest(); });
	}
	nextTest();
}

main();

