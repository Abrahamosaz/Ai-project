"use client";

import EditorNavbar from "./EditorNavbar";

interface EditorFormProps {
  id: string;
}

const EditorForm: React.FC<EditorFormProps> = ({ id }) => {
  return (
    <div className="w-full">
      <EditorNavbar />
      <div className="pt-20 bg-[#FAFAFA] min-h-screen">EditorForm</div>
    </div>
  );
};

export default EditorForm;
