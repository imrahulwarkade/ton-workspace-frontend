import { createMockUser, sessionResponse } from '../_shared'

export async function POST() {
  const user = createMockUser('rahul@toneopfit.com', 'Rahul')
  return sessionResponse(user)
}
