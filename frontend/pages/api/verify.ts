import { ethers } from "ethers"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function apiVerify (req: NextApiRequest, res: NextApiResponse) {
  const {message, address: expected, signature} = req.body
  const digest = ethers.utils.hashMessage(message)
  const actual = ethers.utils.recoverAddress(digest, signature)
  const isVerified = actual === expected

  res.send({isVerified})
}