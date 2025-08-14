import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { addUserData } from '@/features/user/userFeatures';
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

function ProfilePersonalDetails() {
  const dispatch = useDispatch();
  // Read the full profile data object from the Redux store
  const profileData = useSelector((state) => state.editUser.userData);

  // When an input changes, dispatch an action to update the corresponding field in the Redux store
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(addUserData({ ...profileData, [name]: value }));
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-700">First Name</label>
          <Input name="firstName" value={profileData?.firstName || ''} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Last Name</label>
          <Input name="lastName" value={profileData?.lastName || ''} onChange={handleChange} className="mt-1" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Job Title</label>
          <Input name="jobTitle" value={profileData?.jobTitle || ''} onChange={handleChange} className="mt-1" placeholder="e.g., Senior Software Engineer" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Address</label>
          <Input name="address" value={profileData?.address || ''} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <Input name="phone" value={profileData?.phone || ''} onChange={handleChange} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          {/* Email is read-only as it's the account identifier */}
          <Input name="email" type="email" value={profileData?.email || ''} readOnly className="mt-1 bg-gray-100 cursor-not-allowed" />
        </div>
        <div className="md:col-span-2 mt-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Social & Portfolio Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Github className="h-4 w-4"/>GitHub URL</label>
              <Input name="githubUrl" value={profileData?.githubUrl || ''} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Linkedin className="h-4 w-4"/>LinkedIn URL</label>
              <Input name="linkedinUrl" value={profileData?.linkedinUrl || ''} onChange={handleChange} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><Globe className="h-4 w-4"/>Portfolio URL</label>
              <Input name="portfolioUrl" value={profileData?.portfolioUrl || ''} onChange={handleChange} className="mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePersonalDetails;
