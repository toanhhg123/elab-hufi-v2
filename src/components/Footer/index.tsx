
import { styled } from '@mui/system';
import React, { FC } from 'react';
import { useLocation } from 'react-router';
import IdxLogo from '../../assets/img/idx-logo.png';

const MyFooter = styled('div')({
    fontFamily: "Arial",
    textAlign: "center",
    position: "absolute",
    bottom: "5px",
    left: "40%",
    fontSize: "13px"
});

const Footer: FC = () => {
    const location = useLocation();
    return <MyFooter sx={{ color: location.pathname.includes("login") ? "white" : "black" }}>
        <b>Bản quyền thuộc về
            <i> <a href="#"> IDX@HUFI </a> </i>(2023)  
            <img src={IdxLogo} style={{ maxHeight: "50px", marginLeft: "5px", width: "15px" }} alt="idx-logo" /></b>
    </MyFooter>
}

export default Footer;