import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from 'nanoid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
// export function applyCodeChangesByRow(codeChanges: z.infer<typeof codeChangeSchema>, existingCode: string): string {
//   if (codeChanges.replaceAll && codeChanges.replacement) {
//     return codeChanges.replacement;
//   }

//   let codeLines = existingCode.split('\n');

//   if (codeChanges.changes) {
//     codeChanges.changes.forEach(change => {
//       if (change.startLine === undefined || change.endLine === undefined || change.replacement === undefined) {
//         return;
//       }
//       const { startLine, endLine, replacement } = change;
//       // Adjust line numbers (arrays are zero-indexed)
//       console.log(startLine, endLine, replacement);
//       const startIdx = startLine - 1;
//       const endIdx = endLine;
//       if (replacement === undefined) {
//         return;
//       }
//       const replacementLines = replacement.split('\n');
//       codeLines.splice(startIdx, endIdx - startIdx, ...replacementLines);
//     });
//   }

//   return codeLines.join('\n');
// }

export function applyCodeChanges(
  codeChanges: { changes?: any[]; replaceAll: boolean; replacement?: string },
  existingCode: string
): string {
  if (codeChanges.replaceAll && codeChanges.replacement) {
    return codeChanges.replacement;
  }

  let updatedCode = existingCode;

  if (codeChanges.changes) {
    codeChanges.changes.forEach(change => {
      const { oldSnippet, newSnippet } = change;
      // Use a function that safely replaces the oldSnippet with newSnippet
      if (!oldSnippet || !newSnippet) {
        return;
      }
      updatedCode = replaceCodeSnippet(updatedCode, oldSnippet, newSnippet);
    });
  }

  return updatedCode;
}

function replaceCodeSnippet(code: string, oldSnippet: string, newSnippet: string): string {
  const escapedOldSnippet = escapeRegExp(oldSnippet.trim());
  const regex = new RegExp(escapedOldSnippet, 'g');
  return code.replace(regex, newSnippet.trim());
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function isObjectFullyDefined<T>(obj: Partial<T>): boolean {
  for (const key in obj) {
    if (obj[key] === undefined) {
      return false;
    }
  }
  return true;
}