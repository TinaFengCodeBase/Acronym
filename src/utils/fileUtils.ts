
import { Acronym } from "../types/types";

export const saveAcronymsToFile = async (acronyms: Acronym[]) => {
  try {
    const blob = new Blob([JSON.stringify(acronyms, null, 2)], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'MasterAcronym.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error saving acronyms:', error);
    throw error;
  }
};

export const loadAcronymsFromFile = async (): Promise<Acronym[]> => {
  try {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    
    return new Promise((resolve, reject) => {
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const content = event.target?.result as string;
            const acronyms = JSON.parse(content) as Acronym[];
            resolve(acronyms);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      };
      input.click();
    });
  } catch (error) {
    console.error('Error loading acronyms:', error);
    throw error;
  }
};
