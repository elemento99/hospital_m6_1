interface Config {
  defaultApiUrl: string;
  getApiUrl(): Promise<string>;
}

export const config: Config = {
  defaultApiUrl: 'http://localhost:5000',
  async getApiUrl(): Promise<string> {
    // Try to connect to the default port first
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        return 'http://localhost:5000';
      }
    } catch {}

    // Try alternative ports if default is not available
    for (let port = 5001; port <= 5010; port++) {
      try {
        const response = await fetch(`http://localhost:${port}/health`);
        if (response.ok) {
          return `http://localhost:${port}`;
        }
      } catch {}
    }

    // Return default if no port is available
    return 'http://localhost:5000';
  }
}; 