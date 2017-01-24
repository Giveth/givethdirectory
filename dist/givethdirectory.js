"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GivethDirectory = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.deploy = deploy;

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _GivethDirectorySol = require("../contracts/GivethDirectory.sol.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GivethDirectory = exports.GivethDirectory = function () {
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
                        cb(err);return;
                    }
                    st.owner = _owner;
                    cb1();
                });
            }, function (cb1) {
                _this.contract.numberOfCampaigns(function (err, res) {
                    if (err) {
                        cb(err);return;
                    }
                    nCampaigns = res.toNumber();
                    st.campaigns = [];
                    cb1();
                });
            }, function (cb1) {
                _async2.default.eachSeries(_lodash2.default.range(0, nCampaigns), function (idCampaign, cb2) {
                    _this.contract.getCampaign(idCampaign, function (err, res) {
                        if (err) {
                            cb(err);return;
                        }
                        var campaigStatus = ["Preparing", "Active", "Obsoleted", "Deleted"];
                        st.campaigns.push({
                            name: res[0],
                            description: res[1],
                            url: res[2],
                            token: res[3],
                            vault: res[4],
                            milestoneTracker: res[5],
                            extra: res[6],
                            status: campaigStatus[res[7].toNumber()]
                        });
                        cb2();
                    });
                }, cb1);
            }], function (err) {
                if (err) {
                    cb(err);return;
                }
                cb(null, st);
            });
        }
    }]);

    return GivethDirectory;
}();

function deploy(web3, opts, cb) {
    var account = void 0;
    var givethDirectory = void 0;
    _async2.default.series([function (cb1) {
        if (opts.from) {
            account = opts.from;
            cb1();
        } else {
            web3.eth.getAccounts(function (err, _accounts) {
                if (err) {
                    cb(err);return;
                }
                if (_accounts.length === 0) return cb1(new Error("No account to deploy a contract"));
                account = _accounts[0];
                cb1();
            });
        }
    }, function (cb2) {
        var contract = web3.eth.contract(_GivethDirectorySol.GivethDirectoryAbi);
        contract.new({
            from: account,
            data: _GivethDirectorySol.GivethDirectoryByteCode,
            gas: 3000000,
            value: opts.value || 0
        }, function (err, _contract) {
            if (err) {
                cb2(err);return;
            }
            if (typeof _contract.address !== "undefined") {
                givethDirectory = new GivethDirectory(web3, _contract.address);
                cb2();
            }
        });
    }], function (err) {
        if (err) return cb(err);
        cb(null, givethDirectory);
    });
}
