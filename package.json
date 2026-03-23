import type { NextApiRequest, NextApiResponse } from 'next'
import { getSites } from '@/lib/data'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.status(200).json({
    schema_version: '1.0',
    generated: '2026-03-22',
    count: getSites().length,
    sites: getSites(),
  })
}
