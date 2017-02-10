import async from "async";
import _ from "lodash";
import MilestoneTracker from "milestonetracker";
import Vault from "vaultcontract";
import MiniMeToken from "minimetoken";
import { deploy } from "runethtx";
import { GivethDirectoryAbi, GivethDirectoryByteCode } from "../contracts/GivethDirectory.sol.js";

export default class GivethDirectory {

    constructor(web3, address) {
        this.web3 = web3;
        this.contract = this.web3.eth.contract(GivethDirectoryAbi).at(address);
    }

    getState(cb) {
        const st = {};
        let nCampaigns;
        async.series([
            (cb1) => {
                this.contract.owner((err, _owner) => {
                    if (err) { cb1(err); return; }
                    st.owner = _owner;
                    cb1();
                });
            },
            (cb1) => {
                this.contract.numberOfCampaigns((err, res) => {
                    if (err) { cb1(err); return; }
                    nCampaigns = res.toNumber();
                    st.campaigns = [];
                    cb1();
                });
            },
            (cb1) => {
                async.eachSeries(_.range(0, nCampaigns), (idCampaign, cb2) => {
                    this.contract.getCampaign(idCampaign, (err, res) => {
                        if (err) { cb2(err); return; }
                        const campaigStatus = [
                            "Preparing",
                            "Active",
                            "Obsoleted",
                            "Deleted",
                        ];
                        const c = {
                            name: res[ 0 ],
                            description: res[ 1 ],
                            url: res[ 2 ],
                            tokenAddress: res[ 3 ],
                            vaultAddress: res[ 4 ],
                            milestoneTrackerAddress: res[ 5 ],
                            extra: res[ 6 ],
                            status: campaigStatus[ res[ 7 ].toNumber() ],
                        };
                        st.campaigns.push(c);
                        async.series([
                            (cb3) => {
                                const mt =
                                    new MilestoneTracker(this.web3, c.milestoneTrackerAddress);
                                mt.getState((err2, mtState) => {
                                    if (err2) { cb3(err2); return; }
                                    c.milestoneTracker = mtState;
                                    cb3();
                                });
                            },
                            (cb3) => {
                                const vt =
                                    new Vault(this.web3, c.vaultAddress);
                                vt.getState((err2, vState) => {
                                    if (err2) { cb3(err2); return; }
                                    c.vault = vState;
                                    cb3();
                                });
                            },
                            (cb3) => {
                                const token =
                                    new MiniMeToken(this.web3, c.tokenAddress);
                                token.getState((err2, tState) => {
                                    if (err2) { cb3(err2); return; }
                                    c.token = tState;
                                    cb3();
                                });
                            },
                        ], cb2);
                    });
                }, cb1);
            },
        ], (err) => {
            if (err) { cb(err); return; }
            cb(null, st);
        });
    }

    static deploy(web3, opts, cb) {
        const params = Object.assign({}, opts);
        const promise = new Promise((resolve, reject) => {
            params.abi = GivethDirectoryAbi;
            params.byteCode = GivethDirectoryByteCode;
            return deploy(web3, params, (err, _givethDirectory) => {
                if (err) {
                    reject(err);
                    return;
                }
                const givethDirectory = new GivethDirectory(web3, _givethDirectory.address);
                resolve(givethDirectory);
            });
        });

        if (cb) {
            promise.then(
                (value) => {
                    cb(null, value);
                },
                (reason) => {
                    cb(reason);
                });
        } else {
            return promise;
        }
    }
}
