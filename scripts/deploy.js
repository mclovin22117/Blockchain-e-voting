import hre from "hardhat";

async function main() {
  console.log("Deploying Election contract to Sepolia...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const Election = await hre.ethers.getContractFactory("Election");
  console.log("Deploying contract...");
  
  const election = await Election.deploy();
  await election.waitForDeployment();

  const contractAddress = await election.getAddress();
  console.log("\n✅ Election contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("\n🔍 Verify on Etherscan:");
  console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);
  
  console.log("\n📝 Next steps:");
  console.log("1. Update frontend/.env with:");
  console.log(`   VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Update backend/.env with:");
  console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
