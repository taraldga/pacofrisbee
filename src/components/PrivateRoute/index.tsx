import * as React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component, isAuthenticated, ...rest }: any) => {
  const routeComponent = (props: any) =>
    isAuthenticated ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{ pathname: "/login" }} />
    );
  return <Route {...rest}>{routeComponent}</Route>;
};

export default PrivateRoute;
