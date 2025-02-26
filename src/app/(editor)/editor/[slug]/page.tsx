import EditorForm from "@/components/editor/EditorForm";

const FlowEditorPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  return (
    <div>
      <EditorForm id={slug} />
    </div>
  );
};

export default FlowEditorPage;
