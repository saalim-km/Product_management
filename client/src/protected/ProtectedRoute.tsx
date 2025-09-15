import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import { JSX } from "react";

export interface NoAuthRouteProps {
  element: JSX.Element;
}

export const NoAuthRoute = ({ element }: NoAuthRouteProps) => {
  const user = useSelector((state: RootState) => {
    if (state.user) return state.user.user;
    return null;
  });

  if (user) {
    return <Navigate to={"/home"} />;
  }

  return element;
};

export const AuthRoute = ({ element }: NoAuthRouteProps) => {
  const user = useSelector((state: RootState) => {
    if (state.user) return state.user.user;
    return null;
  });

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return element;
};