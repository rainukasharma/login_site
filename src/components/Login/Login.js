import React, { useEffect, useReducer, useState, useRef,useContext } from "react";
import Input from "../UI/Input/Input";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return {
    value: "",
    isValid: false,
  };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return {
    value: "",
    isValid: false,
  };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const authCntx = useContext(AuthContext);
  
  const {isValid: emailIsValid} = emailState;
  const {isValid: passwordIsValid} = passwordState;

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  
  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("form validity check");
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);

    return () => {
      console.log("CLEAN UP!");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    // setFormIsValid(
    //   emailState.value.includes("@") && passwordState.isValid 
    // );
  };

  const passwordChangeHandler = (event) => {
   dispatchPassword({type : 'USER_INPUT' , val : event.target.value})

    // setFormIsValid(
    //   event.target.value.trim().length > 6 && emailState.isValid
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    
    if (formIsValid){
      authCntx.onLogin(emailState.value, passwordState.value);
    }
    else if(!emailIsValid){
      emailInputRef.current.focus();
      
    }
    else{
      passwordInputRef.current.focus();
      }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
        ref = {emailInputRef}
        label = 'E-mail'
        isValid = {emailIsValid}
        type="email"
        id="email"
        value={emailState.value}
        onChange={emailChangeHandler}
        onBlur={validateEmailHandler}
        />
         <Input 
        ref = {passwordInputRef}
        label = 'Password'
        isValid = {passwordIsValid}
        type="password"
        id="password"
        value={passwordState.value}
        onChange={passwordChangeHandler}
        onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
           <Button type="submit" className={classes.btn} /*disabled={!formIsValid}> */>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
