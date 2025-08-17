// C:\Users\NxtWave\Downloads\code\Frontend\src\pages\profile\components\SelectPortfolioTemplateModal.jsx (New File)
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye } from 'lucide-react';
import { motion } from "framer-motion";

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Choose a Portfolio Template</DialogTitle>
                    <DialogDescription>
                        Select a template that best showcases your professional story.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {templates.map(template => (
                        <motion.div
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                                selectedTemplate === template.id ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-gray-200'
                            }`}
                            whileHover={{ scale: 1.03 }}
                        >
                            <img src={template.previewUrl} alt={template.name} className="w-full h-auto" />
                            {selectedTemplate === template.id && (
                                <div className="absolute inset-0 bg-indigo-500 bg-opacity-70 flex items-center justify-center">
                                    <CheckCircle className="h-10 w-10 text-white" />
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                <p className="text-white font-medium text-center text-sm">{template.name}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onSelect(selectedTemplate)} disabled={loading}>
                        {loading ? 'Generating...' : 'Generate with this Template'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default SelectPortfolioTemplateModal;
