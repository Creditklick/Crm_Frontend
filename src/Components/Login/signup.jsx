import React, { useCallback, useState, useMemo } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialFormState = {
  password: "",
  confirmPassword: "",
  employeeCode: "",
  email: "",
  fullName: "",
  userType: "agent",
  teamLeaderEmployeeCode: "",
  teamLeaderPassword: ""
};

const Signup = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [passwordType, setPasswordType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordVisibility = useCallback((e) => {
    e.preventDefault();
    setPasswordType(prev => !prev);
  }, []);

  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleSignup = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const payload = {
      employee_code: formData.employeeCode,
      email: formData.email,
      full_name: formData.fullName,
      password: formData.password,
      userType: formData.userType,
      confirm_password: formData.confirmPassword,
      ...(formData.userType === "agent" && {
        reported_to_: formData.teamLeaderEmployeeCode,
        team_leader_password: formData.teamLeaderPassword
      })
    };

    try {
      await axios.post("https://crm-backend-msk3.onrender.com/searchapp/signup", payload, {
     // await axios.post("https://crm-backend-msk3.onrender.com/searchapp/signup", payload, {
        headers: { "Content-Type": "application/json" }
      });
      toast.success("Account created successfully!");
      setFormData(initialFormState);
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const showAgentFields = useMemo(() => formData.userType === "agent", [formData.userType]);

  return (
    <div className="h-screen flex">
      <div className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="text-center text-white z-10">
          <p className="text-6xl font-extrabold tracking-wider">IMS CRM</p>
          <p className="mt-4 text-2xl font-medium">Create Your Account</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white py-10 px-5">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-400 transform rotate-45 z-0" />
          
          <div className="text-center mb-10">
            <p className="text-2xl font-semibold text-gray-800 mt-4">Sign Up</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {["employeeCode", "fullName", "email"].map((field) => (
              <div key={field} className="space-y-1">
                <Label htmlFor={field}>{field.split(/(?=[A-Z])/).join(" ")}</Label>
                <Input
                  id={field}
                  value={formData[field]}
                  onChange={handleInputChange(field)}
                  placeholder={`Enter your ${field.split(/(?=[A-Z])/).join(" ")}`}
                />
              </div>
            ))}

            <div className="space-y-1 relative">
              <Label>Password</Label>
              <Input
                type={passwordType ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
                placeholder="Enter your password"
              />
              <button
                onClick={handlePasswordVisibility}
                className="absolute right-3 top-8"
                aria-label="Toggle password visibility"
              >
                {passwordType ? <GoEye /> : <GoEyeClosed />}
              </button>
            </div>

            <div className="space-y-1">
              <Label>Confirm Password</Label>
              <Input
                type={passwordType ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                placeholder="Confirm your password"
              />
            </div>

            <div className="space-y-2">
              <Label>User Type</Label>
              <div className="flex gap-4">
                {["agent", "senior"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="userType"
                      value={type}
                      checked={formData.userType === type}
                      onChange={() => setFormData(prev => ({ ...prev, userType: type }))}
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {showAgentFields && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Team Leader Code</Label>
                  <Input
                    value={formData.teamLeaderEmployeeCode}
                    onChange={handleInputChange("teamLeaderEmployeeCode")}
                    placeholder="Leader code"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Leader Password</Label>
                  <Input
                    type="password"
                    value={formData.teamLeaderPassword}
                    onChange={handleInputChange("teamLeaderPassword")}
                    placeholder="Leader password"
                  />
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full h-10" disabled={loading}>
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Sign Up"}
            </Button>
          </form>
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default React.memo(Signup);