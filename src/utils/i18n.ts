/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

export const i18n = (text: string, placeholder?: Record<string, string>) => {
  // Replace placehodler in the way of {key} into the value from the placeholder
  if (placeholder === undefined) {
    return text;
  }
  return text.replace(/{(\w+)}/g, (match, key) => placeholder[key] || match);
};
