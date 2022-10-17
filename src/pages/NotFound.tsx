import { Button } from "@mui/material";
import React, { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import Error404 from "../assets/img/error-404.jpg";

export const NotFound: FC = () => {
  useEffect(() => {
    document.title = "404";
  }, [])

  return (
    <div style={{
      boxSizing: "border-box",
      background: `url(${Error404}) no-repeat center`,
      height: "100vh",
      backgroundSize: "contain",
    }}>
      <Link to={"/"} style={{
        textDecoration: 'none',
        position: "absolute",
        transform: "translate(-50%, -50%)",
        top: "90%",
        left: "50%",
      }}>
        <Button
          variant="outlined"
          onClick={() => document.title = "HUFI ELab"}
        >
          Về trang chủ
        </Button>
      </Link>
    </div >
  )
}