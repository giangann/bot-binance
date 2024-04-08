export const baseURL = "http://localhost:5000";

export type TMeta = {
  total: number;
};
export type TResponseSuccess<T> = {
  success: true;
  data: T;
  meta: TMeta;
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
  searchParams?: Record<string, string>,
  override?: string
): Promise<TResponse<T>> => {
  const queryParams = searchParams
    ? "?" + new URLSearchParams(searchParams)
    : "";
  const fullUrl = override ? override : baseURL + "/" + endpoint + queryParams;
  const respond = await fetch(fullUrl, {
    // method: "GET",
    headers: {
      // "Content-Type": "application/json",
      // apiKey:
      //   "1A0eAdDSYP6mamVZRCmc0cSt4qm4K7pwaONb55yTlIdfuHMUYmyztBZnSbZ3hPBb",
      // secret:
      //   "4wTgPjsyA9z1FIyUug81SOuTzCP5pZNyD3wHoIHpkjQ8yzoKUXgLaiV5izztl5qp",
    },
    // credentials: "include",
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
