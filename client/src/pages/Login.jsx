"use client"

import { useState } from "react"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { useFormik } from "formik"
import * as Yup from "yup"

// Login validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
})

// Signup validation schema
const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
})

export default function LoginSignup() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    formik.resetForm()
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Formik hook for form handling
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: ""
    },
    validationSchema: isSignUp ? signupSchema : loginSchema,
    onSubmit: (values) => {
      console.log("Form data:", values)
      // You can add API call here
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="relative w-full max-w-4xl h-[600px]  rounded-2xl shadow-2xl overflow-hidden">
        {/* Sliding Background Panel */}
        <div
          className={`absolute top-0 w-1/2 h-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 transition-all duration-700 ease-in-out z-10 ${
            isSignUp ? "translate-x-full" : "translate-x-0"
          }`}
        >
          {/* Decorative geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rotate-45"></div>
            <div className="absolute top-32 left-8 w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-20 right-16 w-12 h-12 border-2 border-white/20 rotate-12"></div>
            <div className="absolute bottom-32 left-12 w-8 h-8 bg-white/10 rotate-45"></div>
            <div className="absolute top-1/2 right-8 w-6 h-6 bg-white/20 rotate-45"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-8">
            {!isSignUp ? (
              <>
                <h2 className="text-3xl font-bold mb-4">Hello Friend!</h2>
                <p className="text-center text-white/90 mb-8 leading-relaxed">
                  Enter your personal details and
                  <br />
                  start your journey with us
                </p>
                <button
                  onClick={toggleMode}
                  className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300"
                  aria-label="Switch to sign up"
                >
                  SIGN UP
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-center text-white/90 mb-8 leading-relaxed">
                  To keep connected with us please
                  <br />
                  login with your personal info
                </p>
                <button
                  onClick={toggleMode}
                  className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300"
                  aria-label="Switch to sign in"
                >
                  SIGN IN
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sign In Form */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-12 transition-all duration-700 ${
            isSignUp ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <h2 className="text-3xl font-bold text-orange-500 mb-8">
            Sign In to
            <br />
            Your Account
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full pl-12 pr-12 py-4 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button 
                type="button" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="text-center pt-2">
              <a href="#" className="text-gray-600 text-sm hover:text-orange-500 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Sign Up Form */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center px-12 transition-all duration-700 ${
            !isSignUp ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <h2 className="text-3xl font-bold text-orange-500 mb-8">Create Account</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
              ) : null}
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full pl-12 pr-12 py-4 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button 
                type="button" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}