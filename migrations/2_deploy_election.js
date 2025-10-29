const Election = artifacts.require("Election");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Election);
  const election = await Election.deployed();

  // Seed with two demo candidates and register the deployer as a voter for quick testing
  try {
    await election.addCandidate("BJP");
    await election.addCandidate("Congress");
  } catch (e) {
    // ignore if already added on re-migrate
  }

  try {
    if (accounts && accounts.length) {
      await election.registerVoter(accounts[0]);
    }
  } catch (e) {
    // ignore if already registered
  }
};
