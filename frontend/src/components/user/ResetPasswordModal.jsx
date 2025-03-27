import React, { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInputView"; 

const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[!@#$%^&*]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPasswordModal = ({
  isOpen,
  closeModal,
  email,
  onResetSuccess,
  resetPasswordMutation,
}) => {
  const navigate = useNavigate();

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("handle submit from reset password modal");
    try {
      const response = await resetPasswordMutation({
        email,
        password: values.password,
      }).unwrap();
      onResetSuccess(response);
      console.log("reset password from reset modal");
      setTimeout(() => {
        closeModal();
        navigate("/login");
      }, 1000);
    } catch (err) {
      const errorMessage = err?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Set New Password
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Enter a new password for {email}.
                  </p>
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={resetPasswordSchema}
                  onSubmit={handleSubmit}
                  validateOnChange={true}
                  validateOnBlur={true}
                >
                  {({ isSubmitting }) => (
                    <Form className="mt-4">
                      <div className="space-y-4">

                        <PasswordInput
                          id="password"
                          name="password"
                          label="New Password"
                          placeholder="Enter new password"
                        />
                        
                        <PasswordInput
                          id="confirmPassword"
                          name="confirmPassword"
                          label="Confirm Password"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <div className="mt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full inline-flex justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white ${
                            isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-700"
                          } focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2`}
                        >
                          {isSubmitting ? "Resetting..." : "Reset Password"}
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            closeModal();
                            navigate("/login");
                          }}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
                        >
                          Back to Login
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ResetPasswordModal;