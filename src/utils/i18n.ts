export const i18n = (text: string, placeholder?: Record<string, string>) => {
  // Replace placehodler in the way of {key} into the value from the placeholder
  if (placeholder === undefined) {
    return text;
  }
  return text.replace(/{(\w+)}/g, (match, key) => placeholder[key] || match);
};
