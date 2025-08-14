import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUserData } from '@/features/user/userFeatures';
import ManageAdditionalSections from '@/pages/dashboard/edit-resume/components/form-components/ManageAdditionalSections';

function ProfileAddSection() {
    const dispatch = useDispatch();
    const profileData = useSelector(state => state.editUser.userData);

    const handleUpdate = (newList) => {
        dispatch(addUserData({ ...profileData, additionalSections: newList }));
    };
    
    // The ManageAdditionalSections component handles its own internal state and calls `onUpdate`
    // which is mapped to our handleUpdate function that dispatches to Redux.
    const mockResumeInfo = {
        ...profileData,
        additionalSections: profileData?.additionalSections || [],
    };
    
    return (
        <div>
            <ManageAdditionalSections 
              resumeInfo={mockResumeInfo}
              // The component internally calls a Redux dispatch on change.
              // So, we don't need a direct save here. Saving is global.
            />
        </div>
    );
}

export default ProfileAddSection;
