import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import Locale from "../locales";

import { useEffect } from "react";
import { getClientConfig } from "../config/client";

export function AiDrawPage() {
  const navigate = useNavigate();

  const goHome = () => navigate(Path.Home);

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["auth-page"]}>
      <iframe
        title="Embedded Page"
        className={styles["embedded-page"]} // 使用样式模块定义样式
        src="https://611952sp22.yicp.fun/"
        frameBorder="0"
        allowFullScreen
        style={{ width: "100%", height: "100%" }} // 设置宽度和高度
      />

      <div className={styles["auth-actions"]}>
        <IconButton text={Locale.Auth.TALK} onClick={goHome} />
      </div>
    </div>
  );
}
