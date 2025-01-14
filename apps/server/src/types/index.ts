import { z } from "zod";


export const EmailSchema = z.string().email();


/**  User Schema */ 
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

/** Workflow Schema */ 
export const CreateWorkflowSchema = z.object({
    name : z.string().max(20),
    triggerTypeId : z.string(),
    triggerMetadata : z.any().optional(),
    actions: z.array(z.object({
        actionTypeId : z.string(),
        actionMetadata : z.any().optional()
    }))
})