import message from "antd/es/message";
import axios from "axios";

export const api = axios.create({
  baseURL: "",
});

api.interceptors.request.use(
  (config) => {
    config.baseURL = (window as any).appsettings?.serverUrl as string;

    const tokenKey = (window as any).appsettings?.tokenKey;

    const token = localStorage.getItem(tokenKey);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      return Promise.reject(response);
    }

    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      message.error("沒權限", 1, () => {
        window.location.reload();
      });
    } else {
      // if (error) {
      //   const responseUrl = error.request.responseURL;
      //   const urlArray = [
      //     "requirement/handle/quote",
      //     "tenant/join",
      //     "/users/update",
      //   ];
      //   const parsedData = error.config.data
      //     ? JSON.parse(error.config.data)
      //     : {};
      //   const isAllowed = parsedData?.isAllowed;
      //   const errorMessage =
      //     error?.response?.data?.detail ??
      //     error?.response?.data?.title ??
      //     "Unknown error";
      //   if (
      //     !urlArray.some((url) => responseUrl.includes(url)) ||
      //     (responseUrl.includes(urlArray[0]) && !isAllowed)
      //   ) {
      //     message.error(errorMessage);
      //   }
      // }
    }

    return Promise.reject(error?.response?.data);
  }
);
