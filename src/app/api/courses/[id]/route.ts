import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid course ID' },
                { status: 400 }
            );
        }

        const course = await prisma.course.findUnique({
            where: { id },
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
        });

        if (!course) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        return NextResponse.json(
            { error: 'Failed to fetch course' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid course ID' },
                { status: 400 }
            );
        }

        const { title, description, capacity, isPremium, hasAds } = await request.json();

        const updatedCourse = await prisma.course.update({
            where: { id },
            data: {
                title,
                description,
                capacity,
                isPremium,
                hasAds,
            },
        });

        return NextResponse.json(updatedCourse, { status: 200 });
    } catch (error) {
        console.error('Error updating course:', error);
        return NextResponse.json(
            { error: 'Failed to update course' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid course ID' },
                { status: 400 }
            );
        }

        await prisma.course.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: 'Course deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting course:', error);
        return NextResponse.json(
            { error: 'Failed to delete course' },
            { status: 500 }
        );
    }
}