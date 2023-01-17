import { useContext } from "react";
import { LanguageContext } from "../App";
import { languages } from "../language";

export const translate = (text: string) => {
  const { language } = useContext(LanguageContext);

  // return the translated text or the original text(for english)
  if (Object.keys(languages).includes(language)) {
    //@ts-ignore
    return languages[language][text] || text;
  }

  return text;
};
