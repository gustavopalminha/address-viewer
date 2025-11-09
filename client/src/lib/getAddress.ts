export async function getAddress<T>(input: string): Promise<T> {

    const PROXY_TARGET = import.meta.env.VITE_API_PROXY_TARGET;
    
    let BASE_URL = '/api/search';
    
    if (PROXY_TARGET) {
      BASE_URL = `${PROXY_TARGET}/search`; 
    } else {
      BASE_URL = '/api/search';
    }

    const response = await fetch(`${BASE_URL}/${input}`);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return await response.json() as T;
}