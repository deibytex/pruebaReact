/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { checkIsActive } from "../../../helpers";

type Props = {
  to: string;
  title: string;
  hasBullet?: boolean;
  free?: boolean;
  exclusive?: boolean;
  iconClass?: string;
};

const AsideMenuItem: React.FC<Props> = ({
  children,
  to,
  title,
  hasBullet = false,
  free = true,
  exclusive = false, iconClass = ""
}) => {
  const { pathname } = useLocation();
  return (
    <div
      className={clsx("menu-item ", {
        here: checkIsActive(pathname, to),
      })}
    >
      {!free ? (
        <a data-kt-page="pro" className="menu-link py-2">
          {hasBullet && (
            <span className="menu-bullet">
              <span className="bullet bullet-dot"></span>
            </span>
          )}
          <span className="menu-title text-white fs-7">
            {title}
            <span className="badge badge-pro badge-light-danger fw-bold fs-9 px-2 py-1 ms-1">
              Pro
            </span>
          </span>
        </a>
      ) : (
        <Link className={`menu-item  rounded py-2 ${checkIsActive(pathname, to)? "border" : "" }`} to={to}>
          {hasBullet && (
              <i className= {`fs-3  ${iconClass} m-1`}></i>
          )}
          <span className="menu-title text-white  fs-7">{title}</span>
          {exclusive && (
            <span className="badge badge-exclusive badge-light-success fw-bold fs-9 px-2 py-1 ms-1">
              Exclusive
            </span>
          )}
        </Link>
      )}
      {children}
    </div>
  );
};

export { AsideMenuItem };
