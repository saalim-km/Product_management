import { emailSchema, nameSchema, passwordSchema } from "./validators/validation";
import { z } from "zod";


export const userLoginSchema = z.object({
    email : emailSchema,
    password : passwordSchema,
})

export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
});