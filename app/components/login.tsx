import { useState, useEffect } from "react";

import styles from "./login.module.scss";
import CloseIcon from "../icons/close.svg";
import { IconButton } from "./button";
import { useAccessStore } from "../store";
import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { Link, useNavigate } from "react-router-dom";
const DEFAULT_SERVER_USR = "http://127.0.0.1:81/";
const SERVER_USR = process.env.SERVER_USR || DEFAULT_SERVER_USR;
const DEFAULT_CODE = "chatGPT-PLUS";
const CODE = process.env.CODE || DEFAULT_CODE;

export function Login() {
  const goHome = () => navigate(Path.Home);
  const access = useAccessStore();
  let serverUrl = SERVER_USR;
  const navigate = useNavigate();

  let code = CODE;

  let [inputEmailValue, setInputEmailValue] = useState("");
  const handleInputEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputEmailValue(event.target.value);
  };

  let [inputPasswordValue, setInputPasswordValue] = useState("");
  const handleInputPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputPasswordValue(event.target.value);
  };

  // 邮箱 |
  async function emailLoginSubmit() {
    try {
      console.log(SERVER_USR);
      console.log(serverUrl);
      const response = await fetch(`${serverUrl}chatAuth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputEmailValue,
          password: inputPasswordValue,
        }),
      });

      if (response.ok) {
        // 处理成功的情况
        console.error("验证码请求成功！");
        const responseData = await response.json();
        console.error("返回的数据：", responseData); // 在这里打印返回的数据
        if (responseData.code == 200) {
          access.updateCode(code);
          access.updateUserEmail(inputEmailValue);
          goHome();
        } else {
          alert(responseData.message);
        }
        return;
      } else {
        alert("验证码请求失败！");
        return;
      }
    } catch (error) {
      alert("发生错误，请联系管理员！");
      return;
    }
  }

  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(Path.Home);
      }
    };
    document.addEventListener("keydown", keydownEvent);
    return () => {
      document.removeEventListener("keydown", keydownEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <div className={styles["window-header"]}>
        <div className={styles["window-header-title"]}>
          <div className={styles["window-header-main-title"]}>登录注册</div>
          <div className={styles["window-header-sub-title"]}>登录</div>
        </div>
        <div className={styles["window-actions"]}>
          <div className={styles["window-action-button"]}>
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.Settings.Actions.Close}
            />
          </div>
        </div>
      </div>
      <div className={styles["settings"]}>
        <div className={styles["settings-item"]}>
          <label>邮箱：</label>
          <input
            style={{ minWidth: "200px" }}
            type="text"
            value={inputEmailValue}
            onChange={handleInputEmailChange}
          />
        </div>
        <div className={styles["settings-item"]}>
          <label>密码：</label>
          <input
            style={{ minWidth: "200px" }}
            type="password"
            value={inputPasswordValue}
            onChange={handleInputPasswordChange}
          />
        </div>

        <div className={styles["settings-login"]}>
          <button
            onClick={emailLoginSubmit}
            style={{ width: "100%" }}
            className={styles["btn"]}
          >
            登录
          </button>
        </div>

        <Link to={Path.Register} style={{ textDecoration: "none" }}>
          <p style={{ color: "black", fontSize: "14px" }}>
            还没有账号，<a style={{ color: "#4e6ef2" }}>立即注册</a>
          </p>
        </Link>
      </div>
    </ErrorBoundary>
  );
}
