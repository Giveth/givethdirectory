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
    const campaignId = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );
    const numCampaigns = await givethDirectory.numberOfCampaigns();
    assert.equal(numCampaigns, 1);
  });

  it('prevents campaigns from being added by non-owners', async () => {
    try {
      await givethDirectory.addCampaign(
        testCampaign.name,
        testCampaign.description,
        testCampaign.url,
        testCampaign.token,
        testCampaign.vault,
        testCampaign.milestoneTracker,
        testCampaign.extra, 
        { from: accounts[9] }
      );
    } catch(error) {
      assertJump(error);
    }
  });

  it('errors if fields are missing when adding a Campaign', async () => {
    try{
      await givethDirectory.addCampaign(
        testCampaign.name,
        testCampaign.description
      );
    } catch(error) {
      assertWasNotAdded(error);
    }
  });

  /**********************************
              getCampaign
  *********************************/
  it('gets a campaign by id', async () => {
    const campaign = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );

    const retrievedCampaign = await givethDirectory.getCampaign(0);
    assert.equal(retrievedCampaign[0], testCampaign.name);
    assert.equal(retrievedCampaign[1], testCampaign.description);
    assert.equal(retrievedCampaign[2], testCampaign.url);
    assert.equal(retrievedCampaign[3], testCampaign.token);
    assert.equal(retrievedCampaign[4], testCampaign.vault);
    assert.equal(retrievedCampaign[5], testCampaign.milestoneTracker);
    assert.equal(retrievedCampaign[6], testCampaign.extra);
  });

  it('fails to get campaigns at invalid ids', async () => {
    const campaign = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );

    try {
      await givethDirectory.getCampaign(1);
    } catch(error) {
      assertJump(error);
    }
  });

  /**********************************
            numberOfCampaigns
  *********************************/
  it('gets the number of campaigns', async () => {
    const campaign = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );

    const numCampaigns = await givethDirectory.numberOfCampaigns();
    assert.equal(numCampaigns, 1);
  });

  /**********************************
            updateCampaign
  *********************************/
  it('can update the campaign', async () => {
    const campaign = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );

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
    const campaign = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );

    try {
      await givethDirectory.updateCampaign(
        0, 
        testCampaign.name + '_update',
        testCampaign.description + '_update',
        testCampaign.url + '_update',
        testCampaign.milestoneTracker,
        testCampaign.token,
        testCampaign.vault,
        testCampaign.extra + '_update',
        { from: accounts[9] }
      );
    } catch(error) {
      assertJump(error);
    }
  });

  it('errors when provided an invalid campaign id', async () => {
    const campaign = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );

    try {
      await givethDirectory.updateCampaign(
        7, 
        testCampaign.name + '_update',
        testCampaign.description + '_update',
        testCampaign.url + '_update',
        testCampaign.milestoneTracker,
        testCampaign.token,
        testCampaign.vault,
        testCampaign.extra + '_update',
        { from: accounts[9] }
      );
    } catch(error) {
      assertJump(error);
    }
  });

  it('errors if fields are missing when updating a Campaign', async () => {
    const campaign = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );

    try{
      await givethDirectory.updateCampaign(
        0, 
        testCampaign.name + '_update',
        testCampaign.description + '_update'
      );
    } catch(error) {
      assertWasNotAdded(error);
    }
  });

  /**********************************
            changeStatus
  *********************************/
  it('can change the campaign status', async () => {
    const statusIdx = 7;
    const campaign = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );

    await givethDirectory.changeStatus(0, CampaignStatus.Obsolted);
    const updated = await givethDirectory.getCampaign(0);
    assert.equal(updated[statusIdx].c, CampaignStatus.Obsolted);
  });

  it('prevents the campaign status from being changed by non-owners', async () => {
    const statusIdx = 7;
    const campaign = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );

    try {
      await givethDirectory.changeStatus(0, CampaignStatus.Obsolted, { from : accounts[9] });
    } catch(error) {
      assertJump(error);
    }
  });

  it('prevents the campaign status from being set to an invalid value', async () => {
    const statusIdx = 7;
    const campaign = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );

    try {
      await givethDirectory.changeStatus(0, CampaignStatus.THROWS_ERROR);
    } catch(error) {
      assertJump(error);
    }
  });

  it('prevents the campaign status from being set when the campaign index is out of bounds', async () => {
    const statusIdx = 7;
    const campaign = await givethDirectory.addCampaign(
      testCampaign.name,
      testCampaign.description,
      testCampaign.url,
      testCampaign.token,
      testCampaign.vault,
      testCampaign.milestoneTracker,
      testCampaign.extra
    );

    try {
      await givethDirectory.changeStatus(1, CampaignStatus.Obsolted);
    } catch(error) {
      assertJump(error);
    }
  });

});