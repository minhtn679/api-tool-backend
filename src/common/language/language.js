import vi from "./vi.json" assert { type: "json" };
import en from "./en.json" assert { type: "json" };
import th from "./th.json" assert { type: "json" };
import cn from "./cn.json" assert { type: "json" };

export const messageByLanguage = (req, attr) => {
  const language = req.headers?.language || "vi";

  switch (language) {
    case "en":
      return attr ? en[attr] : "";

    case "th":
      return attr ? th[attr] : "";

    case "cn":
      return attr ? cn[attr] : "";

    default:
      return attr ? vi[attr] : "";
  }
};
