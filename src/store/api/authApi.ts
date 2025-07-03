// store/api/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AuthPayload {
  username: string;
  password: string;
  subdomain: string;
}

interface AuthResponse {
  token: string;
  lifetime: number;
}
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // базу переопределим в запросе
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AuthPayload>({
      query: ({ username, password, subdomain }) => ({
        url: `https://${subdomain}.ox-sys.com/security/auth_check`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: `_username=${username}&_password=${password}&_subdomain=${subdomain}`,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
