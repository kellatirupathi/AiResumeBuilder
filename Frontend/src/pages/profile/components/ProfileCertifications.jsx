import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Award, Plus, Trash2 } from 'lucide-react';
import DatePicker from '@/components/custom/DatePicker'; // <-- IMPORT THE NEW COMPONENT

const emptyCertification = { name: "", issuer: "", date: "", credentialLink: "" };

function ProfileCertifications() {
    const dispatch = useDispatch();
    const profileData = useSelector(state => state.editUser.userData);
    const certificationsList = profileData?.certifications || [];

    const handleUpdate = (newList) => {
        dispatch(addUserData({ ...profileData, certifications: newList }));
    };

    const handleAdd = () => handleUpdate([...certificationsList, emptyCertification]);
    const handleRemove = (index) => handleUpdate(certificationsList.filter((_, i) => i !== index));

    const handleChange = (index, field, value) => {
        const newList = certificationsList.map((item, i) => i === index ? { ...item, [field]: value } : item);
        handleUpdate(newList);
    };

    return (
        <div className="p-8 bg-white rounded-xl shadow-md border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-lg">

            <div className="space-y-6">
                {certificationsList.map((cert, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50/50 relative">
                        <Button variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500 hover:bg-red-100 hover:text-red-600" onClick={() => handleRemove(index)}><Trash2 className="h-4 w-4" /></Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium">Certification Name</label>
                                <Input value={cert.name} onChange={(e) => handleChange(index, 'name', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-medium">Issuing Organization</label>
                                <Input value={cert.issuer} onChange={(e) => handleChange(index, 'issuer', e.target.value)} />
                            </div>
                            {/* --- START: UPDATED DATE PICKER for MONTH/YEAR --- */}
                            <div>
                                <label className="text-xs font-medium">Date Received</label>
                                <DatePicker 
                                  name="date"
                                  label="Select month & year"
                                  value={cert.date}
                                  onChange={(e) => handleChange(index, 'date', e.target.value)}
                                  selects="month" // This prop makes it a month/year picker
                                />
                            </div>
                             {/* --- END: UPDATED DATE PICKER --- */}
                             <div>
                                <label className="text-xs font-medium">Credential Link</label>
                                <Input value={cert.credentialLink} onChange={(e) => handleChange(index, 'credentialLink', e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6"><Button variant="outline" className="w-full" onClick={handleAdd}><Plus className="h-4 w-4 mr-2" /> Add Certification</Button></div>
        </div>
    );
}

export default ProfileCertifications;
