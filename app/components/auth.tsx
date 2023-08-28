import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/bot.svg";
import { useEffect } from "react";
import { getClientConfig } from "../config/client";

import { AESCrypto } from "../store/AESCrypto";

export function AuthPage() {
  const navigate = useNavigate();
  const access = useAccessStore();

  const secretKey = "your-secret-key";
  const iv = "your-iv-here";

  const aesCrypto = new AESCrypto(secretKey, iv);
  const plaintext = "Hello, AES!";
  const encryptedText = aesCrypto.encrypt(plaintext);
  console.log("Encrypted:", encryptedText);

  const decryptedText = aesCrypto.decrypt(encryptedText);
  console.log("Decrypted:", decryptedText);
  const goHome = () => navigate(Path.Home);

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.Auth.Title}</div>
      <div className={styles["auth-tips"]}>{Locale.Auth.Tips}</div>

      <input
        className={styles["auth-input"]}
        type="password"
        placeholder={Locale.Auth.Input}
        value={access.accessCode}
        onChange={(e) => {
          access.updateCode(e.currentTarget.value);
        }}
      />

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Auth.Confirm}
          type="primary"
          onClick={goHome}
        />
        <IconButton text={Locale.Auth.Later} onClick={goHome} />
      </div>
    </div>
  );
}
