import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../hooks/use-auth";
import { useSelector } from "react-redux";
import useForm from "../hooks/useForm";
import { userProfileSchema } from "../helpers/data-validator-schema";
import { DashboardLayout } from "../components/layout";
import type { RootState } from "../redux/store/store";

export default function UserProfile() {
  const { formData, updateFormDataForContentUpdate, handleInputChange } =
    useForm(userProfileSchema);

  const { currentUser } = useSelector((state: RootState) => state.authState);

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
      updateFormDataForContentUpdate(currentUser);
    }
  }, [currentUser]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#020617] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

          <div className="bg-[#0B1120] rounded-2xl p-6 shadow-lg border border-gray-800">
            {/* Avatar */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-2xl font-bold">
                {formData?.firstName?.charAt(0)}
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {formData?.firstName} {formData?.lastName}
                </h2>
                <p className="text-gray-400 text-sm">{formData?.email}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="text-sm text-gray-400">Full Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-3 rounded-lg bg-[#020617] border border-gray-700 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-3 rounded-lg bg-[#020617] border border-gray-700 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm text-gray-400">Phone</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-3 rounded-lg bg-[#020617] border border-gray-700 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-sm text-gray-400">Role</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-3 rounded-lg bg-[#020617] border border-gray-700 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-sm text-gray-400">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full mt-1 p-3 rounded-lg bg-[#020617] border border-gray-700 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  //   disabled={loading}
                  className="px-6 py-3 cursor-pointer rounded-lg bg-cyan-500 hover:bg-cyan-600 transition-all font-medium disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div> 
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
