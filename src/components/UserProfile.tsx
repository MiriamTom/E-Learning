"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Course } from "@/types/course";
import Link from "next/link";

const imageMap: Record<string, string> = {
    "Základy jazyka C++": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU1QcWyLr7f0bHiBv4ZKw74dpj5sfS98yJPA&s",
    "Datová analýza v Pythonu": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyIxiE33bx2t0rTEUln1KrEc7e4TejvtOZPg&s",
    "Vývoj pomocí Reactu": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPHX0QdVpZVWsnXCaEF3Lp7bSmZ7MIkjL33A&s",
    "Základy strojového učení": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOAnih04WNhAAe_aolZqky1alLD72EIoEDEA&s",
    "Správa databází s PostgreSQL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ28e3mGOO58W9ZYK77RnRWft95Bwr4lg5RQ&s",
    "Úvod do kybernetické bezpečnosti": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuiNAv3RuXflh4VDsij9Onm3Ii7CuQbFJsTQ&s",
};

const UserProfile = () => {
    const { data: session, status } = useSession();
    const [userCourses, setUserCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string>("");
    const [userRole, setUserRole] = useState<string>("");

    useEffect(() => {
        if (status === "loading") return;

        if (session) {
            const fetchUserData = async () => {
                try {
                    const userResponse = await fetch(`/api/users/${session.user.email}`);

                    if (!userResponse.ok) {
                        throw new Error("Chyba při načítání uživatelského profilu.");
                    }

                    const userData = await userResponse.json();
                    setUserRole(userData.role);

                    if (userData.role === "student") {
                        if (!userData.enrollments || !Array.isArray(userData.enrollments)) {
                            setError("Žádné přihlášené kurzy nenalezeny.");
                            return;
                        }
                        setUserCourses(userData.enrollments.map((enrollment: { course: Course }) => enrollment.course));
                    } else if (userData.role === "teacher") {
                        const coursesResponse = await fetch(`/api/courses`);

                        if (!coursesResponse.ok) {
                            throw new Error("Chyba při načítání vedených kurzů.");
                        }

                        const coursesData: Course[] = await coursesResponse.json();

                        const teacherCourses = coursesData.filter(
                            (course) => course.teacherId === userData.id
                        );

                        if (teacherCourses.length === 0) {
                            setError("Žádné vedené kurzy nenalezeny.");
                            return;
                        }

                        setUserCourses(teacherCourses);
                    }
                } catch (err) {
                    console.error(err);
                    setError(err instanceof Error ? err.message : "Chyba při načítání kurzů.");
                }
            };

            fetchUserData();
        } else {
            setError("Uživatel není přihlášen.");
        }
    }, [session, status]);

    if (status === "loading") {
        return <p>Načítání...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold">
                {userRole === "teacher" ? "Vedené kurzy:" : "Přihlášené kurzy:"}
            </h2>
            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userCourses.length > 0 ? (
                    userCourses.map((course) => (
                        <li
                            key={course.id}
                            className="border p-4 bg-white rounded-lg shadow flex flex-col items-center"
                        >
                            <img
                                src={imageMap[course.title]}
                                alt={course.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="font-bold text-lg mb-2 text-center">{course.title}</h3>
                            <p className="text-gray-700 text-center">{course.description}</p>
                            {userRole === "teacher" && (
                                <Link
                                    href={`/courses/${course.id}/edit`}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Upravit kurz
                                </Link>
                            )}
                        </li>
                    ))
                ) : (
                    <p>
                        {userRole === "teacher"
                            ? "Žádné vedené kurzy nenalezeny."
                            : "Žádné přihlášené kurzy nenalezeny."}
                    </p>
                )}
            </ul>
        </div>
    );
};

export default UserProfile;