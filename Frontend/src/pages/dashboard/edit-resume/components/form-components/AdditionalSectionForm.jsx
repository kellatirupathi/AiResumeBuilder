import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Save, GripVertical } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { updateThisResume } from '@/Services/resumeAPI';
import { toast } from 'sonner';
import GenericRichTextEditor from '@/components/custom/GenericRichTextEditor';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function AdditionalSectionForm({ resumeInfo, onUpdate }) {
  const { resume_id } = useParams();

  const handleContentChange = (index, newContent) => {
    const originalList = resumeInfo.additionalSections || [];
    const newList = originalList.map((item, i) => {
      if (i === index) {
        return { ...item, content: newContent };
      }
      return item;
    });
    onUpdate(newList);
  };

  const handleRemove = async (index) => {
    const originalList = [...(resumeInfo.additionalSections || [])];
    const newList = originalList.filter((_, i) => i !== index);
    onUpdate(newList);

    if (!resume_id) return;

    try {
      await updateThisResume(resume_id, { data: { additionalSections: newList } });
      toast.success("Section removed successfully.");
    } catch {
      toast.error("Failed to remove section. Reverting change.");
      onUpdate(originalList);
    }
  };

  const onSave = async () => {
    if (!resume_id) return;
    try {
      await updateThisResume(resume_id, { data: { additionalSections: resumeInfo.additionalSections } });
      toast.success("Additional sections saved successfully.");
    } catch (error) {
      toast.error("Failed to save sections:", { description: error.message });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(resumeInfo.additionalSections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onUpdate(items);
  };

  if (!resumeInfo.additionalSections || resumeInfo.additionalSections.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="additional-sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {resumeInfo.additionalSections.map((section, index) => (
                <Draggable
                  key={`${section.title}-${index}`}
                  draggableId={`${section.title}-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`overflow-hidden rounded-lg border border-gray-100 bg-white transition-shadow ${
                        snapshot.isDragging ? 'border-violet-300 shadow-lg' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab text-gray-400 hover:text-violet-600 active:cursor-grabbing"
                            title="Drag to reorder"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <h3 className="text-xs font-medium text-gray-700">{section.title}</h3>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:bg-red-50 hover:text-red-500" onClick={() => handleRemove(index)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <GenericRichTextEditor
                          defaultValue={section.content}
                          onUpdate={(val) => handleContentChange(index, val)}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="flex justify-end">
        <Button onClick={onSave} className="h-8 gap-2 bg-violet-600 px-4 text-xs text-white hover:bg-violet-700">
          <Save className="h-3.5 w-3.5" /> Save Sections
        </Button>
      </div>
    </div>
  );
}

export default AdditionalSectionForm;
