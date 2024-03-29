import { KeyOutlined, LogoutOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Input, Menu, MenuProps, Modal } from "antd";
import { Link, Outlet } from "react-router-dom";

import KEYS from "@/i18n/keys/main-page";

import { useAction } from "./hook";

type MenuItem = Required<MenuProps>["items"][number];

export const Main = () => {
  const {
    t,
    status,
    location,
    openKeys,
    language,
    collapsed,
    passwordDto,
    selectedKeys,
    handleOnJump,
    languageStatus,
    delModalStatus,
    handleOnSignOut,
    navigate,
    setStatus,
    setOpenKeys,
    updatePWDto,
    changeLanguage,
    setSelectedKeys,
    filterSelectKey,
    setLanguageStatus,
    setDelModalStatus,
    submitModifyPassword,
  } = useAction();

  const items: MenuItem[] = [
    {
      key: "/home",
      label: <Link to="/home">{t(KEYS.HOME, { ns: "main" })}</Link>,
      icon: (
        <div className="h-full">
          <img
            src={
              selectedKeys[0] === "/home"
                ? "/src/assets/home_click.png"
                : "/src/assets/home.png"
            }
            alt=""
            className="w-4 h-4 md:w-6 md:h-6"
          />
        </div>
      ),
    },
    {
      key: "/monitor",
      label: (
        <Link to="/monitor/list">
          {t(KEYS.REALTIME_MONITORING, { ns: "main" })}
        </Link>
      ),
      icon: (
        <div className="h-full">
          <img
            src={
              selectedKeys[0] === "/monitor"
                ? "/src/assets/monitoring_click.png"
                : "/src/assets/monitoring.png"
            }
            alt=""
            className="w-4 h-4 md:w-6 md:h-6"
          />
        </div>
      ),
    },
    {
      key: "/replay",
      label: (
        <Link to="/replay/list">{t(KEYS.VIDEO_REPLAY, { ns: "main" })}</Link>
      ),
      icon: (
        <div className="h-full">
          <img
            src={
              selectedKeys[0] === "/replay"
                ? "/src/assets/replay_click.png"
                : "/src/assets/replay.png"
            }
            alt=""
            className="w-4 h-4 md:w-6 md:h-6"
          />
        </div>
      ),
    },
    {
      key: "/monitor-summary",
      label: t(KEYS.MONITORING_SUMMARY, { ns: "main" }),
      icon: (
        <div className="h-full">
          <img
            src={
              selectedKeys[0] === "/warning" || selectedKeys[0] === "/feedback"
                ? "/src/assets/monitoring_summary_click.png"
                : "/src/assets/monitoring_summary.png"
            }
            alt=""
            className="w-4 h-4 md:w-6 md:h-6"
          />
        </div>
      ),
      children: [
        {
          key: "/warning",
          label: (
            <Link to="/warning/list">
              {t(KEYS.WARNING_LIST, { ns: "main" })}
            </Link>
          ),
          icon: !collapsed ? (
            <div className="h-full bg-[#E9EDF2] py-2">
              {selectedKeys[0] === "/warning" && (
                <div className="w-full h-full relative flex items-center justify-center">
                  <div className="h-full w-[0.125rem] bg-[#2866F1] absolute" />
                  <div className="w-[0.375rem] h-[0.375rem] bg-[#2866F1] absolute rounded-full" />
                </div>
              )}
            </div>
          ) : (
            <></>
          ),
        },
        {
          key: "/feedback",
          label: (
            <Link to="/feedback/list">
              {t(KEYS.FEEDBACK_LIST, { ns: "main" })}
            </Link>
          ),
          icon: !collapsed ? (
            <div className="h-full bg-[#E9EDF2] py-2">
              {selectedKeys[0] === "/feedback" && (
                <div className="w-full h-full relative flex items-center justify-center">
                  <div className="h-full w-[0.125rem] bg-[#2866F1] absolute" />
                  <div className="w-[0.375rem] h-[0.375rem] bg-[#2866F1] absolute rounded-full" />
                </div>
              )}
            </div>
          ) : (
            <></>
          ),
        },
      ],
    },
  ];

  return (
    <div className="h-screen w-screen bg-white flex flex-col ">
      <div
        className="px-8 h-16 min-h-16 flex justify-between items-center border border-solid bg-[#F7FAFC]"
        id="header"
      >
        <div className="flex space-x-2 items-center select-none">
          <div className="rounded-full w-7 h-7 bg-[#2866F1]" />
          <strong>CAMERA AI CENTER</strong>
        </div>
        <div className="flex items-center h-full">
          <div
            className="flex items-center space-x-1 select-none cursor-pointer relative py-3"
            onMouseEnter={() => setLanguageStatus(true)}
            onMouseLeave={() => setLanguageStatus(false)}
          >
            <img
              src="/src/assets/slice.png"
              className="w-4 h-4 select-none img-no-darg"
            />
            <span className="text-sm select-none w-14 hidden sm:block">
              {language === "en"
                ? t(KEYS.EN_LONG, { ns: "main" })
                : language === "ch"
                ? t(KEYS.ZH_LONG, { ns: "main" })
                : ""}
            </span>

            <span className="text-sm select-none w-10 block sm:hidden">
              {language === "en"
                ? t(KEYS.EN_SHORT, { ns: "main" })
                : language === "ch"
                ? t(KEYS.ZH_SHORT, { ns: "main" })
                : ""}
            </span>
            {languageStatus && (
              <div className="absolute w-32 -left-[25%] top-8 z-[1051] rounded-lg p-2 space-y-2 bg-white">
                {[
                  {
                    name: "中文繁体",
                    function: () => changeLanguage("ch"),
                  },
                  {
                    name: "English",
                    function: () => changeLanguage("en"),
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="h-9 flex items-center justify-center space-x-2 bg-white hover:bg-[#EBF1FF] hover:text-[#2866F1] rounded-lg cursor-pointer select-none"
                    onClick={() => {
                      item.function();
                      setLanguageStatus(false);
                    }}
                  >
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <img
            src="/src/assets/notification.png"
            className="w-6 h-6 select-none img-no-darg mx-6 cursor-pointer"
            onClick={() => handleOnJump()}
          />

          <div className="flex h-full items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-2">
              <img
                src="/src/assets/ai.jpg"
                alt=""
                className="w-full h-full object-fill select-none img-no-darg"
              />
            </div>

            <div
              className="relative py-4"
              onMouseEnter={() => setStatus(true)}
              onMouseLeave={() => setStatus(false)}
            >
              <div className="flex relative items-center space-x-1 cursor-pointer w-[5.5rem] justify-center">
                <div className="text-sm relative select-none w-16 text-center truncate">
                  {/* {userName} */}
                  123
                </div>
                <img
                  src="/src/assets/chevronDown.png"
                  alt=""
                  className="w-4 h-4 select-none img-no-darg"
                />
              </div>
              {status && (
                <div className="absolute w-32 -left-[25%] z-[1051] mt-3 rounded-lg p-2 space-y-2 bg-white">
                  {[
                    {
                      name: "切換後台",
                      component: <SwapOutlined className="text-sm" />,
                      function: () => {
                        var myIframe = document.getElementById("myIframe");
                        if (myIframe) {
                          const token = localStorage.getItem(
                            (window as any).appsettings?.tokenKey
                          );
                          (myIframe as any).contentWindow.postMessage(
                            token,
                            (window as any).appsettings?.cameraAIBackstageDomain
                          );
                          window.open(
                            (window as any).appsettings
                              ?.cameraAIBackstageDomain,
                            "_blank"
                          );
                        }
                      },
                    },
                    {
                      name: "修改密碼",
                      component: <KeyOutlined className="text-sm" />,
                      function: () => {
                        !delModalStatus && setDelModalStatus(true);
                        setStatus(false);
                      },
                    },
                    {
                      name: "退出登陸",
                      component: <LogoutOutlined className="text-sm" />,
                      function: () => {
                        handleOnSignOut(() => navigate("/login"));
                      },
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="h-9 flex items-center justify-center space-x-2 bg-white hover:bg-[#EBF1FF] hover:text-[#2866F1] rounded-lg cursor-pointer select-none"
                      onClick={item.function}
                    >
                      {item.component}
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <iframe
                id="myIframe"
                src={(window as any).appsettings?.cameraAIBackstageDomain}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="grow flex overflow-hidden">
        {location.pathname !== "/none" && (
          <div
            className={`overflow-y-auto no-scrollbar box-border py-12 ${
              !collapsed && "!min-w-60 w-60"
            }`}
          >
            <Menu
              className="select-none"
              mode="inline"
              items={items}
              openKeys={openKeys}
              selectedKeys={selectedKeys}
              onSelect={(e) => {
                setSelectedKeys(e.selectedKeys);
                filterSelectKey(e.selectedKeys[0]);
              }}
              onOpenChange={(e) => {
                setOpenKeys([e[e.length > 0 ? e.length - 1 : 0]]);
              }}
              inlineCollapsed={collapsed}
            />
          </div>
        )}

        <div className="w-[calc(100%-15rem)] flex-1 bg-[#F5F7FB] p-1">
          <Outlet />
        </div>
      </main>

      <Modal
        className="abc"
        title={<div className="pl-8 select-none">修改密碼</div>}
        open={delModalStatus}
        footer={
          <div className="flex flex-row justify-end space-x-2 px-8 box-border">
            <Button
              className="rounded-[56px] bg-[#E6EAF4] text-[#8B98AD] hover:!text-[#8B98AD] hover:!border-[#E6EAF4]"
              onClick={() => setDelModalStatus(false)}
            >
              取消
            </Button>
            <Button
              className="rounded-[56px] bg-[#2866F1] text-white hover:!text-white"
              onClick={() => submitModifyPassword()}
            >
              确认
            </Button>
          </div>
        }
        centered
        destroyOnClose
        width={680}
        maskClosable={false}
        onCancel={() => setDelModalStatus(false)}
      >
        <ConfigProvider
          theme={{
            components: {
              Input: {
                activeBorderColor: "#d9d9d9",
                hoverBorderColor: "#d9d9d9",
              },
            },
          }}
        >
          <div className="item">
            <div className="flex-1 flex space-x-4 items-center">
              <span className="w-16 text-base select-none">當前密碼</span>
              <div className="flex-1">
                <Input.Password
                  className="border-[#d9d9d9] focus:!border-[#d9d9d9] active:!border-[#d9d9d9] hover:!border-[#d9d9d9]"
                  size="large"
                  placeholder="請輸入"
                  value={passwordDto.currentPW}
                  onChange={(e) => updatePWDto("currentPW", e.target.value)}
                />
              </div>
            </div>
            {/* error */}
            {/* <div className="pl-20">123</div> */}
          </div>
          <div className="item flex items-center space-x-4">
            <span className="w-16 text-base select-none">新密碼</span>

            <div className="flex-1">
              <ConfigProvider
                theme={{
                  components: {
                    Input: {
                      activeBorderColor: "#d9d9d9",
                      hoverBorderColor: "#d9d9d9",
                    },
                  },
                }}
              >
                <Input.Password
                  className="border-[#d9d9d9] focus:!border-[#d9d9d9] active:!border-[#d9d9d9] hover:!border-[#d9d9d9]"
                  size="large"
                  placeholder="請輸入"
                  value={passwordDto.newPW}
                  onChange={(e) => updatePWDto("newPW", e.target.value)}
                />
              </ConfigProvider>
            </div>
          </div>
          <div className="item flex items-center space-x-4">
            <span className="w-16 text-base select-none">確認密碼</span>

            <div className="flex-1">
              <Input.Password
                className="border-[#d9d9d9] focus:!border-[#d9d9d9] active:!border-[#d9d9d9] hover:!border-[#d9d9d9]"
                size="large"
                placeholder="請輸入"
                value={passwordDto.confirmPW}
                onChange={(e) => updatePWDto("confirmPW", e.target.value)}
              />
            </div>
          </div>
        </ConfigProvider>
      </Modal>
    </div>
  );
};
