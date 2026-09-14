import { parseLoginBody, createMockUser, sessionResponse } from '../_shared'

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const parsed = parseLoginBody(body)

  if (!parsed.success) {
    return Response.json(
      { message: parsed.error.issues[0]?.message ?? 'Invalid login payload' },
      { status: 400 }
    )
  }

  const user = createMockUser(parsed.data.email)
  return sessionResponse(user)
}
