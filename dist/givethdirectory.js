"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _milestonetracker = require("milestonetracker");

var _milestonetracker2 = _interopRequireDefault(_milestonetracker);

var _vaultcontract = require("vaultcontract");

var _vaultcontract2 = _interopRequireDefault(_vaultcontract);

var _minimetoken = require("minimetoken");

var _minimetoken2 = _interopRequireDefault(_minimetoken);

var _runethtx = require("runethtx");

var _GivethDirectorySol = require("../contracts/GivethDirectory.sol.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GivethDirectory = function () {
    function GivethDirectory(web3, address) {
        _classCallCheck(this, GivethDirectory);

        this.web3 = web3;
        this.contract = this.web3.eth.contract(_GivethDirectorySol.GivethDirectoryAbi).at(address);
    }

    _createClass(GivethDirectory, [{
        key: "getState",
        value: function getState(cb) {
            var _this = this;

            var st = {};
            var nCampaigns = void 0;
            _async2.default.series([function (cb1) {
                _this.contract.owner(function (err, _owner) {
                    if (err) {
                        cb1(err);return;
                    }
                    st.owner = _owner;
                    cb1();
                });
            }, function (cb1) {
                _this.contract.numberOfCampaigns(function (err, res) {
                    if (err) {
                        cb1(err);return;
                    }
                    nCampaigns = res.toNumber();
                    st.campaigns = [];
                    cb1();
                });
            }, function (cb1) {
                _async2.default.eachSeries(_lodash2.default.range(0, nCampaigns), function (idCampaign, cb2) {
                    _this.contract.getCampaign(idCampaign, function (err, res) {
                        if (err) {
                            cb2(err);return;
                        }
                        var campaigStatus = ["Preparing", "Active", "Obsoleted", "Deleted"];
                        var c = {
                            name: res[0],
                            description: res[1],
                            url: res[2],
                            tokenAddress: res[3],
                            vaultAddress: res[4],
                            milestoneTrackerAddress: res[5],
                            extra: res[6],
                            status: campaigStatus[res[7].toNumber()]
                        };
                        st.campaigns.push(c);
                        _async2.default.series([function (cb3) {
                            var mt = new _milestonetracker2.default(_this.web3, c.milestoneTrackerAddress);
                            mt.getState(function (err2, mtState) {
                                if (err2) {
                                    cb3(err2);return;
                                }
                                c.milestoneTracker = mtState;
                                cb3();
                            });
                        }, function (cb3) {
                            var vt = new _vaultcontract2.default(_this.web3, c.vaultAddress);
                            vt.getState(function (err2, vState) {
                                if (err2) {
                                    cb3(err2);return;
                                }
                                c.vault = vState;
                                cb3();
                            });
                        }, function (cb3) {
                            var token = new _minimetoken2.default(_this.web3, c.tokenAddress);
                            token.getState(function (err2, tState) {
                                if (err2) {
                                    cb3(err2);return;
                                }
                                c.token = tState;
                                cb3();
                            });
                        }], cb2);
                    });
                }, cb1);
            }], function (err) {
                if (err) {
                    cb(err);return;
                }
                cb(null, st);
            });
        }
    }], [{
        key: "deploy",
        value: function deploy(web3, opts, cb) {
            var params = Object.assign({}, opts);
            var promise = new Promise(function (resolve, reject) {
                params.abi = _GivethDirectorySol.GivethDirectoryAbi;
                params.byteCode = _GivethDirectorySol.GivethDirectoryByteCode;
                return (0, _runethtx.deploy)(web3, params, function (err, _givethDirectory) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    var givethDirectory = new GivethDirectory(web3, _givethDirectory.address);
                    resolve(givethDirectory);
                });
            });

            if (cb) {
                promise.then(function (value) {
                    cb(null, value);
                }, function (reason) {
                    cb(reason);
                });
            } else {
                return promise;
            }
        }
    }]);

    return GivethDirectory;
}();

exports.default = GivethDirectory;
module.exports = exports["default"];
