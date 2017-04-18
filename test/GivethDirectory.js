'use strict';

const assertJump = require('./helpers/assertJump');

var GivethDirectory = artifacts.require('../contracts/GivethDirectory.sol');

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

  it('should have an owner', async () => {
    let owner = await givethDirectory.owner();
    assert.isTrue(owner !== 0);
  });

  it('is created with no campaigns in the collection', async () => {
    const numCampaigns = await givethDirectory.numberOfCampaigns();
    assert.equal(numCampaigns, 0);
  })

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
});
