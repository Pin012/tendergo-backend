export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2,
  timeoutMs = 15000
): Promise<string> {
  let lastError: any;

  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const text = await response.text();
      return text;
    } catch (err: any) {
      lastError = err;
      if (err.name === 'AbortError') {
        console.warn(`Fetch timeout (${timeoutMs}ms) at ${url}, attempt ${i + 1}`);
      } else {
        console.warn(`Fetch error at ${url}: ${err.message}, attempt ${i + 1}`);
      }
      
      if (i < retries) {
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError || new Error('Request failed');
}
