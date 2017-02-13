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
let vault = [];
let miniMeToken = [];
let milestoneTracker = [];
let givethCampaign = [];

const now = Math.floor(new Date().getTime() / 1000);



const escapeCaller = eth.accounts[ 1 ];
const escapeDestination = eth.accounts[ 2 ];
const securityGuard = eth.accounts[ 3 ];
const arbitrator = eth.accounts[ 4 ];
const donor = eth.accounts[ 5 ];
const recipient = eth.accounts[ 6 ];
const reviewer = eth.accounts[ 7 ];
const milestoneLeadLink = eth.accounts[ 8 ];

function deployCampaign(opts, _cb) {
    const cb = _cb || gcb;
    let idCampaign;
    async.series([
        (cb1) => {
            givethDirectory.contract.numberOfCampaigns((err, res) => {
                idCampaign = res.toNumber();
                cb1();
            });
        },
        (cb1) => {
            GivethCampaign.deploy(
                web3,
                {
                    tokenName: opts.tokenName || "MiniMe Test Token",
                    decimalUnits: 18,
                    tokenSymbol: opts.tokenSymbol || "MMT",
                    escapeCaller,
                    escapeDestination,
                    securityGuard,
                    startFundingTime: now - 86400,
                    endFundingTime: now + (86400 * 365 * 30),
                    maximumFunding: web3.toWei(10000),
                    absoluteMinTimeLock: 0,
                    timeLock: 30,
                    maxSecurityGuardDelay: 86400 * 21,
                },
                (err, _givethCampaign) => {
                    if (err) {
                        cb1(err);
                        return;
                    }
                    givethCampaign[ idCampaign ] = _givethCampaign;
                    console.log("GivethCampaign : " + _givethCampaign.contract.address);
                    cb1();
                });
        },
        (cb1) => {
            givethCampaign[ idCampaign ].getState((err, st) => {
                if (err) {
                    cb1(err);
                    return;
                }
                miniMeToken[ idCampaign ] = new MiniMeToken(web3, st.tokenAddress);
                console.log("MiniMeToken : " + miniMeToken[ idCampaign ].contract.address);
                vault[ idCampaign ] = new Vault(web3, st.vaultAddress);
                console.log("Vault : " + vault[ idCampaign ].contract.address);
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
                    milestoneTracker[ idCampaign ] = _milestoneTracker;
                    console.log("MilestoneTracker : " + milestoneTracker[ idCampaign ].contract.address);
                    cb1();
                });
        },
        (cb1) => {
            vault[ idCampaign ].contract.authorizeSpender(
                milestoneTracker[ idCampaign ].contract.address,
                true,
                {
                    from: eth.accounts[ 0 ],
                },
                cb1);
        },
        (cb1) => {
            givethDirectory.contract.addCampaign(
                "Giveth Test" || opts.campaignName,
                "Development of Giveth. Donations 3.0" || opts.campaignDescription,
                "http://www.giveth.io" || opts.campaignWeb,
                miniMeToken[ idCampaign ].contract.address,
                vault[ idCampaign ].contract.address,
                milestoneTracker[ idCampaign ].contract.address,
                "", { from: eth.accounts[ 0 ], gas: 300000 }, cb1);
        },
        (cb1) => {
            givethDirectory.contract.changeStatus(idCampaign, 1, { from: eth.accounts[ 0 ] }, cb1);
        },
    ], cb);
}

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
            deployCampaign({
                tokenName: "Token 1",
                tokenSymbol: "MM1",
                campaignName: "Campaign 1",
                campaignDescription: "Desciption 1",
                campaignWeb: "http://www.giveth.io",
            }, cb1);
        },
    ], cb);
}

function deployExample2(_cb) {
    const cb = _cb || gcb;
    const milestones = [];
    let hashProposals;
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
            deployCampaign({
                tokenName: "Giveth Development",
                tokenSymbol: "MM1",
                campaignName: "Campaign 1",
                campaignDescription: "Desciption 1",
                campaignWeb: "http://www.giveth.io/?idCampaign=1",
            }, cb1);
        },
        (cb1) => {
            deployCampaign({
                tokenName: "My Ether Wallet",
                tokenSymbol: "MM2",
                campaignName: "Campaign 2",
                campaignDescription: "Desciption 2",
                campaignWeb: "http://www.giveth.io/?idCampaign=2",
            }, cb1);
        },
        (cb1) => {
            deployCampaign({
                tokenName: "Swarm city",
                tokenSymbol: "MM3",
                campaignName: "Campaign 3",
                campaignDescription: "Desciption 3",
                campaignWeb: "http://www.giveth.io/?idCampaign=3",
            }, cb1);
        },
        (cb1) => {
            for (let i = 0; i < 4; i += 1) {
                milestones.push({
                    description: "Proposal " + i,
                    url: "http://www.giveth.io/?idProposal=" + i,
                    minCompletionDate: now - 86400,
                    maxCompletionDate: now + (86400 * 3),
                    reviewer,
                    milestoneLeadLink,
                    reviewTime: 86400 * 2,
                    paymentSource: vault[ 0 ].contract.address,
                    payData: vault[ 0 ].contract.authorizePayment.getData("Proposal " + i, recipient, web3.toWei(i + 1), 0),
                    payDescription: "Proposal " + i,
                    payRecipient: recipient,
                    payValue: new BigNumber(web3.toWei(i + 1)),
                    payDelay: 0,
                });
            }

            console.log("Propose");
            milestoneTracker[ 0 ].proposeMilestones({
                newMilestones: milestones,
                from: recipient,
            }, cb1);
        },
        (cb1) => {
            console.log("Get State");
            milestoneTracker[ 0 ].getState((err, st) => {
                if (err) {
                    cb1(err);
                    return;
                }
                hashProposals = st.proposedMilestonesHash;
                cb1();
            });
        },
        (cb1) => {
            console.log("Accept");
            milestoneTracker[ 0 ].acceptProposedMilestones({
                hashProposals,
                from: donor,
                verbose: true,
            }, cb1);
        },
        (cb1) => {
            console.log("Mark Done 1");
            milestoneTracker[ 0 ].markMilestoneComplete({
                idMilestone: 0,
                from: recipient,
            }, cb1);
        },
        (cb1) => {
            console.log("Mark Done 2");
            milestoneTracker[ 0 ].markMilestoneComplete({
                idMilestone: 1,
                from: recipient,
            }, cb1);
        },
        (cb1) => {
            console.log("Approve");
            milestoneTracker[ 0 ].approveCompletedMilestone({
                idMilestone: 0,
                from: reviewer,
            }, cb1);
        },
    ], cb);
}
