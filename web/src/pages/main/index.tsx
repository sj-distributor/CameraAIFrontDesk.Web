import {
  DeleteOutlined,
  LoadingOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  ConfigProvider,
  Input,
  Menu,
  MenuProps,
  Modal,
  Popover,
  Image,
  Tooltip,
  Spin,
  message,
} from "antd";
import { useMemo } from "react";
import { Link, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";
import KEYS from "@/i18n/keys/main-page";

import chevronDownImg from "../../assets/chevronDown.png";
import homeImg from "../../assets/home.png";
import home_clickImg from "../../assets/home_click.png";
import monitoringImg from "../../assets/monitoring.png";
import monitoring_clickImg from "../../assets/monitoring_click.png";
import monitoring_summaryImg from "../../assets/monitoring_summary.png";
import monitoring_summary_clickImg from "../../assets/monitoring_summary_click.png";
import notificationImg from "../../assets/notification.png";
import replayImg from "../../assets/replay.png";
import replay_clickImg from "../../assets/replay_click.png";
import sliceImg from "../../assets/slice.png";
import { useAction } from "./hook";
import {
  AddTeamIcon,
  ArrowRightIcon,
  CloseNewTeamIcon,
  LogoutIcon,
  PreviewAndAcceptIcon,
  RefreshIcon,
  SelectedIcon,
  UpoadLogoIcon,
  UserArrowRightIcon,
} from "@/icon/main";

import Dropzone from "react-dropzone";
import { isEmpty } from "ramda";

type MenuItem = Required<MenuProps>["items"][number];

export const Main = () => {
  const { isGetPermission } = useAuth();

  const {
    t,
    status,
    location,
    openKeys,
    userName,
    language,
    collapsed,
    selectedKeys,
    handleOnJump,
    languageStatus,
    handleOnSignOut,
    pagePermission,
    handleJumpToBackstage,
    addTeamData,
    acceptWarnData,
    errorMessages,
    onAddTeamDebounceFn,
    onAcceptWarnDebounceFn,
    teamList,
    newTeamDto,
    acceptWarnDto,
    currentTeam,
    defaultNavigatePage,
    originAcceptWarnData,
    initAcceptWarn,
    updateAcceptWarnDto,
    updateNewTeamDto,
    updateErrorMessage,
    updateAcceptWarnData,
    updateAddTeamData,
    navigate,
    setStatus,
    setOpenKeys,
    changeLanguage,
    setSelectedKeys,
    filterSelectKey,
    setLanguageStatus,
    onUpload,
    validateFn,
    setCurrentTeam,
    setIsGetPermission,
    setAcceptWarnData,
    setErrorMessages,
    getUserNotification,
  } = useAction();

  const items: MenuItem[] = useMemo(() => {
    const defaultItems = [
      {
        key: "/home",
        label: <Link to="/home">{t(KEYS.HOME, { ns: "main" })}</Link>,
        icon: (
          <div className="h-full">
            <img
              src={selectedKeys[0] === "/home" ? home_clickImg : homeImg}
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
                  ? monitoring_clickImg
                  : monitoringImg
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
              src={selectedKeys[0] === "/replay" ? replay_clickImg : replayImg}
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
                selectedKeys[0] === "/warning" ||
                selectedKeys[0] === "/feedback"
                  ? monitoring_summary_clickImg
                  : monitoring_summaryImg
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
              <div className="h-full bg-[#E9EDF2] py-2 navigationIconBox">
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
              <div className="h-full bg-[#E9EDF2] py-2 navigationIconBox">
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
          // {
          //   key: "/access",
          //   label: <Link to="/access">出入口檢測</Link>,
          //   icon: !collapsed ? (
          //     <div className="h-full bg-[#E9EDF2] py-2 navigationIconBox">
          //       {selectedKeys[0] === "/access" && (
          //         <div className="w-full h-full relative flex items-center justify-center">
          //           <div className="h-full w-[0.125rem] bg-[#2866F1] absolute" />
          //           <div className="w-[0.375rem] h-[0.375rem] bg-[#2866F1] absolute rounded-full" />
          //         </div>
          //       )}
          //     </div>
          //   ) : (
          //     <></>
          //   ),
          // },
          // {
          //   key: "/inout",
          //   label: <Link to="/inout">进出登记</Link>,
          //   icon: !collapsed ? (
          //     <div className="h-full bg-[#E9EDF2] py-2 navigationIconBox">
          //       {selectedKeys[0] === "/inout" && (
          //         <div className="w-full h-full relative flex items-center justify-center">
          //           <div className="h-full w-[0.125rem] bg-[#2866F1] absolute" />
          //           <div className="w-[0.375rem] h-[0.375rem] bg-[#2866F1] absolute rounded-full" />
          //         </div>
          //       )}
          //     </div>
          //   ) : (
          //     <></>
          //   ),
          // },
        ],
      },
    ];

    const filteredItems = defaultItems.filter((item) => {
      if (item.key === "/home") {
        return pagePermission ? pagePermission["canViewHome"] : false;
      } else if (item.key === "/monitor") {
        return pagePermission ? pagePermission["canViewMonitor"] : false;
      } else if (item.key === "/replay") {
        return pagePermission ? pagePermission["canViewReplay"] : false;
      } else if (item.key === "/monitoring-summary") {
        return (
          (pagePermission ? pagePermission["canViewWarning"] : false) ||
          (pagePermission ? pagePermission["canViewFeedback"] : false)
        );
      } else {
        return true;
      }
    });

    filteredItems.forEach((item) => {
      if (item.children) {
        item.children = item.children.filter((child) => {
          if (child.key === "/warning") {
            return pagePermission ? pagePermission["canViewWarning"] : false;
          } else if (child.key === "/feedback") {
            return pagePermission ? pagePermission["canViewFeedback"] : false;
          } else {
            return true;
          }
        });
      }
    });

    // 过滤掉 children 是空数组的项
    const filteredItems1 = filteredItems.filter((item) => {
      return !(item.children && item.children.length === 0);
    });

    return filteredItems1;
  }, [pagePermission, location.pathname, selectedKeys, t]);

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
            <img src={sliceImg} className="w-4 h-4 select-none img-no-darg" />
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
            src={notificationImg}
            className="w-6 h-6 select-none img-no-darg mx-6 cursor-pointer"
            onClick={() => handleOnJump()}
          />

          <div className="flex h-full items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-2">
              <Avatar
                style={{
                  backgroundColor: "#2853E4",
                  verticalAlign: "middle",
                }}
                size="default"
              >
                {window.__POWERED_BY_WUJIE__
                  ? window.$wujie.props?.userName?.charAt(0)
                  : userName.charAt(0)}
              </Avatar>
            </div>

            <div
              className="relative py-4"
              onMouseEnter={() => setStatus(true)}
              onMouseLeave={() => setStatus(false)}
            >
              <div className="flex relative items-center space-x-1 cursor-pointer w-[5.5rem] justify-center">
                <div className="text-sm relative select-none w-16 text-center truncate">
                  {window.__POWERED_BY_WUJIE__
                    ? window.$wujie.props?.userName
                    : userName}
                </div>
                <img
                  src={chevronDownImg}
                  alt=""
                  className="w-4 h-4 select-none img-no-darg"
                />
              </div>
              {status && (
                <div className="absolute w-[14.8rem] -right-5 z-[1051] mt-3 rounded-lg p-4 space-y-2 bg-white">
                  <div className="flex border-b pb-4">
                    <Avatar
                      style={{
                        backgroundColor: "#2853E4",
                        verticalAlign: "middle",
                      }}
                      size="large"
                    >
                      {window.__POWERED_BY_WUJIE__
                        ? window.$wujie.props?.userName?.charAt(0)
                        : userName.charAt(0)}
                    </Avatar>

                    <div className="flex flex-col w-36 ml-2">
                      <div className="text-lg font-semibold relative select-none w-16 text-center">
                        {window.__POWERED_BY_WUJIE__
                          ? window.$wujie.props?.userName
                          : userName}
                      </div>
                      <div className="flex flex-wrap text-[#8B98AD] text-[0.88rem] mt-1">
                        {currentTeam.name}
                      </div>
                    </div>
                  </div>

                  <div>
                    {[
                      {
                        name: "切換後台",
                        component: <SwapOutlined className="text-sm" />,
                        function: () => {
                          handleJumpToBackstage();
                        },
                      },
                      {
                        name: "預警接收",
                        component: <PreviewAndAcceptIcon />,
                        function: () => {
                          getUserNotification();

                          updateAcceptWarnDto("openAcceptWran", true);
                        },
                      },
                      {
                        name: "退出登陸",
                        component: <LogoutIcon />,
                        function: () => {
                          if (window.__POWERED_BY_WUJIE__) {
                            window.$wujie.props?.signOut();
                          } else {
                            handleOnSignOut(() => navigate("/login"));
                          }
                        },
                      },
                    ]
                      .filter(
                        (item) =>
                          !(
                            userName.toLowerCase() === "admin" &&
                            item.name === "預警接收"
                          )
                      )
                      .map((item, index) => (
                        <div
                          key={index}
                          className="h-9 flex items-center space-x-2 bg-white hover:bg-[#EBF1FF] hover:text-[#2866F1] rounded-lg cursor-pointer select-none pl-2 dropdown"
                          onClick={item.function}
                        >
                          {item.component}
                          <span className="text-sm">{item.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="grow flex overflow-hidden">
        <div
          className={`h-full overflow-y-auto no-scrollbar box-border pt-12 flex flex-col justify-between ${
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

          <div>
            {
              <Popover
                className="cursor-pointer"
                placement="right"
                arrow={false}
                content={
                  <div className="flex flex-col w-[10rem] teamList">
                    <div className="max-h-72 overflow-y-auto">
                      {teamList.map((item, index) => {
                        return (
                          <div
                            className={`hover:text-[#2866F1] text-[0.88rem] flex flex-row justify-between items-center cursor-pointer p-2 rounded-lg mb-1 ${
                              item.id === currentTeam.id &&
                              "text-[#2866F1] bg-[#EBF1FF]"
                            }`}
                            onClick={() => {
                              if (
                                item.id !== currentTeam.id &&
                                defaultNavigatePage
                              ) {
                                setCurrentTeam(item);

                                setIsGetPermission(false);

                                message.info(
                                  `即将切换到 ${item.name} ......`,
                                  0
                                );

                                const interval = setInterval(() => {
                                  if (isGetPermission) {
                                    clearInterval(interval);
                                    message.destroy();
                                    navigate(defaultNavigatePage, {
                                      replace: true,
                                    });
                                  }
                                }, 100);
                              }
                            }}
                            key={index}
                          >
                            <div className="flex">
                              <Avatar size="small" src={item.avatarUrl} />
                              <Tooltip
                                title={item?.name}
                                placement="rightTop"
                                arrow={false}
                                color="#F5F7FB"
                                overlayStyle={{
                                  paddingLeft: "1rem",
                                  paddingRight: "1rem",
                                }}
                                overlayInnerStyle={{ color: "#18283C" }}
                              >
                                <div className="w-[5.5rem] ml-[0.75rem] line-clamp-1">
                                  {item?.name}
                                </div>
                              </Tooltip>
                            </div>
                            {item.id === currentTeam.id && <SelectedIcon />}
                          </div>
                        );
                      })}
                    </div>
                    {/* 有团队：有权限才可以创建
                    无团队：不需要权限也可以创建 */}
                    {(pagePermission.canCreateCameraAiTeam ||
                      isEmpty(teamList)) && (
                      <div
                        className="text-[#5F6279] text-[0.88rem] flex items-center cursor-pointer border-t p-2 mt-6"
                        onClick={() => updateNewTeamDto("openNewTeam", true)}
                      >
                        <AddTeamIcon />
                        <span className="ml-1">創建新團隊</span>
                      </div>
                    )}
                  </div>
                }
              >
                <div className="flex items-center justify-between mx-4 border-t py-6 mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3">
                      <Avatar size="default" src={currentTeam.avatarUrl} />
                    </div>
                    <div className="text-base font-semibold text-[#18283C] line-clamp-1 w-[8.5rem]">
                      {!isEmpty(teamList) ? currentTeam?.name : "暫無團隊"}
                    </div>
                  </div>
                  <UserArrowRightIcon />
                </div>
              </Popover>
            }
          </div>
        </div>

        <div className="w-[calc(100%-15rem)] flex-1 bg-[#F5F7FB] p-1">
          {isGetPermission ? (
            <>
              {!isEmpty(teamList) ? (
                <Outlet />
              ) : (
                <div className="h-full flex justify-center items-center">
                  {/* 缺个无团队图标 */}
                  <div className="flex items-center text-base">
                    暫無團隊,
                    <div
                      className="flex border-b m-1 border-[#2866F1] cursor-pointer"
                      onClick={() => updateNewTeamDto("openNewTeam", true)}
                    >
                      <span className="text-[#2866F1]">創建一個</span>

                      <ArrowRightIcon />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Spin
              className="h-screen flex items-center justify-center"
              size="large"
            />
          )}
        </div>
      </main>

      <Modal
        className="newTeamModel"
        title={<div className="select-none">創建新團隊</div>}
        open={newTeamDto.openNewTeam}
        closeIcon={<CloseNewTeamIcon />}
        footer={
          <div className="flex flex-row justify-end box-border border-t py-4 pr-8">
            <Button
              className={`rounded-[3.5rem] py-2 px-4 bg-[#2866F1] text-white text-xs ${
                addTeamData.avatarUrl &&
                addTeamData?.name &&
                "hover:!bg-[#2866F1] hover:!text-white"
              }`}
              onClick={onAddTeamDebounceFn}
              loading={newTeamDto.addTeamLoading}
              disabled={!addTeamData.avatarUrl || !addTeamData?.name}
            >
              創建團隊
            </Button>
          </div>
        }
        centered
        width={680}
        onCancel={() => updateNewTeamDto("openNewTeam", false)}
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
          <div className="mx-32 my-8">
            <div className="flex items-center">
              <div className="min-w-16 flex justify-end mr-4 text-[#18283C] mb-10">
                LOGO
              </div>
              {addTeamData?.avatarUrl ? (
                <>
                  <Image
                    src={addTeamData?.avatarUrl}
                    className="bg-center bg-no-repeat bg-cover object-cover w-[5.5rem] h-[5.5rem]"
                    preview={true}
                    width={100}
                    height={100}
                  />
                  <DeleteOutlined
                    className="text-gray-400 ml-3 cursor-pointer"
                    onClick={() => updateAddTeamData("avatarUrl", "")}
                  />
                </>
              ) : (
                <Dropzone
                  onDrop={onUpload}
                  accept={{
                    "image/png": [],
                    "image/jpeg": [],
                    "image/jpg": [],
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps({
                        className: "dropzone",
                      })}
                      className="w-[5rem]"
                    >
                      <input {...getInputProps()} />
                      <div className="w-[5.5rem] h-[5.5rem] flex flex-col justify-center items-center border border-dashed rounded-lg cursor-pointer">
                        <>
                          {newTeamDto.isUploading ? (
                            <LoadingOutlined />
                          ) : (
                            <>
                              <UpoadLogoIcon />
                              <span className="text-[#8B98AD] text-[0.75rem] mt-2">
                                上傳圖片
                              </span>
                            </>
                          )}
                        </>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            </div>
            <div className="flex items-center mt-6">
              <div className="min-w-16 flex justify-end mr-4">團隊名稱</div>
              <Input
                placeholder="請輸入團隊名稱"
                className="w-[21.56rem] py-2"
                value={addTeamData.name}
                onChange={(e) => updateAddTeamData("name", e.target.value)}
              />
            </div>
          </div>
        </ConfigProvider>
      </Modal>

      <Modal
        className="newTeamModel"
        title={<div className="select-none">預警接收</div>}
        open={acceptWarnDto.openAcceptWran}
        closeIcon={<CloseNewTeamIcon />}
        footer={
          <div className="flex flex-row justify-end box-border border-t py-4 pr-8">
            <Button
              className={`rounded-[3.5rem] py-2 px-4 bg-[#2866F1] text-white text-xs ${
                isEmpty(errorMessages.workWechat) &&
                isEmpty(errorMessages.phone) &&
                isEmpty(errorMessages.email) &&
                "hover:!bg-[#2866F1] hover:!text-white"
              }`}
              onClick={onAcceptWarnDebounceFn}
              loading={acceptWarnDto.acceptWarnLoading}
              disabled={
                !isEmpty(errorMessages.workWechat) ||
                !isEmpty(errorMessages.phone) ||
                !isEmpty(errorMessages.email)
              }
            >
              保存
            </Button>
          </div>
        }
        centered
        width={680}
        onCancel={() => {
          updateAcceptWarnDto("openAcceptWran", false);
          setAcceptWarnData(originAcceptWarnData);
          setErrorMessages(initAcceptWarn);
        }}
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
          <div className="ml-8 my-8">
            <div>
              <div className="flex items-center">
                <div className="min-w-24 flex justify-end">通知電話</div>
                <Input
                  className="w-[21.56rem] mx-4 py-2"
                  value={acceptWarnData.phone}
                  onChange={(e) => {
                    updateAcceptWarnData("phone", e.target.value);
                    validateFn("phone", e.target.value);
                  }}
                />
                <div
                  className="text-[#2866F1] text-sm flex items-center cursor-pointer"
                  onClick={() => {
                    updateAcceptWarnData("phone", originAcceptWarnData.phone);
                    updateErrorMessage("phone", "");
                  }}
                >
                  <RefreshIcon /> 恢復默認
                </div>
              </div>

              <div
                className={`${
                  errorMessages.phone ? "text-[#FF706C]" : "text-[#8B98AD]"
                } text-sm mt-1 ml-[7.5rem]`}
              >
                {errorMessages.phone ||
                  "如沒有設置通知電話，默認使用用戶信息的電話"}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <div className="min-w-24 flex justify-end">通知企業微信</div>
                <Input
                  className="w-[21.56rem] py-2 mx-4"
                  value={acceptWarnData.workWechat}
                  onChange={(e) => {
                    updateAcceptWarnData("workWechat", e.target.value);

                    validateFn("workWechat", e.target.value);
                  }}
                />
                <div
                  className="text-[#2866F1] text-sm flex items-center cursor-pointer"
                  onClick={() => {
                    updateAcceptWarnData(
                      "workWechat",
                      originAcceptWarnData.workWechat
                    );
                    updateErrorMessage("workWechat", "");
                  }}
                >
                  <RefreshIcon /> 恢復默認
                </div>
              </div>

              <div
                className={`${
                  errorMessages.workWechat ? "text-[#FF706C]" : "text-[#8B98AD]"
                } text-sm mt-1 ml-[7.5rem]`}
              >
                {errorMessages.workWechat ||
                  "如沒有設置通知企業微信，默認使用用戶信息的企業微信"}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <div className="min-w-24 flex justify-end">通知郵箱</div>
                <Input
                  className="w-[21.56rem] py-2 mx-4"
                  value={acceptWarnData.email}
                  onChange={(e) => {
                    updateAcceptWarnData("email", e.target.value);
                    validateFn("email", e.target.value);
                  }}
                />
                <div
                  className="text-[#2866F1] text-sm flex items-center cursor-pointer"
                  onClick={() => {
                    updateAcceptWarnData("email", originAcceptWarnData.email);
                    updateErrorMessage("email", "");
                  }}
                >
                  <RefreshIcon /> 恢復默認
                </div>
              </div>

              <div
                className={`${
                  errorMessages.email ? "text-[#FF706C]" : "text-[#8B98AD]"
                } text-sm mt-1 ml-[7.5rem]`}
              >
                {errorMessages.email ||
                  "如沒有設置通知郵箱，默認使用用戶信息的關聯郵箱"}
              </div>
            </div>
          </div>
        </ConfigProvider>
      </Modal>
    </div>
  );
};
