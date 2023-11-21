import React, { useState, useRef, useEffect } from "react"
import { loginUser } from "./loginSlice"
import { useAppDispatch } from "../../../app/hooks"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Toast } from "primereact/toast"
import { Link, useNavigate } from "react-router-dom"
import { z, ZodError } from "zod"
import "./login.css"
import { encryptData, userData } from "../../handlers/hashData"
import { Socket, io } from "socket.io-client"
// Define Zod schema for login form
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
})

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailValid, setEmailValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const toast = useRef<Toast | null>(null)

  const handleEmailChange = (value: string) => {
    setEmail(value)
    validateField("email", value)
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    validateField("password", value)
  }

  const validateField = (
    fieldName: keyof typeof loginSchema.shape,
    value: string,
  ) => {
    try {
      const fieldSchema = loginSchema.pick({
        [fieldName]: loginSchema.shape[fieldName],
      })
      fieldSchema.parse({ [fieldName]: value })
      if (fieldName === "email") {
        setEmailValid(true)
      } else if (fieldName === "password") {
        setPasswordValid(true)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((err) => err.path[0] === fieldName)
        if (fieldError) {
          if (fieldName === "email") {
            setEmailValid(false)
          } else if (fieldName === "password") {
            setPasswordValid(false)
          }
        }
      }
    }
  }

  const handleLogin = async () => {
    try {
      setIsLoading(true)

      // Validate using Zod schema
      loginSchema.parse({ email, password })

      // If validation passes, dispatch the login action
      const response = await dispatch(loginUser({ email, password }))
      const userRecord = response?.payload?.user
      const token = response?.payload?.token

      if (loginUser.fulfilled.match(response)) {
        const exp = response?.payload?.expiration

        localStorage.setItem("exp", exp)
        localStorage.setItem("userRecord", JSON.stringify(userRecord))
        localStorage.setItem("token", token)

        const role = userRecord?.role

        navigate("/home")
      } else {
        handleLoginError(response?.payload)
      }
    } catch (error) {
      handleLoginError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginError = (error: any) => {
    toast.current?.show({
      severity: "error",
      summary: "Login Failed",
      detail: "Login failed. Please try again.",
    })
    console.error("Login failed:", error)
  }

  return (
    <div className="p-d-flex p-jc-center p-ai-center login-container">
      <Card className="login-form" title="Login" style={{ width: "350px" }}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="email">Email :</label>
            <InputText
              id="email"
              type="text"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={!emailValid ? "p-invalid" : ""}
            />
            {!emailValid && (
              <small className="p-error">Invalid email address.</small>
            )}
          </div>
          <div style={{ marginTop: "15px" }} className="p-field">
            <label htmlFor="password">Password :</label>
            <InputText
              id="password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={!passwordValid ? "p-invalid" : ""}
            />
            {!passwordValid && (
              <small className="p-error">
                Password must be at least 4 characters long.
              </small>
            )}
          </div>
          <Button
            style={{ marginTop: "20px" }}
            label="Login"
            icon="pi pi-sign-in"
            onClick={handleLogin}
            disabled={isLoading}
          />
        </div>
        <p style={{ marginTop: "50px", textAlign: "center" }}>
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </p>
      </Card>
      <Toast ref={toast} />
    </div>
  )
}

export default Login
