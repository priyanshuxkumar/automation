import { z } from "zod";


export const EmailSchema = z.string().email();

export const UserSignupSchema = z.object({
    firstname : z.string(),
    lastname : z.string(),
    email : EmailSchema,
    username : z.string(),
    password: z.string()
})

export const UserSignInSchema = z.object({
    email : EmailSchema,
    password: z.string()
})