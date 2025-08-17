import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Info, Ban, LoaderCircle, LayoutTemplate } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const templates = [
    {
        id: 'portfolio-classic',
        name: 'Classic Portfolio',
        previewUrl: 'https://res.cloudinary.com/dg8n2jeur/image/upload/v1755439652/Screenshot_2025-08-17_193545_calgbl.png'
    },
    {
        id: 'portfolio-modern',
        name: 'Modern Portfolio',
        previewUrl: 'https://res.cloudinary.com/dg8n2jeur/image/upload/v1755439651/Screenshot_2025-08-17_193716_ftacb9.png'
    }
];

function SelectPortfolioTemplateModal({ isOpen, onClose, onSelect, loading }) {
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
    const [profileConfirmed, setProfileConfirmed] = useState(false);
    const [isHoveringDisabled, setIsHoveringDisabled] = useState(false);
    const navigate = useNavigate();

    // Reset state when the modal opens or closes
    useEffect(() => {
        if (!isOpen) {
            setProfileConfirmed(false);
            setIsHoveringDisabled(false);
        }
    }, [isOpen]);

    const handleConfirmYes = () => {
        setProfileConfirmed(true);
    };

    const handleConfirmNo = () => {
        onClose();
        navigate('/profile');
    };

    const isGenerateDisabled = loading || !profileConfirmed;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <LayoutTemplate className="h-6 w-6 text-indigo-500" />
                        Choose Portfolio Template
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Select a layout that best showcases your professional story.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="py-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {templates.map(template => (
                            <motion.div
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                                className={`relative cursor-pointer border-2 rounded-xl overflow-hidden transition-all duration-300 group ${
                                    selectedTemplate === template.id ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-gray-200 dark:border-gray-700'
                                }`}
                                whileHover={{ scale: 1.02, y: -2 }}
                            >
                                <img src={template.previewUrl} alt={template.name} className="w-full h-auto" />

                                <AnimatePresence>
                                    {selectedTemplate === template.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="absolute top-3 right-3 w-7 h-7 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            <CheckCircle className="h-5 w-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                    <p className="text-white font-semibold text-center">{template.name}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Enhanced confirmation section */}
                    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="text-center">
                            <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Ready to Generate?</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                                For the best results, ensure your profile details are complete. This creates the most comprehensive portfolio.
                            </p>
                        </div>
                        
                        <div className="flex justify-center gap-3">
                            <Button
                                variant="outline"
                                onClick={handleConfirmNo}
                                className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                            >
                                I need to update my profile
                            </Button>
                            <Button
                                onClick={handleConfirmYes}
                                className={`transition-all ${
                                    profileConfirmed
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-white hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100'
                                }`}
                            >
                                <CheckCircle className={`h-4 w-4 mr-2 transition-transform ${profileConfirmed ? 'scale-110' : 'scale-100'}`} />
                                Yes, my profile is ready
                            </Button>
                        </div>

                        <AnimatePresence>
                        {profileConfirmed && (
                             <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className=""
                             >
                             </motion.p>
                        )}
                        </AnimatePresence>
                    </div>
                </div>

                <DialogFooter className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="ghost" className="dark:text-slate-400" onClick={onClose}>Cancel</Button>
                    <div
                        onMouseEnter={() => {
                            if (isGenerateDisabled) setIsHoveringDisabled(true);
                        }}
                        onMouseLeave={() => setIsHoveringDisabled(false)}
                        className="relative"
                    >
                        <Button
                            onClick={() => onSelect(selectedTemplate)}
                            disabled={isGenerateDisabled}
                            className={`w-52 transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:text-indigo-100 dark:disabled:text-indigo-400 disabled:cursor-not-allowed`}
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={isGenerateDisabled && isHoveringDisabled ? "disabled" : loading ? "loading" : "active"}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : isGenerateDisabled && isHoveringDisabled ? (
                                        <Ban className="h-5 w-5 text-red-500" />
                                    ) : (
                                        'Generate'
                                    )}
                                </motion.span>
                            </AnimatePresence>
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default SelectPortfolioTemplateModal;
