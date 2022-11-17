
import { styled } from '@mui/system';
import React, { FC } from 'react';
import { useLocation } from 'react-router';

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
        <b>Bản quyền thuộc về <i><a href="#">IDX@HUFI</a> </i>(2022)</b>
    </MyFooter>
}

export default Footer;