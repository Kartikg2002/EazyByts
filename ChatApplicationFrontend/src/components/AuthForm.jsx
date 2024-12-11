import { useState } from "react";
import { loginUser, saveUser } from "../services/LoginService";
import toast from "react-hot-toast";
function AuthForm() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    //login
    if (isLogin) {
      try {
        const response = await loginUser(formData);
        localStorage.setItem("token", response);
        toast.success("Login Successful !!!");
        window.location.href = "/join";
      } catch (error) {
        console.error(error);
        toast.error("Invalid Username or Password  !!!");
      }
    }
    //register
    else {
      try {
        const response = await saveUser(formData);
        console.log(response);
        toast.success("Registration Successfull !!!");
        setIsLogin(true);
      } catch (error) {
        console.log(error);
        toast.error("Registration Failed !!!");
      }
    }

    // Reset form
    setFormData({
      username: "",
      password: "",
    });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded shadow-lg w-96">
        <h2 className="text-center text-2xl font-semibold mb-6">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h2>

        {/* Form Fields */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded ${
              isLogin
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-semibold transition duration-300`}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <p className="text-center text-sm mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              // Clear form on toggle
              setFormData({
                username: "",
                password: "",
              });
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
