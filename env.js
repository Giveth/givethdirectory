"use strict";

var Web3 = require('web3');
// create an instance of web3 using the HTTP provider.
// NOTE in mist web3 is already available, so check first if its available before instantiating
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var BigNumber = require('bignumber.js');

var eth = web3.eth;
var async = require('async');

var GivethDirectory = require('./dist/givethdirectory.js');
var Vault = require('vaultcontract');
var MilestoneTracker = require('milestonetracker');

var gcb = function(err, res) {
    if (err) {
        console.log("ERROR: "+err);
    } else {
        console.log(JSON.stringify(res,null,2));
    }
}

var givethDirectory;
var vault;

var escapeCaller = eth.accounts[1];
var escapeDestination = eth.accounts[2];
var securityGuard = eth.accounts[3];
var arbitrator = eth.accounts[4];
var donor = eth.accounts[5];
var recipient = eth.accounts[6];


function deployExample(cb) {
    cb = cb || gcb;
    async.series([
        function(cb) {
            GivethDirectory.deploy(web3, {}, function(err, _givethDirectory) {
                if (err) return err;
                givethDirectory = _givethDirectory;
                console.log("Giveth Directory: " + givethDirectory.contract.address);
                cb();
            });
        },
        function(cb) {
            Vault.deploy(
                web3,
                {
                    escapeCaller: escapeCaller,
                    escapeDestination: escapeDestination,
                    absoluteMinTimeLock: 0,
                    timeLock: 300,
                    securityGuard: securityGuard,
                    maxSecurityGuardDelay: 86400 * 21
                },
                function(err, _vault) {
                    if (err) return err;
                    vault = _vault;
                    console.log("Vault : " + vault.contract.address);
                    cb();
                })
        },
        function(cb) {
            MilestoneTracker.deploy(
                web3,
                {
                    arbitrator: arbitrator,
                    donor: donor,
                    recipient: recipient
                },
                function(err, _milestoneTracker) {
                    if (err) return err;
                    milestoneTracker = _milestoneTracker;
                    console.log("MilestoneTracker : " + milestoneTracker.contract.address);
                    cb();
                });
        },
        function(cb) {
            givethDirectory.contract.addCampaign("Giveth Test",
                "Development of Giveth. Donations 3.0",
                "http://www.giveth.io",
                "0x0",
                vault.contract.address,
                milestoneTracker.contract.address,
                "", {from: eth.accounts[0], gas: 300000}, cb);
        },
        function(cb) {
            givethDirectory.contract.changeStatus(0, 1, {from: eth.accounts[0]},cb)
        }
    ], cb);

}
