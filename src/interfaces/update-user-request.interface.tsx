import { User } from "@/interfaces/user.interface";

export type UpdateUserRequestInterface = Omit<User, "id" | "createdAt" | "updatedAt">;
