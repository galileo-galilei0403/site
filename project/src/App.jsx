import React, { useState } from "react";
import { saveAs } from 'file-saver';
import "./index.css";

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

const generateLatex = (sections, structureType) => {
  const latexContent = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage[colorlinks=true, allcolors=blue]{hyperref}

\\title{${sections.title || 'Paper Title'}}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
${sections.abstract || ''}
\\end{abstract}

\\section{Introduction}
${sections.introduction || ''}

\\section{Related Work}
${sections.relatedWork || ''}

${structureType === 'grouped' ? `
\\section{Methods}
${sections.method1 || ''}
${sections.method2 || ''}

\\section{Results}
${sections.result1 || ''}
${sections.result2 || ''}

\\section{Discussion}
${sections.discussion1 || ''}
${sections.discussion2 || ''}` : 
`
\\section{First Experiment}
\\subsection{Method}
${sections.method1 || ''}

\\subsection{Results}
${sections.result1 || ''}

\\subsection{Discussion}
${sections.discussion1 || ''}

\\section{Second Experiment}
\\subsection{Method}
${sections.method2 || ''}

\\subsection{Results}
${sections.result2 || ''}

\\subsection{Discussion}
${sections.discussion2 || ''}`}

\\section{Conclusion}
${sections.conclusion || ''}

\\end{document}`;

  return latexContent;
};

const SectionInput = ({ label, value, onChange, placeholder, templateKey, isTitle }) => (
  <div className={`mb-8 p-6 border rounded-lg bg-white shadow-sm ${isTitle ? 'w-full' : ''}`}>
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-xl font-bold text-gray-800">{label}</label>
        {templateKey && (
          <div className="text-sm text-gray-600">
            {sectionExamples[templateKey]}
          </div>
        )}
      </div>
      <textarea
        className={`w-full border rounded-lg p-4 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          isTitle ? 'min-h-[100px]' : 'min-h-[200px]'
        }`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {templateKey && (
        <button
          className="self-start px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          onClick={() => onChange(templates[templateKey])}
        >
          Insert Template
        </button>
      )}
    </div>
  </div>
);

export default function App() {
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
    conclusion: "",
  });

  const updateSection = (key, value) => {
    setSections((prev) => ({ ...prev, [key]: value }));
  };

  const sectionLayout = () => {
    switch (structureType) {
      case "paired":
        return [
          { key: "method1", label: "Method 1" },
          { key: "result1", label: "Result 1" },
          { key: "discussion1", label: "Discussion 1" },
          { key: "method2", label: "Method 2" },
          { key: "result2", label: "Result 2" },
          { key: "discussion2", label: "Discussion 2" }
        ];
      case "grouped":
        return [
          { key: "method1", label: "Method 1" },
          { key: "method2", label: "Method 2" },
          { key: "result1", label: "Result 1" },
          { key: "result2", label: "Result 2" },
          { key: "discussion1", label: "Discussion 1" },
          { key: "discussion2", label: "Discussion 2" }
        ];
      default:
        return [];
    }
  };

  const handleExport = () => {
    const latexContent = generateLatex(sections, structureType);
    const blob = new Blob([latexContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'paper.tex');
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📝 Guided Paper Structure Builder</h1>

      <div className="mb-8">
        <label className="text-lg font-semibold text-gray-700 mr-4">Structure Style:</label>
        <select
          className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={structureType}
          onChange={(e) => setStructureType(e.target.value)}
        >
          <option value="paired">Method → Result → Discussion</option>
          <option value="grouped">Methods → Results → Discussions</option>
        </select>
      </div>

      <SectionInput
        label="Title"
        value={sections.title}
        onChange={(v) => updateSection("title", v)}
        placeholder={sectionExamples.title}
        isTitle={true}
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

      {sectionLayout().map(({ key, label }) => (
        <SectionInput
          key={key}
          label={label}
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

      <button
        onClick={handleExport}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Export as LaTeX
      </button>
    </div>
  );
}
