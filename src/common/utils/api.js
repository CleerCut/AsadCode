"use client";

import axios from "axios";
import * as Sentry from "@sentry/nextjs";
import { enqueueSnackbar } from "notistack";
import { getAccessToken } from "./access-token.util";
import { delay } from "./generic.util";
import { removeUser } from "./users.util";

const api = (headers = null) => {
  const accessToken = getAccessToken();

  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const combinedHeaders = accessToken
    ? { ...defaultHeaders, ...headers, Authorization: `Bearer ${accessToken}` }
    : { ...defaultHeaders, ...headers };

  const apiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_MAIN_URL || "http://localhost:3000/api",
    headers: combinedHeaders,
  });

  apiInstance.interceptors.response.use(
    async (response) => {
      const method = response.config.method;
      const endpoint = response.config.url?.split("/").pop();

      const isSuccessResponse =
        (method === "get" && endpoint === "generate-otp") ||
        (["post", "patch", "delete", "put"].includes(method) &&
          !["get", "get-all"].includes(endpoint) &&
          !["/upload", "/upload/multiple"].includes(response.config.url) &&
          !response.config.url?.includes("/chat"));

      const skipToast =
        response.config.headers?.["x-skip-toast"] ?? response.config.headers?.["X-Skip-Toast"];

      if (isSuccessResponse && !skipToast) {
        enqueueSnackbar(response.data?.message || "Success", { variant: "success" });
        await delay(700);
      }

      return response;
    },
    (error) => {
      // Network issues
      if (error.message === "Network Error") {
        enqueueSnackbar(error.message, { variant: "error" });
        
        // Send to Sentry if enabled
        const sentryEnabled = process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true";
        if (sentryEnabled) {
          Sentry.captureException(error, {
            tags: {
              errorType: "network_error",
            },
            extra: {
              url: error.config?.url,
              method: error.config?.method,
            },
          });
        }
        
        throw error;
      }

      const message = error.response?.data?.message || error.message || error.toString();
      const statusCode = error.response?.status;

      const responseURL = error.request?.responseURL;

      if (responseURL?.includes("onboarding")) return null;

      // Handle unauthorized
      if (statusCode === 401) {
        removeUser();
        window.location.href = "/login";
        return;
      }

      // Send to Sentry if enabled (only for server errors 500+)
      const sentryEnabled = process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true";
      if (sentryEnabled && statusCode >= 500) {
        Sentry.captureException(error, {
          tags: {
            errorType: "api_error",
            statusCode,
          },
          extra: {
            url: error.config?.url,
            method: error.config?.method,
            message,
            responseData: error.response?.data,
          },
        });
      }

      // Handle message display
      if (Array.isArray(message)) {
        message.forEach((msg) => enqueueSnackbar(msg, { variant: "error" }));
      } else {
        if (message !== "Record Not Found") {
          enqueueSnackbar(message, { variant: "error" });
        }
      }

      return Promise.reject(error); // Reject instead of returning raw response
    }
  );

  return apiInstance;
};

export default api;
