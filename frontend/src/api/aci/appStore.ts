// frontend/src/api/aci/appStore.ts

// Placeholder types - replace with actual types based on backend design
export interface AppStoreFunction {
  id: string;
  name: string;
  description: string;
  // Add other relevant fields
}

export interface FunctionDefinition {
  // Define structure based on backend definition
  definition: any; // Placeholder
}

/**
 * Fetches the list of available App Store functions.
 * @returns A promise resolving to an array of AppStoreFunction.
 */
export async function getAppStoreFunctions(): Promise<AppStoreFunction[]> {
  try {
    const response = await fetch('/api/aci/app-store/functions');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: AppStoreFunction[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching App Store functions:", error);
    throw error;
  }
}

/**
 * Fetches the definition of a specific App Store function.
 * @param functionId The ID of the function to fetch.
 * @returns A promise resolving to the FunctionDefinition.
 */
export async function getFunctionDefinition(functionId: string): Promise<FunctionDefinition> {
  try {
    const response = await fetch(`/api/aci/app-store/functions/${functionId}/definition`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: FunctionDefinition = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching function definition for ${functionId}:`, error);
    throw error;
  }
}