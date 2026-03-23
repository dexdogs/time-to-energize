import type { NextApiRequest, NextApiResponse } from 'next'
import { getTenants } from '@/lib/data'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { site_id, status } = req.query
  let tenants = getTenants()

  if (site_id && typeof site_id === 'string') {
    tenants = tenants.filter(t => t.site_id === site_id)
  }
  if (status && typeof status === 'string') {
    tenants = tenants.filter(t => t.tenant_status === status)
  }

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.status(200).json({
    schema_version: '1.0',
    generated: '2026-03-22',
    count: tenants.length,
    tenants,
  })
}
