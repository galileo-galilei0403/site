import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const sectionExamples = {
  title: "A concise and specific title, e.g., 'A Transformer-Based Approach to Melody Generation'",
  abstract: "Summarize background, objectives, methods, main findings, and conclusion in 150-250 words.",
  introduction: "Introduce the topic, present the research question or gap, and summarize your contributions.",
  relatedWork: "Discuss relevant prior work and how your work differs or builds on them.",
  method: "Explain what you did, how, and why. Include algorithms, models, or procedures used.",
  result: "Present key findings using text, tables, or figures. Focus on clarity and objectivity.",
  discussion: "Interpret the results, explain their significance, relate them to previous work, and discuss limitations.",
  conclusion: "Summarize key takeaways and suggest directions for future work.",
};

const templates = {
  abstract: "This study investigates [research topic]. We propose [method or approach]. Experiments show that [main result]. These findings suggest [conclusion or implication].",
  introduction: "Recent studies have shown that [context]. However, [gap or problem]. In this paper, we aim to [objective]. Our main contributions are: (1) ..., (2) ..., (3) ...",
  method: "We employed [methodology] using [tools/datasets]. The procedure involved the following steps: (1) ..., (2) ..., (3) ...",
  result: "Our model achieved [result] on [dataset]. Figure X shows [description]. This indicates that ...",
  discussion: "The results demonstrate [interpretation]. Compared to previous work, our method [advantage or difference]. One limitation is ..., which we plan to address in future work.",
  conclusion: "In summary, we presented [approach]. Our findings show that [result]. Future work includes ...",
};

const SectionInput = ({ label, value, onChange, placeholder, templateKey }) => (
  <Card className="mb-4">
    <CardContent className="space-y-2 p-4">
      <div className="flex items-center justify-between">
        <label className="font-bold text-lg">{label}</label>
        {templateKey && (
          <Popover>
            <PopoverTrigger className="text-sm text-blue-600 hover:underline">Guide</PopoverTrigger>
            <PopoverContent className="p-4 text-sm max-w-sm">
              <p className="mb-2 font-semibold">How to write this section:</p>
              <p className="mb-2">{sectionExamples[templateKey]}</p>
              <p className="mb-1 font-semibold">Template:</p>
              <p className="italic text-gray-700">{templates[templateKey]}</p>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px]"
      />
      {templateKey && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(templates[templateKey])}
        >
          Insert Template
        </Button>
      )}
    </CardContent>
  </Card>
);

export default function PaperStructureBuilder() {
  const [structureType, setStructureType] = useState("paired");
  const [sections, setSections] = useState({
    title: "",
    abstract: "",
    introduction: "",
    relatedWork: "",
    method1: "",
    result1: "",
    discussion1: "",
    method2: "",
    result2: "",
    discussion2: "",
    result3: "",
    conclusion: "",
  });

  const updateSection = (key, value) => {
    setSections((prev) => ({ ...prev, [key]: value }));
  };

  const sectionLayout = () => {
    switch (structureType) {
      case "paired":
        return ["method1", "result1", "discussion1", "method2", "result2", "discussion2"];
      case "grouped":
        return ["method1", "method2", "result1", "result2", "discussion1", "discussion2"];
      case "mergeDiscussion":
        return ["method1", "method2", "result1", "result2", "result3", "discussion2"];
      default:
        return [];
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">📝 Guided Paper Structure Builder</h1>
      <SectionInput
        label="Title"
        value={sections.title}
        onChange={(v) => updateSection("title", v)}
        placeholder={sectionExamples.title}
      />
      <SectionInput
        label="Abstract"
        value={sections.abstract}
        onChange={(v) => updateSection("abstract", v)}
        placeholder={sectionExamples.abstract}
        templateKey="abstract"
      />
      <SectionInput
        label="Introduction"
        value={sections.introduction}
        onChange={(v) => updateSection("introduction", v)}
        placeholder={sectionExamples.introduction}
        templateKey="introduction"
      />
      <SectionInput
        label="Related Work"
        value={sections.relatedWork}
        onChange={(v) => updateSection("relatedWork", v)}
        placeholder={sectionExamples.relatedWork}
      />

      <Tabs value={structureType} onValueChange={setStructureType}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="paired">Method → Result → Discussion</TabsTrigger>
          <TabsTrigger value="grouped">Methods → Results → Discussions</TabsTrigger>
          <TabsTrigger value="mergeDiscussion">Results → Discussion (Grouped)</TabsTrigger>
        </TabsList>
      </Tabs>

      {sectionLayout().map((key) => (
        <SectionInput
          key={key}
          label={key.replace(/(\d)/, " $1").replace(/([a-z])([A-Z])/, "$1 $2").toUpperCase()}
          value={sections[key] || ""}
          onChange={(v) => updateSection(key, v)}
          placeholder={sectionExamples[key.replace(/\d/, "")] || ""}
          templateKey={key.replace(/\d/, "")}
        />
      ))}

      <SectionInput
        label="Conclusion"
        value={sections.conclusion}
        onChange={(v) => updateSection("conclusion", v)}
        placeholder={sectionExamples.conclusion}
        templateKey="conclusion"
      />

      <Button className="mt-4">Export Draft</Button>
    </div>
  );
}
