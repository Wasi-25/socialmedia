import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../../Actions/User";
import "./ResetPassword.css";

const ResetPassword = () => {

    const [newPassword, setNewPassword] = useState("");

    const dispatch = useDispatch();
    const params = useParams();
    const alert = useAlert();
    const {error, loading, message} = useSelector((state)=> state.like);

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(resetPassword(params.token, newPassword));
    }

    useEffect(() => {
        if (error) {
          alert.error(error);
          dispatch({ type: "clearErrors" });
        }
        if (message) {
          alert.success(message);
          dispatch({ type: "clearMessage" });
        }
      }, [alert, error, dispatch, message]);

  return (
    <div className="resetPassword">
    <form className="resetPasswordForm" onSubmit={submitHandler}>
      <Typography fontFamily='Tilt Neon' variant="h3" style={{ padding: "2vmax" }}>
        myGram
      </Typography>

      <input
        type="password"
        placeholder="New Password"
        required
        className="updatePasswordInputs"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <Link to="/">
        <Typography fontFamily='Tilt Neon'>Login</Typography>
      </Link>
      <Typography fontFamily='Tilt Neon'>Or</Typography>

      <Link to="/forgot/password">
        <Typography fontFamily='Tilt Neon'>Request Another Token!</Typography>
      </Link>

      <Button disabled={loading} type="submit">
        Reset Password
      </Button>
    </form>
  </div>
  )
}

export default ResetPassword;