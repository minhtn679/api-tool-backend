export const validatePricesPack = ({
  entityPrice,
  entityPriceUSD,
  backlinkPrice,
  backlinkPriceUSD,
}) => {
  // Kiểm tra xem có ít nhất một trong các giá entity được cung cấp
  const hasEntityPrice =
    (entityPrice !== undefined && entityPrice !== null) ||
    (entityPriceUSD !== undefined && entityPriceUSD !== null);

  // Kiểm tra xem có ít nhất một trong các giá backlink được cung cấp
  const hasBacklinkPrice =
    (backlinkPrice !== undefined && backlinkPrice !== null) ||
    (backlinkPriceUSD !== undefined && backlinkPriceUSD !== null);

  // Nếu cả hai đều có giá trị hoặc cả hai đều không có giá trị thì không hợp lệ
  if (hasEntityPrice && hasBacklinkPrice) {
    return false; // Không hợp lệ vì có cả giá entity và backlink
  }

  if (!hasEntityPrice && !hasBacklinkPrice) {
    return false; // Không hợp lệ vì không có giá nào
  }

  return true; // Hợp lệ: chỉ có giá entity hoặc chỉ có giá backlink
};

export const getPriceType = ({
  entityPrice,
  entityPriceUSD,
  backlinkPrice,
  backlinkPriceUSD,
}) => {
  const hasEntity =
    (entityPrice !== undefined && entityPrice !== null) ||
    (entityPriceUSD !== undefined && entityPriceUSD !== null);

  const hasBacklink =
    (backlinkPrice !== undefined && backlinkPrice !== null) ||
    (backlinkPriceUSD !== undefined && backlinkPriceUSD !== null);

  if (hasEntity && !hasBacklink) {
    return "entity"; // Chỉ có giá entity
  } else if (!hasEntity && hasBacklink) {
    return "backlink"; // Chỉ có giá backlink
  } else {
    return 'unknown'; // Trường hợp không hợp lệ (cả hai hoặc không có gì)
  }
};
