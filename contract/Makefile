.PHONY: deploy-local
start-node:
	anvil
deploy-local:
	forge script script/MedicalDatabase.s.sol:MedicalDatabaseScript --rpc-url http://127.0.0.1:8545 --private-key $(PRV_KEY) --broadcast -vvvv
deploy-production:
	forge script script/MedicalDatabase.s.sol:MedicalDatabaseScript --rpc-url $(RPC_URL) --private-key $(PRV_KEY) --broadcast -vvvv
copy-abi:
	cp out/MedicalDatabase.sol/MedicalDatabase.json ../frontend/abi.json
