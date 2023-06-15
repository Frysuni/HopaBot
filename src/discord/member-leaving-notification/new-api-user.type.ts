import type { APIUser } from "discord.js";

export type NewApiUser = APIUser & { global_name: string | null };