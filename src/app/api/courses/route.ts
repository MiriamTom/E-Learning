import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                teacher: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                materials: true,
                assignments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Nepovedlo se získat kurzy, chyba:', error);
        return NextResponse.json(
            { error: 'Nepovedlo se získat kurzy' },
            { status: 500 }
        );
    }
}
/*
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, teacherId } = body;

        if (!title || !teacherId) {
            return NextResponse.json(
                { error: 'Title a teacherId jsou povinné' },
                { status: 400 }
            );
        }

        const newCourse = await prisma.course.create({
            data: {
                title,
                description,
                teacherId,
            },
        });

        return NextResponse.json(newCourse, { status: 201 });
    } catch (error) {
        console.error('Chyba při vytváření kurzu:', error);
        return NextResponse.json(
            { error: 'Nepodařilo se vytvořit kurz' },
            { status: 500 }
        );
    }
}*/