// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    address public owner;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    uint public candidatesCount;
    mapping(uint => Candidate) public candidates;

    mapping(address => bool) public registered;
    mapping(address => bool) public hasVoted;
    mapping(address => uint) public votes; // candidateId
    mapping(address => bytes32) public voteHashes; // hash of encrypted vote stored on IPFS

    event VoterRegistered(address voter);
    event CandidateAdded(uint id, string name);
    event VoteCast(address voter, uint candidateId, bytes32 voteHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addCandidate(string memory name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, name, 0);
        emit CandidateAdded(candidatesCount, name);
    }

    function registerVoter(address _voter) public onlyOwner {
        registered[_voter] = true;
        emit VoterRegistered(_voter);
    }

    // candidateId must be valid and voter must be registered
    // voteHash should be the SHA-256 (or keccak) hash of the encrypted vote stored off-chain (IPFS)
    function castVote(uint candidateId, bytes32 voteHash) public {
        require(registered[msg.sender], "not registered");
        require(candidateId > 0 && candidateId <= candidatesCount, "invalid candidate");

        if (hasVoted[msg.sender]) {
            uint prev = votes[msg.sender];
            if (prev != candidateId) {
                // revoke previous vote and count new
                candidates[prev].voteCount -= 1;
                candidates[candidateId].voteCount += 1;
                votes[msg.sender] = candidateId;
                voteHashes[msg.sender] = voteHash;
                emit VoteCast(msg.sender, candidateId, voteHash);
            } else {
                // same candidate: allow updating the hash (e.g., re-upload to IPFS)
                voteHashes[msg.sender] = voteHash;
                emit VoteCast(msg.sender, candidateId, voteHash);
            }
        } else {
            hasVoted[msg.sender] = true;
            votes[msg.sender] = candidateId;
            voteHashes[msg.sender] = voteHash;
            candidates[candidateId].voteCount += 1;
            emit VoteCast(msg.sender, candidateId, voteHash);
        }
    }

    function getCandidate(uint id) public view returns (uint, string memory, uint) {
        Candidate storage c = candidates[id];
        return (c.id, c.name, c.voteCount);
    }

    // returns arrays of candidate ids and counts
    function tally() public view returns (uint[] memory ids, uint[] memory counts) {
        ids = new uint[](candidatesCount);
        counts = new uint[](candidatesCount);
        for (uint i = 0; i < candidatesCount; i++) {
            ids[i] = i + 1;
            counts[i] = candidates[i + 1].voteCount;
        }
        return (ids, counts);
    }
}
