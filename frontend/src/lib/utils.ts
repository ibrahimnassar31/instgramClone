import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

type ClassValue = string | { [key: string]: boolean }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const readFileAsDataURL = (file: File | null): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result); 
      } else {
        reject(new Error("Failed to read file as Data URL"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error occurred while reading the file"));
    };

    reader.readAsDataURL(file);
  });
};