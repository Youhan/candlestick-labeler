import React from "react";
import propTypes from "prop-types";

function Container({ children, className }) {
  const defaultClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
  // append className to defaultClasses
  const classes = `${defaultClasses} ${className}`;
  return <div className={classes}>{children}</div>;
}

Container.propTypes = {
  children: propTypes.node,
  className: propTypes.string,
};

export default Container;
