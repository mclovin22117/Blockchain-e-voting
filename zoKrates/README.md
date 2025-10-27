ZoKrates placeholder

This folder contains a minimal ZoKrates prototype and notes for future zk-SNARK integration.

Steps (not automated):
- Install ZoKrates (https://zokrates.github.io/).
- Create a simple program, compute witness, generate proving/verifying keys, and produce a proof.
- The verification contract can be deployed and integrated into the Election contract for on-chain proof checks.

Example (pseudo):
```
def main(private field a, field b) -> (field):
    field c = a * b
    return c
```

This prototype repo does not include a full ZK integration — it's a placeholder and instructions.
