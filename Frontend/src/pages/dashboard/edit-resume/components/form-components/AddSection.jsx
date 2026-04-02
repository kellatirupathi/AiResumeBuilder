import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PlusCircle, Award, Heart, BookOpen, Microscope, Languages, Sparkles } from 'lucide-react';

const predefinedSections = [
  { title: "Awards and Achievements", icon: <Award className="h-4 w-4" /> },
  { title: "Languages", icon: <Languages className="h-4 w-4" /> },
  { title: "Volunteer Experience", icon: <Heart className="h-4 w-4" /> },
  { title: "Publications", icon: <BookOpen className="h-4 w-4" /> },
  { title: "Research", icon: <Microscope className="h-4 w-4" /> }
];

function AddSection({ onSectionAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');

  const handleAdd = (title) => {
    if (title.trim()) {
      onSectionAdd({ title: title.trim(), content: '' });
      setCustomTitle('');
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <Button variant="outline" className="h-8 w-full border-dashed border-violet-200 text-xs text-violet-600 hover:bg-violet-50" onClick={() => setIsOpen(true)}>
          <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> Add Section
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-gray-200 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                <Sparkles className="h-4 w-4 text-violet-600" />
              </span>
              Add New Section
            </DialogTitle>
            <DialogDescription>
              Choose a suggested section or create a custom one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <h4 className="text-sm font-medium text-gray-600">Suggested Sections</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {predefinedSections.map(section => (
                <Button key={section.title} variant="outline" className="h-10 justify-start gap-2 border-gray-200 text-sm text-gray-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700" onClick={() => handleAdd(section.title)}>
                  {section.icon}
                  {section.title}
                </Button>
              ))}
            </div>

            <div className="border-t pt-4">
              <p className="mb-2 text-sm font-medium text-gray-600">Custom Section</p>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Or create a custom section (e.g., Hobbies)"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(customTitle)}
                  className="h-9 border-gray-200 text-sm focus:border-violet-400"
                />
                <Button onClick={() => handleAdd(customTitle)} disabled={!customTitle.trim()} className="h-9 bg-violet-600 px-4 text-sm text-white hover:bg-violet-700">
                  Add
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddSection;
