start-node:
	anvil
.PHONY: deploy-local
deploy-local:
	forge script script/MedicalDatabase.s.sol:MedicalDatabaseScript --rpc-url http://127.0.0.1:8545 --private-key $(PRV_KEY) --broadcast -vvvv
copy-abi:
	cp out/MedicalDatabase.sol/MedicalDatabase.json ../frontend/abi.json
