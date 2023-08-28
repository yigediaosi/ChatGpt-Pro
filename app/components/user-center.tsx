import { useState, useEffect, useMemo } from "react";

import styles from "./settings.module.scss";

import CloseIcon from "../icons/close.svg";

import { IconButton } from "./button";
import { useUpdateStore, useAccessStore } from "../store";

import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import { getClientConfig } from "../config/client";

export function UserCenterPage() {
  const navigate = useNavigate();

  const updateStore = useUpdateStore();

  const usage = {
    used: updateStore.used,
    subscription: updateStore.subscription,
  };
  const [loadingUsage, setLoadingUsage] = useState(false);
  function checkUsage(force = false) {
    if (accessStore.hideBalanceQuery) {
      return;
    }

    setLoadingUsage(true);
    updateStore.updateUsage(force).finally(() => {
      setLoadingUsage(false);
    });
  }

  const accessStore = useAccessStore();

  const showUsage = accessStore.isAuthorized();
  useEffect(() => {
    showUsage && checkUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    </ErrorBoundary>
  );
}
