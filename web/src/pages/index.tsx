import { Outlet } from "react-router-dom";

export const A = () => {
  return <div>A</div>;
};

export const B = () => {
  return <div>B</div>;
};

export const C = () => {
  return <div>C</div>;
};

export const D = () => {
  return <div>D</div>;
};

export const Main = () => {
  return <Outlet />;
};

export const Login = () => {
  return <div>Login</div>;
};
