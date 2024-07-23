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
    if (response.status !== 200 || response.data.code !== 200) {
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

export async function Get<T>(url: string) {
  return base<T>(url, "get");
}

export async function Post<T>(url: string, data?: object | FormData) {
  return base<T>(url, "post", data);
}

export interface IResponse<T> {
  code: ResponseCode;
  msg: string;
  data: T;
}

export enum ResponseCode {
  Ok = 200,
  Unauthorized = 401,
  InternalServerError = 500,
}

export async function base<T>(
  url: string,
  method: "get" | "post",
  data?: object | FormData
) {
  const settings = (window as any).appsettings;
  const headers: { Authorization: string; "Content-Type"?: string } = {
    Authorization:
      "Bearer " +
      (localStorage.getItem("token")
        ? (localStorage.getItem("token") as string)
        : ""),
  };
  const isFormData = data instanceof FormData;
  if (!isFormData) headers["Content-Type"] = "application/json";
  const body = isFormData ? data : JSON.stringify(data);

  return await fetch(`${settings.serverUrl}${url}`, {
    method: method,
    body: body,
    headers: headers,
    keepalive: true,
  })
    .then((res) => res.json())
    .then((res: IResponse<T>) => {
      if (res.code === ResponseCode.Ok) {
        return res.data;
      } else {
        throw new Error(res.msg);
      }
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}
