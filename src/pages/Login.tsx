import React, { ChangeEvent, FC, useState } from "react";
import './Login.css';
import HufiLogoExtended from '../assets/img/logo-hufi-extended.png';
import GetCaptcha from '../assets/img/get-captcha.jpg';
import About from '../assets/img/login-about.png';
import { Button, IconButton, Stack, TextField, Tooltip } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import { dummyLoginData, IloginType } from "../types/loginType";
import { Link } from "react-router-dom";

export const Login: FC = () => {
  const [loginData, setLoginData] = useState<IloginType>(dummyLoginData);

  const handleChange =
    (prop: keyof IloginType) => (event: ChangeEvent<HTMLInputElement>) => {
      setLoginData({ ...loginData, [prop]: event.target.value });
    }

  return (
    <div className="login-container">
      <div className="login-about">
        <h2>HỆ THỐNG QUẢN LÝ PHÒNG THÍ NGHIỆM ELAB</h2>
        <img src={About} style={{ height: "480px", opacity: "80%" }} />
      </div>

      <div className="login-form">
        <img src={HufiLogoExtended} style={{ width: "340px" }} />
        <h2>ĐĂNG NHẬP HỆ THỐNG</h2>

        <form onSubmit={(e) => e.preventDefault()} style={{ "margin": "30px 30px" }}>
          <Stack sx={{ width: '100%', gap: '1.5rem' }}>
            <TextField
              placeholder="Nhập tên đăng nhập"
              value={loginData.username}
              onChange={handleChange("username")}
            />
            <TextField
              type="password"
              placeholder="Nhập mật khẩu"
              value={loginData.password}
              onChange={handleChange("password")}
            />
            <div className="captcha">
              <TextField
                placeholder="Nhập mã"
                value={loginData.captcha}
                onChange={handleChange("captcha")}
              />
              <Tooltip arrow placement="bottom" title="Làm mới">
                <IconButton color="error">
                  <CachedIcon />
                </IconButton>
              </Tooltip>
              <img src={GetCaptcha} style={{ height: "40px" }} />
            </div>
          </Stack>
        </form>

        <Link to={"/"} style={{ textDecoration: 'none' }}>
          <Button variant="contained">
            Đăng nhập
          </Button>
        </Link>
      </div>
    </div >
  )
}