"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Course } from "@/types/course";
import { Icon } from "@iconify/react/dist/iconify.js";

const courseImageArray: string[] = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU1QcWyLr7f0bHiBv4ZKw74dpj5sfS98yJPA&s", // C++
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyIxiE33bx2t0rTEUln1KrEc7e4TejvtOZPg&s", // Python
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPHX0QdVpZVWsnXCaEF3Lp7bSmZ7MIkjL33A&s", // React
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOAnih04WNhAAe_aolZqky1alLD72EIoEDEA&s", // ML
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ28e3mGOO58W9ZYK77RnRWft95Bwr4lg5RQ&s", // PSQL
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuiNAv3RuXflh4VDsij9Onm3Ii7CuQbFJsTQ&s", // Cybersec
];

const EditCoursePage = () => {
    const params = useParams();
    const router = useRouter();
    const courseId = Number(params.id);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const courseImage = course ? courseImageArray[courseId - 1] : null;

    useEffect(() => {
        async function fetchCourseDetail() {
            try {
                setLoading(true);

                const res = await fetch(`/api/courses/${courseId}`);
                if (!res.ok) throw new Error("Nemohu načíst detail kurzu");
                const data = await res.json();
                setCourse(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Neznámá chyba");
            } finally {
                setLoading(false);
            }
        }

        if (courseId) {
            fetchCourseDetail();
        }
    }, [courseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/courses/${courseId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(course),
            });

            if (!res.ok) {
                throw new Error("Chyba při ukládání změn.");
            }

            router.push(`/courses/${courseId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Neznámá chyba.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto p-8 mt-24">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
                <h2 className="text-xl font-bold mb-2">Chyba</h2>
                <p>{error}</p>
            </div>
        </div>
    );

    if (!course) return (
        <div className="container mx-auto p-8 mt-24">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-700">
                <h2 className="text-xl font-bold mb-2">Kurz nenalezen</h2>
                <p>Požadovaný kurz neexistuje nebo byl odstraněn.</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-8 mt-16 md:mt-24 max-w-6xl">
            <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl overflow-hidden">
                {/* Hero section with image and overlay */}
                <div className="relative h-64 md:h-96">
                    <img
                        src={courseImage || undefined}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
                        <div className="mb-2">
                            {course.isPremium && (
                                <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full mr-2 uppercase tracking-wide">
                                    Premium
                                </span>
                            )}
                            {!course.hasAds && (
                                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Bez reklam
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            value={course.title}
                            onChange={(e) => setCourse({ ...course, title: e.target.value })}
                            className="text-3xl md:text-4xl font-bold text-white mb-2 bg-transparent border-none outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* Course details */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-3 text-gray-800 flex items-center">
                                    <Icon icon="ph:info-fill" className="mr-2 text-blue-500" />
                                    O kurzu
                                </h2>
                                <textarea
                                    value={course.description || ""}
                                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                                    className="text-gray-700 leading-relaxed w-full border p-2 rounded"
                                    rows={5}
                                />
                            </div>
                        </div>

                        <div className="md:w-80 flex-shrink-0">
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <h2 className="text-lg font-bold mb-4 pb-3 border-b border-gray-200">Detaily kurzu</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-center">
                                        <Icon icon="ph:users-three-fill" className="text-gray-500 mr-3 w-5 h-5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Kapacita</div>
                                            <input
                                                type="number"
                                                value={course.capacity || ""}
                                                onChange={(e) => setCourse({ ...course, capacity: Number(e.target.value) })}
                                                className="font-medium w-full border p-2 rounded"
                                            />
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <Icon icon="ph:crown-fill" className="text-gray-500 mr-3 w-5 h-5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Premium kurz</div>
                                            <input
                                                type="checkbox"
                                                checked={course.isPremium}
                                                onChange={(e) => setCourse({ ...course, isPremium: e.target.checked })}
                                                className="ml-2"
                                            />
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <Icon icon="ph:book-open-fill" className="text-gray-500 mr-3 w-5 h-5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Bez reklam</div>
                                            <input
                                                type="checkbox"
                                                checked={!course.hasAds}
                                                onChange={(e) => setCourse({ ...course, hasAds: !e.target.checked })}
                                                className="ml-2"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-6"
                    >
                        Uložit změny
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCoursePage;