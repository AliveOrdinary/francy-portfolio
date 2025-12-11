interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    id: string;
    username: string;
    name: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
  width: number;
  height: number;
  likes: number;
  created_at: string;
}

interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export async function fetchUserPhotos(
  username: string,
  page: number = 1,
  perPage: number = 12
): Promise<UnsplashPhoto[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('Unsplash access key is not configured');
  }

  const response = await fetch(
    `${UNSPLASH_API_URL}/users/${username}/photos?page=${page}&per_page=${perPage}&order_by=latest`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch user photos: ${response.statusText}`);
  }

  return response.json();
}

export async function searchUnsplashPhotos(
  query: string,
  page: number = 1,
  perPage: number = 12
): Promise<UnsplashSearchResponse> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('Unsplash access key is not configured');
  }

  const response = await fetch(
    `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&order_by=relevant`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to search photos: ${response.statusText}`);
  }

  return response.json();
}

export async function searchUserPhotos(
  username: string,
  query: string,
  page: number = 1,
  perPage: number = 12
): Promise<UnsplashSearchResponse> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('Unsplash access key is not configured');
  }

  const searchQuery = `${query} user:${username}`;
  const response = await fetch(
    `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&page=${page}&per_page=${perPage}&order_by=relevant`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to search user photos: ${response.statusText}`);
  }

  return response.json();
}

export async function getUnsplashPhoto(id: string): Promise<UnsplashPhoto> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('Unsplash access key is not configured');
  }

  const response = await fetch(
    `${UNSPLASH_API_URL}/photos/${id}`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch photo: ${response.statusText}`);
  }

  return response.json();
}

export type { UnsplashPhoto, UnsplashSearchResponse };