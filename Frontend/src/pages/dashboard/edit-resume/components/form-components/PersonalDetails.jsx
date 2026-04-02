import React from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import {
  LoaderCircle,
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Github,
  Linkedin,
  Globe,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";

function FieldLabel({ icon: Icon, label, required }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
      <Icon className="h-3.5 w-3.5 text-gray-400" />
      {label}
      {required && <span className="text-red-400 text-[10px]">*</span>}
    </label>
  );
}

function PersonalDetails({ resumeInfo, enanbledNext }) {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: resumeInfo?.firstName || "",
    lastName: resumeInfo?.lastName || "",
    jobTitle: resumeInfo?.jobTitle || "",
    address: resumeInfo?.address || "",
    phone: resumeInfo?.phone || "",
    email: resumeInfo?.email || "",
    githubUrl: resumeInfo?.githubUrl || "",
    linkedinUrl: resumeInfo?.linkedinUrl || "",
    portfolioUrl: resumeInfo?.portfolioUrl || "",
  });

  const handleInputChange = (e) => {
    enanbledNext(false);
    dispatch(
      addResumeData({
        ...resumeInfo,
        [e.target.name]: e.target.value,
      })
    );
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSave = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log("Personal Details Save Started");
    const data = {
      data: {
        firstName: e.target.firstName.value,
        lastName: e.target.lastName.value,
        jobTitle: e.target.jobTitle.value,
        address: e.target.address.value,
        phone: e.target.phone.value,
        email: e.target.email.value,
        githubUrl: e.target.githubUrl?.value || "",
        linkedinUrl: e.target.linkedinUrl?.value || "",
        portfolioUrl: e.target.portfolioUrl?.value || "",
      },
    };
    if (resume_id) {
      try {
        await updateThisResume(resume_id, data);
        toast("Resume Updated", "success");
      } catch (error) {
        toast(error.message, `failed`);
        console.log(error.message);
      } finally {
        enanbledNext(true);
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white overflow-hidden">

      {/* Section header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white px-5 py-4">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100">
          <User className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Personal Details</h2>
          <p className="text-xs text-gray-400">Your basic info that appears at the top of your resume</p>
        </div>
      </div>

      <form onSubmit={onSave} className="px-5 py-5 space-y-5">

        {/* ── Group 1: Name ── */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Full Name</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel icon={User} label="First Name" required />
              <Input
                name="firstName"
                defaultValue={resumeInfo?.firstName}
                required
                onChange={handleInputChange}
                className="h-9 text-xs border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                placeholder="John"
              />
            </div>
            <div>
              <FieldLabel icon={User} label="Last Name" required />
              <Input
                name="lastName"
                required
                onChange={handleInputChange}
                defaultValue={resumeInfo?.lastName}
                className="h-9 text-xs border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                placeholder="Doe"
              />
            </div>
          </div>
        </div>

        {/* ── Group 2: Job Title ── */}
        <div>
          <FieldLabel icon={Briefcase} label="Job Title" />
          <Input
            name="jobTitle"
            defaultValue={resumeInfo?.jobTitle}
            onChange={handleInputChange}
            className="h-9 text-xs border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
            placeholder="e.g. Senior Software Engineer"
          />
        </div>

        {/* ── Group 3: Contact ── */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Contact Info</p>
          <div className="space-y-3">
            <div>
              <FieldLabel icon={MapPin} label="Address" required />
              <Input
                name="address"
                required
                defaultValue={resumeInfo?.address}
                onChange={handleInputChange}
                className="h-9 text-xs border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                placeholder="City, State, Country"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel icon={Phone} label="Phone" required />
                <Input
                  name="phone"
                  required
                  defaultValue={resumeInfo?.phone}
                  onChange={handleInputChange}
                  className="h-9 text-xs border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <FieldLabel icon={Mail} label="Email" required />
                <Input
                  name="email"
                  type="email"
                  required
                  defaultValue={resumeInfo?.email}
                  onChange={handleInputChange}
                  className="h-9 text-xs border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Group 4: Social Links ── */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Social &amp; Portfolio</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel icon={Github} label="GitHub" />
                <Input
                  name="githubUrl"
                  placeholder="github.com/username"
                  defaultValue={resumeInfo?.githubUrl}
                  onChange={handleInputChange}
                  className="h-9 text-xs border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                />
              </div>
              <div>
                <FieldLabel icon={Linkedin} label="LinkedIn" />
                <Input
                  name="linkedinUrl"
                  placeholder="linkedin.com/in/profile"
                  defaultValue={resumeInfo?.linkedinUrl}
                  onChange={handleInputChange}
                  className="h-9 text-xs border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div>
              <FieldLabel icon={Globe} label="Portfolio Website" />
              <Input
                name="portfolioUrl"
                placeholder="yourportfolio.com"
                defaultValue={resumeInfo?.portfolioUrl}
                onChange={handleInputChange}
                className="h-9 text-xs border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* ── Save ── */}
        <div className="flex justify-end border-t border-gray-100 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 h-9 text-sm shadow-sm"
          >
            {loading ? (
              <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4" /> Save Details</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;
