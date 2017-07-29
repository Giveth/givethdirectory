/* This is an autogenerated file. DO NOT EDIT MANUALLY */

exports.GivethDirectoryAbi = [{"constant":true,"inputs":[],"name":"numberOfCampaigns","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"url","type":"string"},{"name":"token","type":"address"},{"name":"vault","type":"address"},{"name":"milestoneTracker","type":"address"},{"name":"extra","type":"string"}],"name":"addCampaign","outputs":[{"name":"idCampaign","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"idCampaign","type":"uint256"}],"name":"getCampaign","outputs":[{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"url","type":"string"},{"name":"token","type":"address"},{"name":"vault","type":"address"},{"name":"milestoneTracker","type":"address"},{"name":"extra","type":"string"},{"name":"status","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"idCampaign","type":"uint256"},{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"url","type":"string"},{"name":"token","type":"address"},{"name":"vault","type":"address"},{"name":"milestoneTracker","type":"address"},{"name":"extra","type":"string"}],"name":"updateCampaign","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"idCampaign","type":"uint256"},{"name":"newStatus","type":"uint8"}],"name":"changeStatus","outputs":[],"payable":false,"type":"function"}];
exports.GivethDirectoryByteCode = "0x60606040525b60008054600160a060020a03191633600160a060020a03161790555b5b610d7e806100316000396000f300606060405236156100805763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166307ca140d81146100855780631c140bdd146100aa5780635598f8cc146101f25780638da5cb5b146103f6578063a6f9dae114610425578063bb5530c414610446578063c5a8a2ab14610583575b600080fd5b341561009057600080fd5b6100986105a1565b60405190815260200160405180910390f35b34156100b557600080fd5b61009860046024813581810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405281815292919060208401838380828437509496600160a060020a038735811697602080820135831698506040808301359093169750929550608081019450606001358501808301935035918291601f83018290048202909101905190810160405281815292919060208401838380828437509496506105a895505050505050565b60405190815260200160405180910390f35b34156101fd57600080fd5b6102086004356106af565b604051600160a060020a0380871660608301528581166080830152841660a082015280602081016040820160c0830160e0840186600381111561024757fe5b60ff16815260200185810385528d818151815260200191508051906020019080838360005b838110156102855780820151818401525b60200161026c565b50505050905090810190601f1680156102b25780820380516001836020036101000a031916815260200191505b5085810384528c818151815260200191508051906020019080838360005b838110156102e95780820151818401525b6020016102d0565b50505050905090810190601f1680156103165780820380516001836020036101000a031916815260200191505b5085810383528b818151815260200191508051906020019080838360005b8381101561034d5780820151818401525b602001610334565b50505050905090810190601f16801561037a5780820380516001836020036101000a031916815260200191505b50858103825287818151815260200191508051906020019080838360005b838110156103b15780820151818401525b602001610398565b50505050905090810190601f1680156103de5780820380516001836020036101000a031916815260200191505b509c5050505050505050505050505060405180910390f35b341561040157600080fd5b6104096109c7565b604051600160a060020a03909116815260200160405180910390f35b341561043057600080fd5b610444600160a060020a03600435166109d6565b005b341561045157600080fd5b610444600480359060446024803590810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405281815292919060208401838380828437509496600160a060020a038735811697602080820135831698506040808301359093169750929550608081019450606001358501808301935035918291601f8301829004820290910190519081016040528181529291906020840183838082843750949650610a1e95505050505050565b005b341561058e57600080fd5b61044460043560ff60243516610b1c565b005b6001545b90565b60008054819033600160a060020a039081169116146105c657600080fd5b60018054906105d790828101610b8f565b91506001828154811015156105e857fe5b906000526020600020906008020160005b5090508089805161060e929160200190610bc1565b5060018101888051610624929160200190610bc1565b506002810187805161063a929160200190610bc1565b50600381018054600160a060020a0380891673ffffffffffffffffffffffffffffffffffffffff199283161790925560048301805488841690831617905560058301805492871692909116919091179055600681018380516106a0929160200190610bc1565b505b5b50979650505050505050565b6106b7610c40565b6106bf610c40565b6106c7610c40565b60008060006106d4610c40565b60015460009081908a106106e757600080fd5b600180548b9081106106f557fe5b906000526020600020906008020160005b509050806000018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107a15780601f10610776576101008083540402835291602001916107a1565b820191906000526020600020905b81548152906001019060200180831161078457829003601f168201915b50505050509850806001018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108405780601f1061081557610100808354040283529160200191610840565b820191906000526020600020905b81548152906001019060200180831161082357829003601f168201915b50505050509750806002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108df5780601f106108b4576101008083540402835291602001916108df565b820191906000526020600020905b8154815290600101906020018083116108c257829003601f168201915b505050600384015460048501546005860154600687018054969d50600160a060020a039384169c509183169a50909116975092600260001960018316156101000201909116049150506020601f820181900481020160405190810160405280929190818152602001828054600181600116156101000203166002900480156109a85780601f1061097d576101008083540402835291602001916109a8565b820191906000526020600020905b81548152906001019060200180831161098b57829003601f168201915b5050505060078301549194505060ff1691505b50919395975091939597565b600054600160a060020a031681565b60005433600160a060020a039081169116146109f157600080fd5b6000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0383161790555b5b50565b6000805433600160a060020a03908116911614610a3a57600080fd5b6001548910610a4857600080fd5b600180548a908110610a5657fe5b906000526020600020906008020160005b50905080888051610a7c929160200190610bc1565b5060018101878051610a92929160200190610bc1565b5060028101868051610aa8929160200190610bc1565b50600381018054600160a060020a0380881673ffffffffffffffffffffffffffffffffffffffff19928316179092556004830180548784169083161790556005830180549286169290911691909117905560068101828051610b0e929160200190610bc1565b505b5b505050505050505050565b6000805433600160a060020a03908116911614610b3857600080fd5b6001548310610b4657600080fd5b6001805484908110610b5457fe5b906000526020600020906008020160005b50600781018054919250839160ff19166001836003811115610b8357fe5b02179055505b5b505050565b815481835581811511610b8957600802816008028360005260206000209182019101610b899190610c52565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610c0257805160ff1916838001178555610c2f565b82800160010185558215610c2f579182015b82811115610c2f578251825591602001919060010190610c14565b5b50610c3c929150610ce9565b5090565b60206040519081016040526000815290565b6105a591905b80821115610c3c576000610c6c8282610d0a565b610c7a600183016000610d0a565b610c88600283016000610d0a565b60038201805473ffffffffffffffffffffffffffffffffffffffff19908116909155600483018054821690556005830180549091169055610ccd600683016000610d0a565b5060078101805460ff19169055600801610c58565b5090565b90565b6105a591905b80821115610c3c5760008155600101610cef565b5090565b90565b50805460018160011615610100020316600290046000825580601f10610d305750610a1a565b601f016020900490600052602060002090810190610a1a9190610ce9565b5b505600a165627a7a723058208f68c2d9efb186bd5aa4fe2326f463174ba66e6df581beb9e44194946bd3155e0029";
exports.OwnedAbi = [{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}];
exports.OwnedByteCode = "0x6060604052341561000f57600080fd5b5b60008054600160a060020a03191633600160a060020a03161790555b5b61015c8061003c6000396000f300606060405263ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416638da5cb5b8114610048578063a6f9dae114610084575b600080fd5b341561005357600080fd5b61005b6100b2565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f35b341561008f57600080fd5b6100b073ffffffffffffffffffffffffffffffffffffffff600435166100ce565b005b60005473ffffffffffffffffffffffffffffffffffffffff1681565b6000543373ffffffffffffffffffffffffffffffffffffffff9081169116146100f657600080fd5b6000805473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff83161790555b5b505600a165627a7a72305820d5594f94d33977d281c6e7515cf5180f799be1ce9f120079b4687bc66a5d34d30029";
