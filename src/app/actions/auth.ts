"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function registerUser(formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!firstName || !lastName || !email || !password) {
        return { success: false, message: "All fields are required" };
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, message: "User with this email already exists" };
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in database
        await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash: hashedPassword,
            },
        });

        return { success: true, message: "Successfully registered" };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: "Error creating user" };
    }
}

export async function loginUser(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, message: "All fields are required" };
    }

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { success: false, message: "Invalid email or password" };
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return { success: false, message: "Invalid email or password" };
        }

        // Don't include password in the response
        const { passwordHash, ...userWithoutPassword } = user;

        return { success: true, message: "Login successful", user: userWithoutPassword };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "An error occurred during login" };
    }
}