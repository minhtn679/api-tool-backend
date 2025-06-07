import { body } from "express-validator";

export const CreateDomainDTO = [
  body("domain", "Domain is required").trim().notEmpty(),
];
