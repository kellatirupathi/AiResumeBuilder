import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical, Info } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import GenericRichTextEditor from '@/components/custom/GenericRichTextEditor';
import AddSection from '@/pages/dashboard/edit-resume/components/form-components/AddSection';

function ProfileAddSection() {
    const dispatch = useDispatch();
    const profileData = useSelector(state => state.editUser.userData);
    const sections = profileData?.additionalSections || [];

    const handleUpdate = (newList) => {
        dispatch(addUserData({ ...profileData, additionalSections: newList }));
    };

    const handleAddSection = (newSection) => {
        handleUpdate([...sections, newSection]);
    };

    const handleContentChange = (index, newContent) => {
        const newList = sections.map((item, i) =>
            i === index ? { ...item, content: newContent } : item
        );
        handleUpdate(newList);
    };

    const handleRemove = (index) => {
        handleUpdate(sections.filter((_, i) => i !== index));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        handleUpdate(items);
    };

    return (
        <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-lg">
            {sections.length > 0 && (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="profile-additional-sections">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4 mb-6"
                            >
                                {sections.map((section, index) => (
                                    <Draggable
                                        key={`${section.title}-${index}`}
                                        draggableId={`${section.title}-${index}`}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`p-4 bg-white rounded-lg shadow-sm border transition-shadow ${
                                                    snapshot.isDragging ? 'shadow-lg border-indigo-400' : ''
                                                }`}
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                                                            title="Drag to reorder"
                                                        >
                                                            <GripVertical className="h-5 w-5" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-700">{section.title}</h3>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => handleRemove(index)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                                <GenericRichTextEditor
                                                    defaultValue={section.content}
                                                    onUpdate={(val) => handleContentChange(index, val)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}

            <AddSection onSectionAdd={handleAddSection} />

            <div className="mt-6 bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-blue-900">Pro Tip</h4>
                    <p className="text-sm">
                        Any sections you add here will appear at the bottom of your resume. Drag the <strong>⠿</strong> handle on any section to reorder them.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProfileAddSection;
