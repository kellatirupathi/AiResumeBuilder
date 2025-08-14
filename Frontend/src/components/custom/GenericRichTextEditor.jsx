import React, { useState, useEffect } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";

// A simple, reusable rich text editor without AI features.
function GenericRichTextEditor({ defaultValue, onUpdate }) {
  const [value, setValue] = useState(defaultValue || "");

  // Update internal state if the default value from props changes
  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  // Notify parent component on every change
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onUpdate) {
      onUpdate(newValue);
    }
  };

  return (
    <EditorProvider>
      <Editor value={value} onChange={handleChange}>
        <Toolbar>
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnStrikeThrough />
          <Separator />
          <BtnNumberedList />
          <BtnBulletList />
          <Separator />
          <BtnLink />
        </Toolbar>
      </Editor>
    </EditorProvider>
  );
}

export default GenericRichTextEditor;
