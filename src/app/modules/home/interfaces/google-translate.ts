export interface GoogleTranslate {
  data: { translations: [{ translatedText: string; detectedSourceLanguage: string }] };
}
