# make deploy RPC_URL=XXX PRV_KEY=XXX
deploy:
	cd contract
	@make deploy-production RPC_URL=$(RPC_URL) PRV_KEY=$(PRV_KEY)
	@make copy-abi
	cd ../frontend
	pnpm run build
	vercel