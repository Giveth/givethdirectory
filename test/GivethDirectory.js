'use strict';

const assertJump = require('./helpers/assertJump');
const assertWasNotAdded = require('./helpers/assertWasNotAdded');
var GivethDirectory = artifacts.require('../contracts/GivethDirectory.sol');
const CampaignStatus = {
  'Preparing': 0,
  'Active': 1,
  'Obsolted': 2,
  'Deleted': 3,
  'THROWS_ERROR': 999
};

contract('GivethDirectory', accounts => {
  let givethDirectory;
  const testCampaign = {
    name: 'test-campaign-name',
    description: 'test-campaign-description',
    url: 'test-campaign-url',
    token: accounts[1],
    vault: accounts[2],
    milestoneTracker: accounts[3],
    extra: 'test-campaign-extra'
  };

  const errorAsserter = (fn, errFn) => {
    return async(...args) => {
      try {
        return await fn(args);
      } catch(error) {
        return errFn(error);
      }
      return assert.fail('should have thrown before');
    }
  }

  const campaignAddProxy = (values) => {
      let account = values ? values[0] : 0;
      let args = values ? values.slice(1) : Object.values(testCampaign);

      givethDirectory.addCampaign(
        args[0] || null,
        args[1] || null,
        args[2] || null,
        args[3] || null,
        args[4] || null,
        args[5] || null,
        args[6] || null,
        { from: accounts[account || 0] }
      );
  }

  const updateProxy = (args) => {
    const [idx, name, description, url, token, vault, milestoneTracker, extra, account] = args;
    return givethDirectory.updateCampaign(idx, name, description, url, token, vault, milestoneTracker, extra, { from: account || accounts[0] });
  }

  const statusChangeProxy = (args) => {
    const [idx, status, account] = args;
    return givethDirectory.changeStatus(idx, status, { from: account || accounts[0]});
  }

  beforeEach(async function() {
    givethDirectory = await GivethDirectory.new();
  });

  /**********************************
              CONSTRUCTOR
  *********************************/
  it('should have an owner', async () => {
    let owner = await givethDirectory.owner();
    assert.isTrue(owner !== 0);
  });

  it('is created with no campaigns in the collection', async () => {
    const numCampaigns = await givethDirectory.numberOfCampaigns();
    assert.equal(numCampaigns, 0);
  })

  /**********************************
              addCampaign
  *********************************/
  it('allows new campaigns to be added', async () => {
    await campaignAddProxy();
    const numCampaigns = await givethDirectory.numberOfCampaigns();
    assert.equal(numCampaigns, 1);
  });

  it('prevents campaigns from being added by non-owners', async () => {
    await errorAsserter(campaignAddProxy, assertJump)(9);
  });

  it('errors if fields are missing when adding a Campaign', async () => {
    await errorAsserter(campaignAddProxy, assertWasNotAdded)(0, testCampaign.name, testCampaign.description);
  });

  /**********************************
              getCampaign
  *********************************/
  it('gets a campaign by id', async () => {
    await campaignAddProxy();

    const retrievedCampaign = await givethDirectory.getCampaign(0);
    Object.values(testCampaign).forEach((prop, idx) => {
      assert.equal(retrievedCampaign[idx], prop);
    });
  });

  it('fails to get campaigns at invalid ids', async () => {
    await campaignAddProxy();
    await errorAsserter(givethDirectory.getCampaign, assertJump)(1);
  });

  /**********************************
            numberOfCampaigns
  *********************************/
  it('gets the number of campaigns', async () => {
    await campaignAddProxy();
    const numCampaigns = await givethDirectory.numberOfCampaigns();
    assert.equal(numCampaigns, 1);
  });

  /**********************************
            updateCampaign
  *********************************/
  it('can update the campaign', async () => {
    const campaign = await campaignAddProxy();
    
    await givethDirectory.updateCampaign(
      0, 
      testCampaign.name + '_update',
      testCampaign.description + '_update',
      testCampaign.url + '_update',
      testCampaign.milestoneTracker,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.extra + '_update'
    );

    const retrievedCampaign = await givethDirectory.getCampaign(0);
    assert.equal(retrievedCampaign[0], testCampaign.name + '_update');
    assert.equal(retrievedCampaign[1], testCampaign.description + '_update');
    assert.equal(retrievedCampaign[2], testCampaign.url + '_update');
    assert.equal(retrievedCampaign[3], testCampaign.milestoneTracker);
    assert.equal(retrievedCampaign[4], testCampaign.token);
    assert.equal(retrievedCampaign[5], testCampaign.vault);
    assert.equal(retrievedCampaign[6], testCampaign.extra + '_update');
  });

  it('prevents updating the campaign by non-owners', async () => {
    await campaignAddProxy();
    await errorAsserter(updateProxy, assertJump)(
      0, 
      testCampaign.name + '_update',
      testCampaign.description + '_update',
      testCampaign.url + '_update',
      testCampaign.milestoneTracker,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.extra + '_update',
      accounts[9]
    );
  });

  it('errors when provided an invalid campaign id', async () => {
    await campaignAddProxy();
    await errorAsserter(updateProxy, assertJump)(
      7, 
      testCampaign.name + '_update',
      testCampaign.description + '_update',
      testCampaign.url + '_update',
      testCampaign.milestoneTracker,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.extra + '_update',
      accounts[9]
    );
  });

  it('errors if fields are missing when updating a Campaign', async () => {
    await campaignAddProxy();
    await errorAsserter(updateProxy, assertWasNotAdded)(0, testCampaign.name + '_update',testCampaign.description + '_update');
  });

  /**********************************
            changeStatus
  *********************************/
  it('can change the campaign status', async () => {
    const statusIdx = 7;
    await campaignAddProxy();
    await givethDirectory.changeStatus(0, CampaignStatus.Obsolted);
    const updated = await givethDirectory.getCampaign(0);
    assert.equal(updated[statusIdx].c, CampaignStatus.Obsolted);
  });

  it('prevents the campaign status from being changed by non-owners', async () => {
    await campaignAddProxy();
    await errorAsserter(statusChangeProxy, assertJump)(0, CampaignStatus.Obsolted, accounts[9]);
  });

  it('prevents the campaign status from being set to an invalid value', async () => {
    await campaignAddProxy();
    await errorAsserter(statusChangeProxy, assertJump)(0, CampaignStatus.THROWS_ERROR);
  });

  it('prevents the campaign status from being set when the campaign index is out of bounds', async () => {
    await campaignAddProxy();
    await errorAsserter(statusChangeProxy, assertJump)(1, CampaignStatus.Obsolted);
  });

});
