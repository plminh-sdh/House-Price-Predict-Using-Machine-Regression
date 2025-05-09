import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  TypeNotification,
  useNotification,
} from "../../providers/NotificationProvider";
import sessionService from "@auth/services/session.service";
import { authPaths } from "@auth/enums/auth-paths";
import isErrorResponse from "@/helpers/is-error-response";
import { useErrorBoundary } from "react-error-boundary";

type Props = {
  children: JSX.Element;
};

type CustomConfig = RequestInit & {
  retry: boolean;
  headers: HeadersInit & {
    Authorization: string;
  };
};

type QueueMember = {
  resolve: (token: string) => void;
};

let isRefreshing = false;
let failedQueue: QueueMember[] = [];

const processQueue = (errorResponse?: Response, token?: string) => {
  failedQueue.forEach((prom: QueueMember) => {
    if (!errorResponse) {
      prom.resolve(token!);
    } else {
      console.error(errorResponse);
    }
  });

  failedQueue = [];
};

const clearQueue = () => {
  failedQueue = [];
};

const { fetch: originalFetch } = window;

function WithInterceptor({ children }: Props) {
  //const { setIsLoading } = useLoadingOverlay();
  const location = useLocation();
  const navigate = useNavigate();
  const { showInfo } = useNotification();

  const { showBoundary } = useErrorBoundary();

  useMemo(() => {
    window.fetch = async (...args) => {
      let [resource, config] = args;
      let response: Response;

      const user = sessionService.getCurrentUser();
      if (user) {
        config = {
          ...config,
          headers: {
            ...config?.headers,
            Authorization: "Bearer " + user.token,
          },
          redirect: "manual",
        };
      }

      try {
        response = await originalFetch(resource, config);
      } catch (error) {
        showBoundary(error);
        throw error;
      }

      if (response.status === 401) {
        if (
          user?.refreshToken &&
          !(config as CustomConfig).retry &&
          !response.url.includes("auth/refresh-token")
        ) {
          (config as CustomConfig).retry = true;
          return new Promise((resolve) => {
            failedQueue.push({ resolve });
            if (!isRefreshing) {
              isRefreshing = true;
              sessionService
                .refreshToken()
                .then((user) => {
                  processQueue(undefined, user!.token);
                })
                .finally(() => {
                  isRefreshing = false;
                });
            }
          }).then((token) => {
            (config as CustomConfig).headers.Authorization = "Bearer " + token;
            return originalFetch(resource, config);
          });
        }

        isRefreshing = false;
        clearQueue();
        sessionService
          .logOut()
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            //setIsLoading(false);
            showInfo(
              "Your session timed out.<br />Please log in to continue.",
              TypeNotification.warning,
              5000
            );
            navigate(authPaths.login, { state: { from: location } });
          });
        return new Promise(() => {});
      }

      if (response.status === 500) {
        const responseText = await response.text();
        try {
          const data = JSON.parse(responseText);
          if (isErrorResponse(data)) {
            showBoundary(data);
          }
        } catch (e) {
          showBoundary(e);
        }
        return new Promise(() => {});
      }
      return response;
    };
  }, [showBoundary, location, navigate, showInfo]);
  return children;
}

export default WithInterceptor;
