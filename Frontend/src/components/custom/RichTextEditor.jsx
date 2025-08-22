// import React, { useEffect, useState } from "react";
// import {
//   BtnBold,
//   BtnBulletList,
//   BtnItalic,
//   BtnLink,
//   BtnNumberedList,
//   BtnStrikeThrough,
//   BtnUnderline,
//   Editor,
//   EditorProvider,
//   Separator,
//   Toolbar,
// } from "react-simple-wysiwyg";
// import { AIChatSession } from "@/Services/AiModel";
// import { Button } from "../ui/button";
// import { toast } from "sonner";
// import { Sparkles, LoaderCircle } from "lucide-react";

// const PROMPT = `Create a JSON object with the following fields:
//     "position_Title": A string representing the job title.
//     "experience": An array of strings, each representing a bullet point describing relevant experience for the given job title in HTML format using <li> tags.
// For the Job Title "{positionTitle}", create a JSON object with the following fields:
// The experience array should contain 5-7 bullet points wrapped in <li> tags (e.g., "<li>Resolved customer issues...</li>"). Each bullet point should be a concise description of a relevant skill, responsibility, or achievement.`;function RichTextEditor({ onRichTextEditorChange, index, resumeInfo }) {
//   const [value, setValue] = useState(
//     resumeInfo?.experience[index]?.workSummary || ""
//   );
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     onRichTextEditorChange(value);
//   }, [value]);

//   const GenerateSummaryFromAI = async () => {
//     if (!resumeInfo?.experience[index]?.title) {
//       toast("Please Add Position Title");
//       return;
//     }
//     setLoading(true);

//     const prompt = PROMPT.replace(
//       "{positionTitle}",
//       resumeInfo.experience[index].title
//     );
//     const result = await AIChatSession.sendMessage(prompt);
//     console.log(typeof result.response.text());
//     console.log(JSON.parse(result.response.text()));
//     const resp = JSON.parse(result.response.text());
//     await setValue(
//       resp.experience
//         ? resp.experience?.join("")
//         : resp.experience_bullets?.join("")
//     );
//     setLoading(false);
//   };

//   return (
//     <div>
//       <div className="flex justify-between my-2">
//         <label className="text-xs">Summery</label>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={GenerateSummaryFromAI}
//           disabled={loading}
//           className="flex gap-2 border-primary text-primary"
//         >
//           {loading ? (
//             <LoaderCircle className="animate-spin" />
//           ) : (
//             <>
//               <Sparkles className="h-4 w-4" /> Generate from AI
//             </>
//           )}
//         </Button>
//       </div>
//       <EditorProvider>
//         <Editor
//           value={value}
//           onChange={(e) => {
//             setValue(e.target.value);
//             onRichTextEditorChange(value);
//           }}
//         >
//           <Toolbar>
//             <BtnBold />
//             <BtnItalic />
//             <BtnUnderline />
//             <BtnStrikeThrough />
//             <Separator />
//             <BtnNumberedList />
//             <BtnBulletList />
//             <Separator />
//             <BtnLink />
//           </Toolbar>
//         </Editor>
//       </EditorProvider>
//     </div>
//   );
// }

// export default RichTextEditor;

import React, { useEffect, useState } from "react";
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
import { AIChatSession } from "@/Services/AiModel";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Sparkles, LoaderCircle, Wand2 } from "lucide-react";

const PROMPT_GENERATE = `Create a JSON object with the following fields:
    "position_Title": A string representing the job title.
    "experience": An array of strings, each representing a bullet point describing relevant experience for the given job title in HTML format using <li> tags.
For the Job Title "{positionTitle}", create a JSON object with the following fields:
The experience array should contain 5-7 bullet points wrapped in <li> tags (e.g., "<li>Resolved customer issues...</li>"). Each bullet point should be a concise description of a relevant skill, responsibility, or achievement.`;

const PROMPT_ENHANCE = `You are a professional resume writer. Rephrase the following work experience summary to be more achievement-oriented and impactful for a {positionTitle}. Use action verbs and quantify results where possible. Return the result as a JSON object with a single key "experience" containing an array of HTML list items (e.g., ["<li>Enhanced the user interface...</li>", "<li>Reduced server response time by 30%...</li>"]).
Original summary: 
"{workSummary}"
`;

function RichTextEditor({ onRichTextEditorChange, index, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.experience[index]?.workSummary || ""
  );
  const [loading, setLoading] = useState(false);
  const [enhanceLoading, setEnhanceLoading] = useState(false);

  // Sync state if the prop changes
  useEffect(() => {
    const newSummary = resumeInfo?.experience[index]?.workSummary || "";
    if (value !== newSummary) {
      setValue(newSummary);
    }
  }, [resumeInfo?.experience[index]?.workSummary]);

  const GenerateSummaryFromAI = async () => {
    if (!resumeInfo?.experience[index]?.title) {
      toast("First Click Save the Section and then Next Click on Generate");
      return;
    }
    setLoading(true);

    const prompt = PROMPT_GENERATE.replace(
      "{positionTitle}",
      resumeInfo.experience[index].title
    );
    try {
      const result = await AIChatSession.sendMessage(prompt);
      const resp = JSON.parse(result.response.text());
      const aiText =
        resp.experience
          ? `<ul>${resp.experience?.join("")}</ul>`
          : `<ul>${resp.experience_bullets?.join("")}</ul>`;

      setValue(aiText);
      onRichTextEditorChange(aiText); // FIX: Immediately propagate the change
    } catch (error) {
      toast.error("Failed to generate summary from AI.");
    } finally {
      setLoading(false);
    }
  };
  
  const EnhanceFromAI = async () => {
    const currentSummary = value.replace(/<[^>]*>?/gm, ' ').trim();
    if (!resumeInfo?.experience[index]?.title) {
      toast("First Click Save the Section and then Next Click on Enhance.");
      return;
    }
    if (!currentSummary) {
      toast("Please write a summary before enhancing.");
      return;
    }
    setEnhanceLoading(true);

    const prompt = PROMPT_ENHANCE
      .replace("{positionTitle}", resumeInfo.experience[index].title)
      .replace("{workSummary}", currentSummary);

    try {
      const result = await AIChatSession.sendMessage(prompt);
      const resp = JSON.parse(result.response.text());
      const enhancedSummary = Array.isArray(resp.experience) 
        ? `<ul>${resp.experience.join("")}</ul>` 
        : resp.experience;

      setValue(enhancedSummary);
      onRichTextEditorChange(enhancedSummary); // FIX: Immediately propagate the change
      toast.success("Experience summary enhanced by AI!");
    } catch (error) {
      console.error("Enhance error:", error);
      toast.error("Failed to enhance summary.");
    } finally {
      setEnhanceLoading(false);
    }
  };

  const handleEditorChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onRichTextEditorChange(newValue);
  };
  
  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={EnhanceFromAI}
            disabled={loading || enhanceLoading || !value.trim()}
            className="flex gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            {enhanceLoading ? (
              <LoaderCircle className="animate-spin h-4 w-4" />
            ) : (
              <><Wand2 className="h-4 w-4" /> Enhance</>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={GenerateSummaryFromAI}
            disabled={loading || enhanceLoading}
            className="flex gap-2 border-primary text-primary"
          >
            {loading ? (
              <LoaderCircle className="animate-spin h-4 w-4" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate
              </>
            )}
          </Button>
        </div>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={handleEditorChange}
        >
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
    </div>
  );
}

export default RichTextEditor;
