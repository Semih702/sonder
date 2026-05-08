import { z } from "zod";
import { coordinatesSchema } from "./common";

export const presenceHeartbeatSchema = coordinatesSchema;

export type PresenceHeartbeatInput = z.infer<typeof presenceHeartbeatSchema>;

