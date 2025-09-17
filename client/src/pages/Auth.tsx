"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useDispatch } from "react-redux";
import { AuthService } from "../services/auth.service";
import { loginSchema } from "../utils/formikValidators/auth/login.validator";
import { signupSchema } from "../utils/formikValidators/auth/signup.validator";
import { handleError } from "../utils/error/error-handler.utils";
import { toast } from "sonner";
import { userLogin } from "../store/slices/user.slice";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);

    if (isLogin) {
      try {
        const res = await AuthService.login(values.email, values.password);
        toast.success("Logged in successfully!");
        dispatch(userLogin(res.data));
      } catch (error) {
        handleError(error);
        setIsSubmitting(false);
      }
    } else {
      try {
        await AuthService.register(
          values.fullName,
          values.email,
          values.password
        );
        toast.success("Account created successfully!");
        setIsLogin(true);
        setIsSubmitting(false);
      } catch (error) {
        handleError(error);
        setIsSubmitting(false);
      }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex">
      {isLogin ? (
        <>
          {/* Login Mode: Form on left, Welcome on right */}
          <div className="flex-1 bg-gray-50 flex items-center justify-center px-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-orange-500 mb-2">
                  Sign In to
                </h2>
                <h2 className="text-3xl font-bold text-orange-500 mb-6">
                  Your Account
                </h2>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-6">
                    <div className="relative flex flex-col">
                      <div className="relative">
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email"
                          className={`pl-12 py-8 bg-gray-100 border-0 rounded-lg text-gray-700 placeholder-gray-400 w-full ${
                            errors.email && touched.email
                              ? "ring-2 ring-red-500"
                              : "focus:ring-2 focus:ring-orange-500"
                          }`}
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1 ml-2"
                      />
                    </div>

                    <div className="relative flex flex-col">
                      <div className="relative">
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className={`pl-12 pr-12 py-8 bg-gray-100 border-0 rounded-lg text-gray-700 placeholder-gray-400 w-full ${
                            errors.password && touched.password
                              ? "ring-2 ring-red-500"
                              : "focus:ring-2 focus:ring-orange-500"
                          }`}
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 cursor-pointer" />
                          ) : (
                            <Eye className="h-5 w-5 cursor-pointer" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1 ml-2"
                      />
                    </div>

                    <div className="flex align-middle justify-center">
                      <Button
                        type="submit"
                        className="cursor-pointer w-[300px]  bg-orange-500 hover:bg-orange-300 text-white py-8 px-6 rounded-full font-semibold text-base "
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Signing In...
                          </div>
                        ) : (
                          "SIGN IN"
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Right Panel - Dark Blue Gradient for Login */}
          <div className="flex-1 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-20 right-1/4 w-16 h-16 bg-blue-600/30 rotate-45"></div>
            <div className="absolute bottom-32 right-20 w-24 h-24 bg-blue-500/20 rotate-45"></div>
            <div className="absolute bottom-20 left-20 w-20 h-20 bg-teal-500/20 rotate-45"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full"></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-teal-400/20"></div>

            <div className="text-center text-white z-10 px-8">
              <h1 className="text-4xl font-bold mb-4">Hello Friend!</h1>
              <p className="text-blue-100 mb-8 max-w-sm mx-auto leading-relaxed">
                Enter your personal details and start your journey with us
              </p>
              <button
                onClick={toggleAuthMode}
                className="border-2 cursor-pointer border-white text-white px-8 py-2 rounded-full font-medium hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                SIGN UP
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Signup Mode: Welcome on left, Form on right */}
          <div className="flex-1 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-blue-600/30 rotate-45"></div>
            <div className="absolute bottom-32 left-20 w-24 h-24 bg-blue-500/20 rotate-45"></div>
            <div className="absolute bottom-20 right-20 w-20 h-20 bg-teal-500/20 rotate-45"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-400/10 rounded-full"></div>

            <div className="text-center text-white z-10 px-8">
              <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-blue-100 mb-8 max-w-sm mx-auto leading-relaxed">
                To keep connected with us please login with your personal info
              </p>
              <button
                onClick={toggleAuthMode}
                className="border-2 cursor-pointer border-white text-white px-8 py-2 rounded-full font-medium hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                SIGN IN
              </button>
            </div>
          </div>

          {/* Right Panel - Light Background with Signup Form */}
          <div className="flex-1 bg-gray-50 flex items-center justify-center px-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-orange-400 mb-6">
                  Create Account
                </h2>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={signupSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-6">
                    <div className="relative flex flex-col">
                      <div className="relative">
                        <Field
                          as={Input}
                          id="fullName"
                          name="fullName"
                          placeholder="Name"
                          className={`pl-12 py-8 bg-gray-100 border-0 rounded-lg text-gray-700 placeholder-gray-400 w-full ${
                            errors.fullName && touched.fullName
                              ? "ring-2 ring-red-500"
                              : "focus:ring-2 focus:ring-orange-500"
                          }`}
                        />
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <ErrorMessage
                        name="fullName"
                        component="div"
                        className="text-red-400 text-sm mt-1 ml-2"
                      />
                    </div>

                    <div className="relative flex flex-col">
                      <div className="relative">
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email"
                          className={`pl-12 py-8 bg-gray-100 border-0 rounded-lg text-gray-700 placeholder-gray-400 w-full ${
                            errors.email && touched.email
                              ? "ring-2 ring-red-500"
                              : "focus:ring-2 focus:ring-orange-500"
                          }`}
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1 ml-2"
                      />
                    </div>

                    <div className="relative flex flex-col">
                      <div className="relative">
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className={`pl-12 pr-12 py-8 bg-gray-100 border-0 rounded-lg text-gray-700 placeholder-gray-400 w-full ${
                            errors.password && touched.password
                              ? "ring-2 ring-red-500"
                              : "focus:ring-2 focus:ring-orange-500"
                          }`}
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 cursor-pointer" />
                          ) : (
                            <Eye className="h-5 w-5 cursor-pointer" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1 ml-2"
                      />
                    </div>

                    <div className="flex align-middle justify-center">
                      <Button
                        type="submit"
                        className="cursor-pointer w-[300px]  bg-orange-500 hover:bg-orange-300 text-white py-8 px-6 rounded-full font-semibold text-base"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Creating Account...
                          </div>
                        ) : (
                          "SIGN UP"
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
