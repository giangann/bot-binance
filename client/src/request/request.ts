export const baseURL = import.meta.env.VITE_BASE_URL;

export type TPagination = {
  currPage: number;
  prevPage: number | null;
  nextPage: number | null;
  perPage: number;
  totalPage: number;
  totalItems: number;
};
export type TResponseSuccess<T> = {
  success: true;
  data: T;
  pagi: TPagination;
};
export type TResponseFailure = {
  success: false;
  error: {
    name?: string;
    message: string;
  };
};
export type TResponse<T> = TResponseSuccess<T> | TResponseFailure;

export const getApi = async <T>(
  endpoint: string,
  searchParams?: Record<string, string>
): Promise<TResponse<T>> => {
  const queryParams = searchParams
    ? "?" + new URLSearchParams(searchParams)
    : "";
  const fullUrl = baseURL + "/" + endpoint + queryParams;
  const respond = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return respond.json();
};

export const postApi = async <T>(
  endpoint: string,
  data: any
): Promise<TResponse<T>> => {
  const fullUrl = baseURL + "/" + endpoint;
  const respond = await fetch(fullUrl, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // if don't have this, token can't be set to cookies
  });

  return respond.json();
};

export const putApi = async <T>(
  endpoint: string,
  data: any
): Promise<TResponse<T>> => {
  const fullUrl = baseURL + "/" + endpoint;
  const respond = await fetch(fullUrl, {
    method: "PUT", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // if don't have this, token can't be set to cookies
  });

  return respond.json();
};

export const deleteApi = async <T>(endpoint: string): Promise<TResponse<T>> => {
  const fullUrl = baseURL + "/" + endpoint;
  const respond = await fetch(fullUrl, {
    method: "DELETE", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // if don't have this, token can't be set to cookies
  });

  return respond.json();
};
