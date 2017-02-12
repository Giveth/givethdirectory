const Web3 = require("web3");
// create an instance of web3 using the HTTP provider.
// NOTE in mist web3 is already available, so check first if its available before instantiating
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const BigNumber = require("bignumber.js");

const eth = web3.eth;
const async = require("async");

const GivethDirectory = require("./dist/givethdirectory.js");
const Vault = require("vaultcontract");
const MiniMeToken = require("minimetoken");
const MilestoneTracker = require("milestonetracker");
const GivethCampaign = require("givethcampaign");

const gcb = (err, res) => {
    if (err) {
        console.log("ERROR: " + err);
    } else {
        console.log(JSON.stringify(res, null, 2));
    }
};

let givethDirectory;
let vault;
let miniMeToken;
let milestoneTracker;
let givethCampaign;

const escapeCaller = eth.accounts[ 1 ];
const escapeDestination = eth.accounts[ 2 ];
const securityGuard = eth.accounts[ 3 ];
const arbitrator = eth.accounts[ 4 ];
const donor = eth.accounts[ 5 ];
const recipient = eth.accounts[ 6 ];

const now = Math.floor(new Date().getTime() / 1000);

function deployExample(_cb) {
    const cb = _cb || gcb;
    async.series([
        (cb1) => {
            GivethDirectory.deploy(web3, {}, (err, _givethDirectory) => {
                if (err) {
                    cb1(err);
                    return;
                }
                givethDirectory = _givethDirectory;
                console.log("Giveth Directory: " + givethDirectory.contract.address);
                cb1();
            });
        },
        (cb1) => {
            GivethCampaign.deploy(
                web3,
                {
                    tokenName: "MiniMe Test Token",
                    decimalUnits: 18,
                    tokenSymbol: "MMT",
                    escapeCaller,
                    escapeDestination,
                    securityGuard,
                    startFundingTime: now - 86400,
                    endFundingTime: now + (86400 * 365 * 30),
                    maximumFunding: web3.toWei(10000),
                    absoluteMinTimeLock: 0,
                    timeLock: 300,
                    maxSecurityGuardDelay: 86400 * 21,
                },
                (err, _givethCampaign) => {
                    if (err) {
                        cb1(err);
                        return;
                    }
                    givethCampaign = _givethCampaign;
                    console.log("GivethCampaign : " + givethCampaign.contract.address);
                    cb1();
                });
        },
        (cb1) => {
            givethCampaign.getState((err, st) => {
                if (err) {
                    cb1(err);
                    return;
                }
                miniMeToken = new MiniMeToken(web3, st.tokenAddress);
                console.log("MiniMeToken : " + miniMeToken.contract.address);
                vault = new Vault(web3, st.vaultAddress);
                console.log("Vault : " + vault.contract.address);
                cb1();
            });
        },
        (cb1) => {
            MilestoneTracker.deploy(
                web3,
                {
                    arbitrator,
                    donor,
                    recipient,
                },
                (err, _milestoneTracker) => {
                    if (err) {
                        cb1(err);
                        return;
                    }
                    milestoneTracker = _milestoneTracker;
                    console.log("MilestoneTracker : " + milestoneTracker.contract.address);
                    cb1();
                });
        },
        (cb1) => {
            vault.contract.authorizeSpender(
                milestoneTracker.contract.address,
                true,
                {
                    from: eth.accounts[ 0 ],
                },
                cb1);
        },
        (cb1) => {
            givethDirectory.contract.addCampaign("Giveth Test",
                "Development of Giveth. Donations 3.0",
                "http://www.giveth.io",
                miniMeToken.contract.address,
                vault.contract.address,
                milestoneTracker.contract.address,
                "", { from: eth.accounts[ 0 ], gas: 300000 }, cb1);
        },
        (cb1) => {
            givethDirectory.contract.changeStatus(0, 1, { from: eth.accounts[ 0 ] }, cb1);
        },
    ], cb);
}
