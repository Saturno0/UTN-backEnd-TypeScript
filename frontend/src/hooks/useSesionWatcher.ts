import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./userSlice";

const SESSION_KEY = "token";

const useUserSessionWatcher = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleSessionCleanup = () => {
      dispatch(logout());
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.sessionStorage) {
        return;
      }

      if (event.key === SESSION_KEY && event.newValue === null) {
        handleSessionCleanup();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("user-session-expired", handleSessionCleanup);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("user-session-expired", handleSessionCleanup);
    };
  }, [dispatch]);
};

export default useUserSessionWatcher;