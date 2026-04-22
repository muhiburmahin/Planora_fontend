import * as z from "zod"

const passwordSchema = z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password is too long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address")
        .toLowerCase(),
    password: z.string().min(1, "Password is required"),
})

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name is too long"),
        email: z
            .string()
            .trim()
            .email("Please enter a valid email address")
            .toLowerCase(),
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Please confirm your password"),

    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
    email: z.string().trim().email("Please enter a valid email address").toLowerCase()
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
    otp: z.string().min(4, "Invalid OTP").max(10, "Invalid OTP"),
    newPassword: passwordSchema
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>