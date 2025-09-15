    "use client"

import { useState } from "react"
import { Formik, Form, Field } from "formik"
import { User, Mail, Lock } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { loginSchema } from "../utils/formikValidators/auth/login.validator"
import { signupSchema } from "../utils/formikValidators/auth/signup.validator"

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
  }

  type LoginValues = { email: string; password: string }
  type SignupValues = { name: string; email: string; password: string; confirmPassword: string }
  type FormValues = LoginValues | SignupValues

  const handleSubmit = (values: FormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    console.log("Form submitted:", values)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div
        className={`flex-1 flex items-center justify-center transition-all duration-500 ${
          isSignUp ? "bg-white" : "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 relative overflow-hidden"
        }`}
      >
        {/* Decorative shapes for blue background */}
        {!isSignUp && (
          <>
            <div className="absolute top-20 right-20 w-16 h-16 bg-blue-400/20 rotate-45"></div>
            <div className="absolute bottom-40 left-20 w-32 h-32 bg-blue-300/10 rounded-full"></div>
            <div className="absolute top-1/2 left-10 w-20 h-20 bg-blue-500/15 rotate-12"></div>
            <div className="absolute bottom-20 right-40 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-blue-400/20"></div>
          </>
        )}

        <div className="w-full max-w-md px-8">
          {isSignUp ? (
            // Sign In Form (when in signup mode, left side shows sign in)
            <div className="text-center">
              <h2 className="text-3xl font-bold text-orange-500 mb-2">Sign In to</h2>
              <h2 className="text-3xl font-bold text-orange-500 mb-8">Your Account</h2>

              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Field
                        as={Input}
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="pl-12 h-12 bg-gray-100 border-0 rounded-full"
                      />
                      {errors.email && touched.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Field
                        as={Input}
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="pl-12 h-12 bg-gray-100 border-0 rounded-full"
                      />
                      {errors.password && touched.password && (
                        <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                      )}
                    </div>

                    <div className="text-center">
                      <button type="button" className="text-sm text-gray-600 underline">
                        forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold"
                    >
                      SIGN IN
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            // Welcome Back (when in login mode, left side shows welcome)
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
              <p className="text-blue-100 mb-8 leading-relaxed">
                To keep connected with us please
                <br />
                login with your personal info
              </p>
              <Button
                onClick={toggleMode}
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-800 px-12 py-3 rounded-full font-semibold"
              >
                SIGN IN
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div
        className={`flex-1 flex items-center justify-center transition-all duration-500 ${
          isSignUp ? "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 relative overflow-hidden" : "bg-white"
        }`}
      >
        {/* Decorative shapes for blue background */}
        {isSignUp && (
          <>
            <div className="absolute top-20 left-20 w-16 h-16 bg-blue-400/20 rotate-45"></div>
            <div className="absolute bottom-40 right-20 w-32 h-32 bg-blue-300/10 rounded-full"></div>
            <div className="absolute top-1/2 right-10 w-20 h-20 bg-blue-500/15 rotate-12"></div>
            <div className="absolute bottom-20 left-40 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-blue-400/20"></div>
          </>
        )}

        <div className="w-full max-w-md px-8">
          {isSignUp ? (
            // Hello Friend (when in signup mode, right side shows hello friend)
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-6">Hello Friend!</h1>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Enter your personal details and
                <br />
                start your journey with us
              </p>
              <Button
                onClick={toggleMode}
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-800 px-12 py-3 rounded-full font-semibold"
              >
                SIGN UP
              </Button>
            </div>
          ) : (
            // Create Account Form (when in login mode, right side shows create account)
            <div className="text-center">
              <h2 className="text-3xl font-bold text-orange-500 mb-8">Create Account</h2>

              <Formik
                initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
                validationSchema={signupSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Field
                        as={Input}
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="pl-12 h-12 bg-gray-100 border-0 rounded-full"
                      />
                      {errors.name && touched.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Field
                        as={Input}
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="pl-12 h-12 bg-gray-100 border-0 rounded-full"
                      />
                      {errors.email && touched.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Field
                        as={Input}
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="pl-12 h-12 bg-gray-100 border-0 rounded-full"
                      />
                      {errors.password && touched.password && (
                        <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                      )}
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Field
                        as={Input}
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="pl-12 h-12 bg-gray-100 border-0 rounded-full"
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold"
                    >
                      SIGN UP
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
