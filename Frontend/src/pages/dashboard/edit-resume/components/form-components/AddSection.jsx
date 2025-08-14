import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PlusCircle, Award, Globe, Heart, BookOpen, Microscope, Languages } from 'lucide-react';

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
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="w-full border-dashed" onClick={() => setIsOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Section
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
            <DialogDescription>
              Choose a suggested section or create your own.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <h4 className="font-medium text-sm text-gray-600">Suggested Sections</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {predefinedSections.map(section => (
                <Button key={section.title} variant="outline" className="justify-start gap-2" onClick={() => handleAdd(section.title)}>
                  {section.icon}
                  {section.title}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t">
              <Input
                placeholder="Or create a custom section (e.g., Hobbies)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd(customTitle)}
              />
              <Button onClick={() => handleAdd(customTitle)} disabled={!customTitle.trim()}>
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddSection;
