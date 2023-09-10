import { useState, useEffect } from "react";
import styles from "./login.module.scss";
import CloseIcon from "../icons/close.svg";
import { IconButton } from "./button";
import { useUpdateStore, useAccessStore } from "../store";
import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { Link, useNavigate } from "react-router-dom";
const DEFAULT_SERVER_USR = "http://127.0.0.1:81/";
const SERVER_USR = process.env.SERVER_USR || DEFAULT_SERVER_USR;
const DEFAULT_CODE = "chatGPT-PLUS";
const CODE = process.env.CODE || DEFAULT_CODE;

export function RegisterPage() {
  const access = useAccessStore();
  const goHome = () => navigate(Path.Home);

  const navigate = useNavigate();
  let serverUrl = SERVER_USR;
  let code = CODE;
  let [inputEmailValue, setInputEmailValue] = useState("");
  const handleInputEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputEmailValue(event.target.value);
  };

  let [inputCodeValue, setInputCodeValue] = useState("");
  const handleInputCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputCodeValue(event.target.value);
  };

  let [inputPasswordValue, setInputPasswordValue] = useState("");
  const handleInputPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputPasswordValue(event.target.value);
  };

  let [inputUseShareCodeValue, setInputUseShareCodeValue] = useState("");
  const handleInputUseShareCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputUseShareCodeValue(event.target.value);
  };

  const updateStore = useUpdateStore();
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  function checkUpdate(force = false) {
    setCheckingUpdate(true);
    updateStore.getLatestVersion(force).then(() => {
      setCheckingUpdate(false);
    });
  }

  const [loadingUsage, setLoadingUsage] = useState(false);

  function checkUsage() {
    setLoadingUsage(true);
    updateStore.updateUsage().finally(() => {
      setLoadingUsage(false);
    });
  }

  async function getCodeSubmit() {
    try {
      const response = await fetch(`${serverUrl}chatAuth/sendEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inputEmailValue }),
      });

      if (response.ok) {
        // 处理成功的情况
        console.log("验证码请求成功！");
        const responseData = await response.json();
        console.log("返回的数据：", responseData); // 在这里打印返回的数据
        if (responseData.code !== 200) {
          alert(responseData.message);
          return;
        }
      } else {
        // 处理错误的情况
        alert("验证码请求失败！");
        return;
      }
    } catch (error) {
      alert("发生错误，请联系管理员！");
      return;
    }
  }
  // 邮箱 |
  async function emailLoginSubmit() {
    try {
      const response = await fetch(`${serverUrl}chatAuth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputEmailValue,
          code: inputCodeValue,
          password: inputPasswordValue,
          inviteCode: inputUseShareCodeValue,
        }),
      });

      if (response.ok) {
        // 处理成功的情况
        console.error("验证码请求成功！");
        const responseData = await response.json();
        if (responseData.code == 200) {
          access.updateCode(code);
          access.updateUserEmail(inputEmailValue);
          goHome();
        } else {
          alert(responseData.message);
          return;
        }
      } else {
        // 处理错误的情况
        alert("验证码请求失败！");
        return;
      }
    } catch (error) {
      alert("发生错误，请联系管理员！");
      return;
    }
  }

  const accessStore = useAccessStore();

  // const showUsage = accessStore.isLogin();
  // useEffect(() => {
  //   // checks per minutes
  //   checkUpdate();
  //   showUsage && checkUsage();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
          <div className={styles["window-header-sub-title"]}>注册</div>
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
          <label>验证码:</label>
          <input
            style={{ maxWidth: "76px", marginRight: "10px" }}
            type="text"
            value={inputCodeValue}
            onChange={handleInputCodeChange}
          />
          <button onClick={getCodeSubmit} className={styles["btn"]}>
            获取验证码
          </button>
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

        <div className={styles["settings-item"]}>
          <label>邀请码：</label>
          <input
            style={{ minWidth: "200px" }}
            type="text"
            value={inputUseShareCodeValue}
            onChange={handleInputUseShareCodeChange}
            placeholder="选填"
          />
        </div>

        <div className={styles["settings-login"]}>
          <button
            onClick={emailLoginSubmit}
            style={{ width: "100%" }}
            className={styles["btn"]}
          >
            注册
          </button>
        </div>

        <Link to={Path.Login} style={{ textDecoration: "none" }}>
          <p style={{ color: "black", fontSize: "14px" }}>
            已有账号，<a style={{ color: "#4e6ef2" }}>立即登入</a>
          </p>
        </Link>
      </div>
    </ErrorBoundary>
  );
}
