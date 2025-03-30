import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const { title, description } = await req.json();

    try {
        const assignment = await prisma.assignment.create({
            data: {
                title,
                description,
                courseId: parseInt(params.id),
            },
        });

        return NextResponse.json(assignment, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Chyba při vytváření úkolu." }, { status: 500 });
    }
}