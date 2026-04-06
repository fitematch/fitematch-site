import { User } from "@/interfaces/user.interface";

export type CreateUserRequestInterface = Omit<User, "id" | "createdAt" | "updatedAt">;
