import { body } from "express-validator";

export const CreateDomainDTO = [
  body("domain", "Domain is required").trim().notEmpty(),
];

export const validatePriceDomainPack = (value, { req }) => {
  const { data } = req.body
  if (!Array.isArray(data)) {
    throw new Error("data phải là một mảng");
  }

  value.forEach((item, index) => {
    const hasEntity =
      (item.entityPrice !== undefined && item.entityPrice !== null) ||
      (item.entityPriceUSD !== undefined && item.entityPriceUSD !== null);

    const hasBacklink =
      (item.backlinkPrice !== undefined && item.backlinkPrice !== null) ||
      (item.backlinkPriceUSD !== undefined && item.backlinkPriceUSD !== null);

    if (hasEntity && hasBacklink) {
      throw new Error(`Item ${index} không được có cả giá Entity và Backlink`);
    }

    if (!hasEntity && !hasBacklink) {
      throw new Error(`Item ${index} phải có ít nhất giá Entity hoặc Backlink`);
    }
  });

  return true;
};
