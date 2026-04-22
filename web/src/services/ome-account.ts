export const CreateMyTicketApi = async (): Promise<string> => {
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
    throw new Error("獲取票據失敗");
  }

  const data = await response.json();

  return data;
};
