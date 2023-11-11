import React, { useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Toast } from "primereact/toast"
import { signUpUser } from "./signUpSlice"
import { Link, useNavigate } from "react-router-dom"
import { z, ZodError } from "zod"
import "./signUp.css"

// Define Zod schema
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
})

function SignUp() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useRef<Toast | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  } as {
    email: string
    password: string
    firstName: string
    lastName: string
  })

  const [validationErrors, setValidationErrors] = useState<ZodError | null>(
    null,
  )

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name as keyof typeof prevData]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      // Validate using Zod schema
      signUpSchema.parse(formData)

      // If validation passes, dispatch the sign-up action
      const responseAction = await dispatch(signUpUser(formData))

      if (signUpUser.fulfilled.match(responseAction)) {
        // Display success message and navigate
        toast.current?.show({
          severity: "success",
          summary: "Sign Up Successful",
          detail: "You have successfully signed up!",
        })
        setTimeout(() => {
          navigate("/login")
        }, 1500)
      } else if (
        responseAction?.payload?.message ===
        "Request failed with status code 409"
      ) {
        // Display email already in use error
        toast.current?.show({
          severity: "error",
          summary: "Sign Up Failed",
          detail: "This Email Is Already In Use",
        })
      } else {
        // Display generic sign-up failed error
        toast.current?.show({
          severity: "error",
          summary: "Sign Up Failed",
          detail: "Sign up failed. Please try again.",
        })
      }
    } catch (error) {
      // Handle Zod validation error
      if (error instanceof z.ZodError) {
        setValidationErrors(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <Card className="signup-form" title="Sign Up" style={{ width: "350px" }}>
        <div className="p-fluid">
          <form onSubmit={handleSubmit}>
            {/* Render form inputs */}
            {(Object.keys(formData) as (keyof typeof formData)[]).map(
              (fieldName) => (
                <div className="p-field" key={fieldName}>
                  <label htmlFor={fieldName}>{fieldName} :</label>
                  <InputText
                    id={fieldName}
                    name={fieldName}
                    type="text"
                    value={formData[fieldName]}
                    onChange={handleChange}
                    required
                    className={
                      validationErrors?.errors[fieldName as any]
                        ? "p-invalid"
                        : ""
                    }
                  />
                  {validationErrors?.errors[fieldName as any] && (
                    <small className="p-error">
                      {validationErrors.errors[fieldName as any].message}
                    </small>
                  )}
                </div>
              ),
            )}
            <Button
              style={{ marginTop: "20px" }}
              label="Sign Up"
              icon="pi pi-check"
              type="submit"
              disabled={isLoading}
            />
            <p style={{ marginTop: "50px", textAlign: "center" }}>
              Already have an account ? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </Card>
      <Toast ref={toast} />
    </div>
  )
}

export default SignUp
