import styles from "./user-center.module.scss";
import CloseIcon from "../icons/close.svg";
import RefreshIcon from "../icons/rotate.svg";
import RtickerIcon from "../icons/sticker.svg";
import CopyIcon from "../icons/copy.svg";
import { List, ListItem } from "./ui-lib";
import { IconButton } from "./button";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import { useAccessStore } from "../store";
import { useState, useEffect } from "react";
import copy from "copy-to-clipboard";

export function UserCenterPage() {
  const goLogin = () => navigate(Path.Login);
  let [email, setEmail] = useState("");
  let [integral, setIntegral] = useState("");
  let [inviteCode, setInviteCode] = useState("");
  let [inviteRecordCount, setInviteRecordCount] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // 获取积分余额
  async function getIntegralSubmit() {
    try {
      const response = await fetch(`${serverUrl}chatAuth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: accessStore.userEmail,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.code === 200) {
          setIntegral(responseData.data);
          alert("刷新成功");
        } else {
          alert(responseData.message);
        }
      } else {
        alert("验证码请求失败！");
      }
    } catch (error) {
      alert("发生错误，请联系管理员！");
    }
  }

  // 签到
  async function signInSubmit() {
    try {
      const response = await fetch(`${serverUrl}chatAuth/checkIn`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: accessStore.userEmail,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.code === 200) {
          setIntegral(responseData.data);
          alert("签到成功");
        } else {
          alert(responseData.message);
        }
      } else {
        alert("验证码请求失败！");
      }
    } catch (error) {
      alert("发生错误，请联系管理员！");
    }
  }

  const copyInviteCode = () => {
    copy(inviteCode);
    setCopySuccess(true);

    // 隐藏复制成功提示 after 2 秒
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };
  const accessStore = useAccessStore();
  const navigate = useNavigate();
  let serverUrl = "http://127.0.0.1:81/";
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        if (!accessStore.isAuthorized()) {
          alert("未登录，请登录后操作！");
          goLogin();
          return;
        }
        const response = await fetch(`${serverUrl}chatAuth/getUserInfo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: accessStore.userEmail,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          if (responseData.code === 200) {
            setEmail(responseData.data.email); // 更新邮箱状态
            setIntegral(responseData.data.integral);
            setInviteCode(responseData.data.inviteCode);
            setInviteRecordCount(responseData.data.inviteRecordCount);
          } else {
            alert(responseData.message);
          }
        } else {
          alert("验证码请求失败！");
        }
      } catch (error) {
        alert("发生错误，请联系管理员！");
      }
    }

    fetchUserInfo();
  }, [accessStore.userEmail, serverUrl]);

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">个人中心</div>
        </div>
        <div className="window-actions">
          <div className="window-action-button"></div>
          <div className="window-action-button"></div>
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
            />
          </div>
        </div>
      </div>
      <div className={styles["settings"]}>
        <List>
          <ListItem className={styles["listitem"]} title="邮箱">
            <a href="#/login">
              <p>切换账号</p>
            </a>
          </ListItem>
          <ListItem
            className={styles["listitem_value"]}
            title={email}
          ></ListItem>
        </List>

        <List>
          <ListItem className={styles["listitem"]} title="积分余额">
            <IconButton
              icon={<RefreshIcon />}
              text="刷新"
              onClick={getIntegralSubmit}
            />
          </ListItem>
          <ListItem className={styles["listitem_value"]} title={integral}>
            <div className={styles["iconButton_SignIn"]}>
              <IconButton
                className={styles["iconButton_SignIn"]}
                icon={<RtickerIcon />}
                text="签到"
                onClick={signInSubmit}
              />
            </div>
          </ListItem>
        </List>

        <List>
          <ListItem className={styles["listitem"]} title="邀请码"></ListItem>
          <ListItem className={styles["listitem_value"]} title={inviteCode}>
            <IconButton
              className={styles["iconButton_SignIn"]}
              icon={<CopyIcon />}
              text="复制"
              onClick={copyInviteCode}
            />
          </ListItem>
        </List>

        <List>
          <ListItem
            className={styles["listitem"]}
            title="成功邀请人数"
          ></ListItem>
          <ListItem
            className={styles["listitem_value"]}
            title={inviteRecordCount}
          ></ListItem>
        </List>
        {/* <List>
          <ListItem className={styles["listitem"]} title="邀请链接"></ListItem>
          <ListItem className={styles["listitem_value"]} title="11">
            <IconButton
              className={styles["iconButton_SignIn"]}
              icon={<CopyIcon />}
              text="复制"
              onClick={copySubmit}
            />
          </ListItem>
        </List> */}
      </div>
    </ErrorBoundary>
  );
}
