const Election = artifacts.require("Election");

contract("Election", accounts => {
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];

  it("deploys and allows owner to add candidates and register voters", async () => {
    const instance = await Election.deployed();
    await instance.addCandidate("BJP", { from: owner });
    await instance.addCandidate("Congress", { from: owner });

    const c1 = await instance.getCandidate(1);
    assert.equal(c1[1], "BJP", "candidate 1 should be BJP");

    await instance.registerVoter(voter1, { from: owner });
    const reg = await instance.registered(voter1);
    assert.equal(reg, true, "voter1 should be registered");
  });

  it("allows voters to cast and revote, tally updates", async () => {
    const instance = await Election.deployed();
    // prepare fake hash
    const h1 = web3.utils.sha3("encrypted-vote-1");
    const h2 = web3.utils.sha3("encrypted-vote-2");

    // register voter2
    await instance.registerVoter(voter2, { from: accounts[0] });

    // voter1 casts for candidate 1
    await instance.castVote(1, h1, { from: voter1 });
    let tally = await instance.tally();
    assert.equal(tally[1][0].toNumber(), 1, "BJP should have 1 vote");

    // voter1 revotes for candidate 2
    await instance.castVote(2, h2, { from: voter1 });
    tally = await instance.tally();
    assert.equal(tally[1][0].toNumber(), 0, "BJP should have 0 votes after revote");
    assert.equal(tally[1][1].toNumber(), 1, "Congress should have 1 vote after revote");
  });
});
