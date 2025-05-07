import { useLoginMutation } from "../../features/adminAuth/adminApiSlice";
import { useDispatch } from "react-redux";
import { setAdminCredentials } from "../../features/adminAuth/adminAuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
      "Please enter a valid Gmail address (e.g., username@gmail.com)"
    )
    .required("Gmail address is required"),
  password: Yup.string()
    .required("Password is required"),
});

const AdminLogin = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await login(values).unwrap();
      if (response.success) {
        dispatch(setAdminCredentials({ admin: response.admin }));
        toast.success(response.message);
        navigate("/admin/dashboard");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      const errorMessage = err?.data?.message || "Login failed due to an internal error";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-lg transform transition-all hover:shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold text-gray-900 tracking-tight">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">Sign in with your Gmail account</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                    Gmail Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="yourname@gmail.com"
                    className={`appearance-none block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-orange-800 transition duration-200 sm:text-sm ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className={`appearance-none block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-800 focus:border-orange-800 transition duration-200 sm:text-sm ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white ${
                    isLoading || isSubmitting
                      ? "bg-orange-700 cursor-not-allowed"
                      : "bg-orange-800/90 hover:bg-orange-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-800 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md`}
                >
                  {isLoading || isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AdminLogin;