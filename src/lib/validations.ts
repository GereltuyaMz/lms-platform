import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Нэр дор хаяж 2 тэмдэгт байх ёстой")
    .max(50, "Нэр 50 тэмдэгтээс бага байх ёстой"),
  email: z
    .string()
    .min(1, "Имэйл хаяг шаардлагатай")
    .email("Зөв имэйл хаяг оруулна уу"),
  password: z
    .string()
    .min(6, "Нууц үг дор хаяж 6 тэмдэгт байх ёстой")
    .max(100, "Нууц үг 100 тэмдэгтээс бага байх ёстой"),
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Имэйл хаяг шаардлагатай")
    .email("Зөв имэйл хаяг оруулна уу"),
  password: z.string().min(1, "Нууц үг шаардлагатай"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
