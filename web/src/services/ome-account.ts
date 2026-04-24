import message from "antd/es/message";

interface IMyTicketProps {
  ticket: string;
  expireIn: number;
}

export const CreateMyTicketApi = async (): Promise<IMyTicketProps> => {
  const settings = (window as any).appsettings;

  const token = window.__POWERED_BY_WUJIE__
    ? window.$wujie.props?.token
    : localStorage.getItem(settings?.tokenKey);

  const response = await fetch(
    `${settings.omeAccountServerUrl}/app/api/my-tickets`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      message.error("登录已过期，请重新登录", 1, () => {
        window.location.reload();
        if (window.__POWERED_BY_WUJIE__) {
          window.$wujie.props?.signOut();
        } else {
          localStorage.removeItem(settings?.tokenKey);
        }
      });
    }
    throw new Error("獲取票據失敗");
  }

  const data = await response.json();

  return data;
};
