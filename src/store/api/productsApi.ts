// store/api/productApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("Accept", "application/json");
        headers.set("Content-Type", "application/json");
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<
      any,
      { page: number; size: number; subdomain: string }
    >({
      query: ({ page, size, subdomain }) =>
        `https://${subdomain}.ox-sys.com/variations?page=${page}&size=${size}`,
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
