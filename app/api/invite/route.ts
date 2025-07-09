import { NextRequest, NextResponse } from 'next/server';
import { Client, Teams } from 'node-appwrite';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, teamId, roles } = body;

        if (!email || !teamId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
            .setKey(process.env.NEXT_APPWRITE_KEY!);

        const teams = new Teams(client);

        const memberships = await teams.listMemberships(teamId);
        const existing = memberships.memberships.find((m) => m.userEmail === email && !m.confirm);
        if (existing) {
            await teams.deleteMembership(teamId, existing.$id);
        }

        // Create a new membership
        const membership = await teams.createMembership(
            teamId,
            roles || ['guest'],
            email,
            undefined,
            undefined,
            'http://localhost:3000/dashboard'
        );

        return NextResponse.json(membership)

        // const consoleURL = process.env.NEXT_PUBLIC_APPWRITE_CONSOLE_URL || 'http://localhost';
        //
        // const confirmLink = `${consoleURL}/teams/${teamId}/memberships/${membership.$id}/status?userId=${membership.userId}&secret=${membership.secret}&success=http://localhost:3000/dashboard&failure=http://localhost:3000/error`;
        //
        //
        // return NextResponse.json({
        //     membershipId: membership.$id,
        //     userId: membership.userId,
        //     secret: membership.secret,
        //     confirmLink,
        // });
    } catch (error: unknown) {
        console.error('Invite error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
