import React from "react";
import { Mail, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function AddCoverLetter({ viewMode = "grid" }) {
  const navigate = useNavigate();
  const handleCreate = () => navigate("/cover-letter/creation-part");

  if (viewMode === "list") {
    return (
      <div
        onClick={handleCreate}
        className="add-cover-letter-trigger flex items-center justify-between rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 group cursor-pointer overflow-hidden"
      >
        <div className="flex items-center flex-1">
          <div className="w-1 h-full self-stretch bg-gradient-to-b from-emerald-500 to-indigo-500 opacity-40 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-3 pl-4">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Create New Cover Letter
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Generate a tailored cover letter from your resume in seconds
            </p>
          </div>
        </div>

        <div className="p-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
            <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCreate}
      className="add-cover-letter-trigger flex flex-col items-center justify-center h-[348px] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5 cursor-pointer group transition-all duration-300"
    >
      <div className="w-14 h-14 mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-indigo-100 dark:from-emerald-900/40 dark:to-indigo-900/40 flex items-center justify-center group-hover:from-emerald-500 group-hover:to-indigo-600 transition-colors duration-300">
        <Mail className="w-7 h-7 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        Create New Cover Letter
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 max-w-[200px]">
        Generate a tailored cover letter from your resume with AI
      </p>
    </motion.div>
  );
}

export default AddCoverLetter;
