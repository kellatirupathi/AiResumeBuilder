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
// "projectName": A string representing the project
// "techStack": A string representing the project tech stack
// "projectSummary": An array of strings, ONLY in bullet point list format (using <li> HTML tags).

// Each bullet point in the projectSummary array should describe a specific feature, achievement, or responsibility for the project. Focus on technical implementation details, key challenges overcome, and specific technologies used from the tech stack.

// Make sure the output is ONLY in HTML list format with each point wrapped in <li> tags.

// For Project: "{projectName}"
// Tech Stack: "{techStack}"

// Example format for projectSummary:
// [
//   "<li>Implemented responsive user interface using React.js and Tailwind CSS</li>",
//   "<li>Developed RESTful API endpoints with Node.js and Express</li>",
//   "<li>Set up CI/CD pipeline using GitHub Actions for automated testing and deployment</li>"
// ]`;

// function SimpeRichTextEditor({ index, onRichTextEditorChange, resumeInfo }) {
//   const [value, setValue] = useState(
//     resumeInfo?.projects[index]?.projectSummary || ""
//   );
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     onRichTextEditorChange(value);
//   }, [value]);

//   // Function to ensure content is in list format
//   const ensureListFormat = (content) => {
//     // Check if content already has list items
//     if (content.includes("<li>")) return content;
    
//     // If it's empty, return empty string
//     if (!content || content.trim() === "") return "";
    
//     // If it's a paragraph or plain text, convert to list
//     const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");
    
//     // If no content found after filtering, return empty
//     if (lines.length === 0) return "";
    
//     // Create list items from each line
//     const listItems = lines.map(line => {
//       // Remove any bullet points or numbers that might be at the start of the line
//       const cleanLine = line.replace(/^[•\-\*\d\.\s]+/, "").trim();
//       return `<li>${cleanLine}</li>`;
//     });
    
//     return `<ul>${listItems.join("")}</ul>`;
//   };

//   const GenerateSummaryFromAI = async () => {
//     if (
//       !resumeInfo?.projects[index]?.projectName ||
//       !resumeInfo?.projects[index]?.techStack
//     ) {
//       toast("Add Project Name and Tech Stack to generate summary");
//       return;
//     }
//     setLoading(true);

//     try {
//       const prompt = PROMPT.replace(
//         "{projectName}",
//         resumeInfo?.projects[index]?.projectName
//       ).replace("{techStack}", resumeInfo?.projects[index]?.techStack);
      
//       console.log("Prompt", prompt);
//       const result = await AIChatSession.sendMessage(prompt);
      
//       let response;
//       try {
//         response = JSON.parse(result.response.text());
//       } catch (error) {
//         console.error("Error parsing AI response:", error);
//         toast.error("Could not parse AI response properly. Trying to fix formatting...");
        
//         // Attempt to extract a list from the response text
//         const text = result.response.text();
//         const listItems = text.match(/<li>(.*?)<\/li>/g);
        
//         if (listItems && listItems.length > 0) {
//           response = { projectSummary: listItems };
//         } else {
//           // If no list items found, create our own
//           const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
//           response = { 
//             projectSummary: lines.map(line => `<li>${line.replace(/^[•\-\*\d\.\s]+/, "").trim()}</li>`) 
//           };
//         }
//       }
      
//       console.log("Response", response);
      
//       // Ensure the response is in list format
//       let summaryContent;
//       if (Array.isArray(response.projectSummary)) {
//         summaryContent = response.projectSummary.join("");
//       } else if (typeof response.projectSummary === 'string') {
//         summaryContent = response.projectSummary;
//       } else {
//         // Fallback if projectSummary is not in expected format
//         toast.warning("AI response format was unexpected. Creating list format manually.");
//         summaryContent = "<li>Project created using " + resumeInfo?.projects[index]?.techStack + "</li>";
//       }
      
//       // Ensure the content is wrapped in an unordered list if not already
//       if (!summaryContent.includes("<ul>")) {
//         summaryContent = `<ul>${summaryContent}</ul>`;
//       }
      
//       // Apply the new value
//       await setValue(summaryContent);
//     } catch (error) {
//       console.error("Error during AI summary generation:", error);
//       toast.error("Failed to generate summary. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between my-2">
//         <label className="text-xs">Summary</label>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={GenerateSummaryFromAI}
//           disabled={loading}
//           className="flex gap-2 border-primary text-primary"
//         >
//           {loading ? (
//             <LoaderCircle className="h-4 w-4 animate-spin" />
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
//             onRichTextEditorChange(e.target.value);
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

// export default SimpeRichTextEditor;

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
"projectName": A string representing the project
"techStack": A string representing the project tech stack
"projectSummary": An array of strings, ONLY in bullet point list format (using <li> HTML tags).

Each bullet point in the projectSummary array should describe a specific feature, achievement, or responsibility for the project. Focus on technical implementation details, key challenges overcome, and specific technologies used from the tech stack.

Make sure the output is ONLY in HTML list format with each point wrapped in <li> tags.

For Project: "{projectName}"
Tech Stack: "{techStack}"

Example format for projectSummary:
[
  "<li>Implemented responsive user interface using React.js and Tailwind CSS</li>",
  "<li>Developed RESTful API endpoints with Node.js and Express</li>",
  "<li>Set up CI/CD pipeline using GitHub Actions for automated testing and deployment</li>"
]`;

const PROMPT_ENHANCE = `You are a technical writer. Enhance the following project summary for a resume to be more compelling and focused on technical achievements and impact. The project is named "{projectName}" and uses the following technologies: "{techStack}". Use action verbs. Return the result as a JSON object with a single key "projectSummary" containing an array of HTML list items (e.g., ["<li>Developed a full-stack e-commerce platform...</li>", "<li>Integrated Stripe for payment processing...</li>"]).
Original summary:
"{projectSummary}"
`;
function SimpeRichTextEditor({ index, onRichTextEditorChange, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.projects[index]?.projectSummary || ""
  );
  const [loading, setLoading] = useState(false);
  const [enhanceLoading, setEnhanceLoading] = useState(false);


  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    if (
      !resumeInfo?.projects[index]?.projectName ||
      !resumeInfo?.projects[index]?.techStack
    ) {
      toast("Add Project Name and Tech Stack to generate summary");
      return;
    }
    setLoading(true);

    try {
      const prompt = PROMPT_GENERATE.replace(
        "{projectName}",
        resumeInfo?.projects[index]?.projectName
      ).replace("{techStack}", resumeInfo?.projects[index]?.techStack);
      
      const result = await AIChatSession.sendMessage(prompt);
      
      let response;
      try {
        response = JSON.parse(result.response.text());
      } catch (error) {
        console.error("Error parsing AI response:", error);
        toast.error("Could not parse AI response properly. Trying to fix formatting...");
        
        const text = result.response.text();
        const listItems = text.match(/<li>(.*?)<\/li>/g);
        
        if (listItems && listItems.length > 0) {
          response = { projectSummary: listItems };
        } else {
          const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
          response = { 
            projectSummary: lines.map(line => `<li>${line.replace(/^[•\-\*\d\.\s]+/, "").trim()}</li>`) 
          };
        }
      }
      
      let summaryContent;
      if (Array.isArray(response.projectSummary)) {
        summaryContent = response.projectSummary.join("");
      } else if (typeof response.projectSummary === 'string') {
        summaryContent = response.projectSummary;
      } else {
        toast.warning("AI response format was unexpected. Creating list format manually.");
        summaryContent = "<li>Project created using " + resumeInfo?.projects[index]?.techStack + "</li>";
      }
      
      if (!summaryContent.includes("<ul>")) {
        summaryContent = `<ul>${summaryContent}</ul>`;
      }
      
      await setValue(summaryContent);
    } catch (error) {
      console.error("Error during AI summary generation:", error);
      toast.error("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const EnhanceFromAI = async () => {
    const currentSummary = value.replace(/<[^>]*>?/gm, ' ').trim();
    if (
      !resumeInfo?.projects[index]?.projectName ||
      !resumeInfo?.projects[index]?.techStack
    ) {
      toast("Please add a Project Name and Tech Stack for better suggestions.");
      return;
    }
    if (!currentSummary) {
      toast("Please write a summary before enhancing.");
      return;
    }
    setEnhanceLoading(true);

    try {
        const prompt = PROMPT_ENHANCE
          .replace("{projectName}", resumeInfo.projects[index].projectName)
          .replace("{techStack}", resumeInfo.projects[index].techStack)
          .replace("{projectSummary}", currentSummary);

        const result = await AIChatSession.sendMessage(prompt);
        const resp = JSON.parse(result.response.text());
        const enhancedSummary = Array.isArray(resp.projectSummary) 
          ? `<ul>${resp.projectSummary.join("")}</ul>` 
          : resp.projectSummary;

        setValue(enhancedSummary);
        toast.success("Project summary enhanced by AI!");
    } catch(error) {
        console.error("Enhance error:", error);
        toast.error("Failed to enhance summary.");
    } finally {
        setEnhanceLoading(false);
    }
  }

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
                <LoaderCircle className="h-4 w-4 animate-spin" />
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
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e.target.value);
          }}
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

export default SimpeRichTextEditor;
