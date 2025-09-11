/**
 * (C) Coralbits SL 2025
 * This file is part of Coralpages Editor and is licensed under the
 * GNU Affero General Public License v3.0.
 * A commercial license on request is also available;
 * contact info@coralbits.com for details.
 *
 * https://www.coralbits.com/coralpages/
 */

export const selectFile = (accept: string): Promise<File | undefined> => {
  const promise = new Promise<File | undefined>((resolve, reject) => {
    const body_el = document.body;
    const input_el = document.createElement("input");
    input_el.type = "file";
    input_el.accept = accept;
    input_el.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        resolve(file);
      } else {
        reject(new Error("No file selected"));
      }
    };
    body_el.appendChild(input_el);
    input_el.click();
    body_el.removeChild(input_el);
  });

  return promise;
};
