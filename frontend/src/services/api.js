const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const predictSentiment = async (tweet) => {
  console.log('🔍 DEBUG: predictSentiment called with:', tweet);
  console.log('🔍 DEBUG: API_BASE_URL:', API_BASE_URL);
  console.log('🔍 DEBUG: Full URL:', `${API_BASE_URL}/predict`);
  
  const requestBody = JSON.stringify({ tweet });
  console.log('🔍 DEBUG: Request body:', requestBody);
  
  try {
    console.log('🔍 DEBUG: Starting fetch request...');
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: requestBody,
    });
    
    console.log('🔍 DEBUG: Response received:');
    console.log('🔍 DEBUG: Response status:', response.status);
    console.log('🔍 DEBUG: Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('🔍 DEBUG: Response URL:', response.url);
    
    if (!response.ok) {
      console.log('🔍 DEBUG: Response not OK, trying to parse error...');
      const errorText = await response.text();
      console.log('🔍 DEBUG: Error response text:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { detail: errorText };
      }
      
      console.log('🔍 DEBUG: Parsed error:', errorData);
      throw new Error(errorData.detail || 'Failed to predict sentiment');
    }
    
    console.log('🔍 DEBUG: Response OK, parsing JSON...');
    const data = await response.json();
    console.log('🔍 DEBUG: Response data:', data);
    return data;
    
  } catch (error) {
    console.log('🔍 DEBUG: Fetch error caught:', error);
    console.log('🔍 DEBUG: Error message:', error.message);
    console.log('🔍 DEBUG: Error stack:', error.stack);
    throw error;
  }
};

export const analyzeHashtag = async (hashtag) => {
  console.log('🔍 DEBUG: analyzeHashtag called with:', hashtag);
  console.log('🔍 DEBUG: API_BASE_URL:', API_BASE_URL);
  console.log('🔍 DEBUG: Full URL:', `${API_BASE_URL}/analyze-hashtag`);
  
  const requestBody = JSON.stringify({ hashtag });
  console.log('🔍 DEBUG: Request body:', requestBody);
  
  try {
    console.log('🔍 DEBUG: Starting fetch request...');
    const response = await fetch(`${API_BASE_URL}/analyze-hashtag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: requestBody,
    });
    
    console.log('🔍 DEBUG: Response received:');
    console.log('🔍 DEBUG: Response status:', response.status);
    console.log('🔍 DEBUG: Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('🔍 DEBUG: Response URL:', response.url);
    
    if (!response.ok) {
      console.log('🔍 DEBUG: Response not OK, trying to parse error...');
      const errorText = await response.text();
      console.log('🔍 DEBUG: Error response text:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { detail: errorText };
      }
      
      console.log('🔍 DEBUG: Parsed error:', errorData);
      throw new Error(errorData.detail || 'Failed to analyze hashtag');
    }
    
    console.log('🔍 DEBUG: Response OK, parsing JSON...');
    const data = await response.json();
    console.log('🔍 DEBUG: Response data:', data);
    return data;
    
  } catch (error) {
    console.log('🔍 DEBUG: Fetch error caught:', error);
    console.log('🔍 DEBUG: Error message:', error.message);
    console.log('🔍 DEBUG: Error stack:', error.stack);
    throw error;
  }
};

export const healthCheck = async () => {
  console.log('🔍 DEBUG: Health check called');
  console.log('🔍 DEBUG: API_BASE_URL:', API_BASE_URL);
  console.log('🔍 DEBUG: Full URL:', `${API_BASE_URL}/health`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    
    console.log('🔍 DEBUG: Health check response status:', response.status);
    console.log('🔍 DEBUG: Health check response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('🔍 DEBUG: Health check error:', errorText);
      throw new Error(`Health check failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('🔍 DEBUG: Health check response:', data);
    return data;
    
  } catch (error) {
    console.log('🔍 DEBUG: Health check error:', error);
    throw error;
  }
};

// Add API root check
export const apiRoot = async () => {
  console.log('🔍 DEBUG: API root called');
  console.log('🔍 DEBUG: Full URL:', `${API_BASE_URL}/api`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api`, {
      method: 'GET',
    });
    
    console.log('🔍 DEBUG: API root response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('🔍 DEBUG: API root error:', errorText);
      throw new Error(`API root failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('🔍 DEBUG: API root response:', data);
    return data;
    
  } catch (error) {
    console.log('🔍 DEBUG: API root error:', error);
    throw error;
  }
};
