import React, { useState, useEffect } from "react";
import { Sparkles, Upload, Trash2, ShieldCheck, Check, X, RefreshCw, AlertCircle, Calendar, FileImage } from "lucide-react";

interface ProofItem {
  id: string;
  userId: string | null;
  roadmapId: string;
  skillName: string;
  proofType: "upload" | "ai_generated";
  proofImage: string; // Base64 or SVG string
  aiPrompt?: string;
  verifiedAt: string;
}

interface ProjectProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  roadmapId: string;
  userId: string | null;
  existingProof?: ProofItem;
  onProofSaved: (proof: ProofItem) => void;
  onProofDeleted?: (skillName: string) => void;
  onToggleCompleted: (label: string, shouldBeCompleted: boolean) => void;
}

export default function ProjectProofModal({
  isOpen,
  onClose,
  skillName,
  roadmapId,
  userId,
  existingProof,
  onProofSaved,
  onProofDeleted,
  onToggleCompleted,
}: ProjectProofModalProps) {
  const [activeTab, setActiveTab] = useState<"capture" | "view">(existingProof ? "view" : "capture");
  const [proofType, setProofType] = useState<"upload" | "ai_generated">("upload");
  const [aiPrompt, setAiPrompt] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(existingProof?.proofImage || null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Sync state if existingProof changes or modal reopens
  useEffect(() => {
    if (isOpen) {
      if (existingProof) {
        setActiveTab("view");
        setCapturedImage(existingProof.proofImage);
        setProofType(existingProof.proofType);
        setAiPrompt(existingProof.aiPrompt || "");
      } else {
        setActiveTab("capture");
        setCapturedImage(null);
        setProofType("upload");
        setAiPrompt("");
      }
      setAiError(null);
    }
  }, [isOpen, existingProof]);

  // Upload custom proof file from device files
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate proof image using server Gemini SVG endpoint
  const handleGenerateAIProof = async () => {
    setIsGeneratingAI(true);
    setAiError(null);
    try {
      const res = await fetch("/api/generate-proof-placeholder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillName,
          prompt: aiPrompt || `High-fidelity technical blueprint proving mastery in ${skillName}`,
        }),
      });

      if (!res.ok) throw new Error("Could not contact server image generator");
      const data = await res.json();
      if (data.svg) {
        setCapturedImage(data.svg);
      } else {
        throw new Error("Invalid schematic generated");
      }
    } catch (err: any) {
      setAiError(err.message || "Failed to generate visual blueprint.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Save proof and verify
  const handleSubmitProof = async () => {
    if (!capturedImage) return;

    try {
      const res = await fetch("/api/save-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          roadmapId,
          skillName,
          proofType,
          proofImage: capturedImage,
          aiPrompt: proofType === "ai_generated" ? aiPrompt : "",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onProofSaved(data.proof);
        
        // Auto-complete the skill node upon successful verification!
        onToggleCompleted(skillName, true);
        
        onClose();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save verification proof");
      }
    } catch (err) {
      console.error("Save proof error:", err);
      alert("Network error. Please try again.");
    }
  };

  // Delete proof
  const handleDeleteProof = async () => {
    if (!confirm("Are you sure you want to discard this verified project proof? This will revoke completion verification status.")) return;
    
    try {
      const res = await fetch("/api/save-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          roadmapId,
          skillName,
          proofType: "upload",
          proofImage: "", // Empty to clear
          aiPrompt: "",
        }),
      });

      if (res.ok) {
        if (onProofDeleted) {
          onProofDeleted(skillName);
        }
        onToggleCompleted(skillName, false); // Mark uncompleted too
        setCapturedImage(null);
        setActiveTab("capture");
        onClose();
      }
    } catch (err) {
      console.error("Failed to delete proof", err);
    }
  };

  if (!isOpen) return null;

  const isSvg = capturedImage?.startsWith("<svg") || capturedImage?.includes("<svg");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-brand-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/8 bg-brand-surface2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-brand-secondary/15 rounded-lg border border-brand-secondary/25 text-brand-secondary">
              <ShieldCheck size={18} />
            </span>
            <div>
              <h3 className="font-display font-bold text-white text-base">Progress Proof Verification</h3>
              <p className="text-[10px] font-mono text-brand-muted uppercase">Skill: {skillName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/8 text-brand-muted hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Toggle (View existing or Submit new) */}
          {existingProof && (
            <div className="flex bg-brand-bg/60 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab("view")}
                className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                  activeTab === "view"
                    ? "bg-white/10 text-white shadow"
                    : "text-brand-muted hover:text-white"
                }`}
              >
                🛡️ View Verified Proof
              </button>
              <button
                onClick={() => setActiveTab("capture")}
                className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                  activeTab === "capture"
                    ? "bg-white/10 text-white shadow"
                    : "text-brand-muted hover:text-white"
                }`}
              >
                🔄 Submit New Proof
              </button>
            </div>
          )}

          {activeTab === "view" && capturedImage && (
            <div className="space-y-4 text-left animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand-muted uppercase">
                  Verified Completion Proof Artifact
                </span>
                <span className="text-[10px] font-mono font-bold bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary px-2 py-0.5 rounded flex items-center gap-1">
                  <Check size={10} strokeWidth={3} /> VERIFIED STATUS
                </span>
              </div>

              {/* Render either uploaded snapshot or SVG */}
              <div className="aspect-video w-full rounded-xl bg-[#08080c] border border-white/8 overflow-hidden flex items-center justify-center relative group">
                {isSvg ? (
                  <div
                    className="w-full h-full text-white"
                    dangerouslySetInnerHTML={{ __html: capturedImage || "" }}
                  />
                ) : (
                  <img src={capturedImage} alt="Project Proof snapshot" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Metadata block */}
              <div className="p-4 bg-brand-bg/50 border border-white/5 rounded-xl space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-2">
                  <div>
                    <span className="text-brand-muted block text-[10px]">VERIFICATION DATE</span>
                    <span className="text-white font-bold flex items-center gap-1.5 mt-0.5">
                      <Calendar size={12} className="text-brand-secondary" />
                      {existingProof ? new Date(existingProof.verifiedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-muted block text-[10px]">PROOF TYPE</span>
                    <span className="text-white font-bold uppercase mt-0.5">
                      {proofType === "ai_generated" ? "🤖 AI Generated Schematic" : "📁 Uploaded Project Proof"}
                    </span>
                  </div>
                </div>

                {existingProof?.aiPrompt && (
                  <div>
                    <span className="text-brand-muted block text-[10px]">AI MODEL PROMPT PRESET</span>
                    <p className="text-brand-primary-light mt-0.5 whitespace-pre-wrap leading-relaxed bg-brand-primary/5 p-2 rounded border border-brand-primary/10">
                      {existingProof.aiPrompt}
                    </p>
                  </div>
                )}

                <p className="text-[11px] font-sans text-brand-muted leading-relaxed pt-1">
                  💡 This project proof is securely anchored to this skill node, instantly completing the branch on your interactive Mind Map!
                </p>
              </div>

              {/* View panel actions */}
              <div className="flex justify-end pt-2 border-t border-white/5">
                <button
                  onClick={handleDeleteProof}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 size={13} /> Discard Proof & Status
                </button>
              </div>
            </div>
          )}

          {activeTab === "capture" && (
            <div className="space-y-5 text-left animate-fade-in">
              {/* Selector for upload style */}
              <div className="space-y-2">
                <span className="block text-xs font-mono font-bold text-brand-muted uppercase font-sans">
                  CHOOSE VERIFICATION TECHNIQUE
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setProofType("upload");
                      setCapturedImage(null);
                    }}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      proofType === "upload"
                        ? "border-brand-primary bg-brand-primary/5 text-white"
                        : "border-white/5 bg-brand-bg/40 hover:bg-brand-bg text-brand-body hover:text-white"
                    }`}
                  >
                    <span className={`p-2 rounded-lg border shrink-0 mt-0.5 ${
                      proofType === "upload" ? "bg-brand-primary/15 border-brand-primary/20 text-brand-primary-light" : "bg-white/5 border-white/5 text-brand-muted"
                    }`}>
                      <Upload size={16} />
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-sm">📁 Upload Project Proof</h4>
                      <p className="text-[10px] text-brand-muted leading-normal">
                        Select and upload an image file of your finished application code, interface design, or technical diagrams.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setProofType("ai_generated");
                      setCapturedImage(null);
                    }}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      proofType === "ai_generated"
                        ? "border-brand-primary bg-brand-primary/5 text-white"
                        : "border-white/5 bg-brand-bg/40 hover:bg-brand-bg text-brand-body hover:text-white"
                    }`}
                  >
                    <span className={`p-2 rounded-lg border shrink-0 mt-0.5 ${
                      proofType === "ai_generated" ? "bg-brand-primary/15 border-brand-primary/20 text-brand-primary-light" : "bg-white/5 border-white/5 text-brand-muted"
                    }`}>
                      <Sparkles size={16} />
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-sm">🤖 AI Schematic</h4>
                      <p className="text-[10px] text-brand-muted leading-normal">
                        Submit a text description and let Gemini model generate a custom vector project blueprint.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Render Upload viewport */}
              {proofType === "upload" && (
                <div className="space-y-4">
                  {!capturedImage ? (
                    <div className="space-y-3">
                      <div className="aspect-video w-full rounded-xl bg-[#08080c] border border-dashed border-white/10 hover:border-brand-primary/40 transition-colors overflow-hidden flex flex-col items-center justify-center p-6 text-center relative">
                        <Upload size={32} className="text-brand-muted mb-3" />
                        <div>
                          <p className="text-sm text-white font-medium mb-1">Drag and drop your project screenshot here</p>
                          <p className="text-xs text-brand-muted mb-4">PNG, JPG, or SVG up to 10MB</p>
                          
                          <label className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-brand-primary text-white hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer mx-auto w-fit shadow-lg shadow-brand-primary/25">
                            <Upload size={13} /> Choose Image File
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-brand-muted">
                        <span>Uploaded Proof Preview:</span>
                        <button
                          onClick={() => setCapturedImage(null)}
                          className="text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw size={11} /> Choose a different file
                        </button>
                      </div>
                      <div className="aspect-video w-full rounded-xl bg-[#08080c] border border-brand-primary/30 overflow-hidden relative">
                        <img src={capturedImage} alt="Uploaded project proof preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Render AI generator panel */}
              {proofType === "ai_generated" && (
                <div className="space-y-4">
                  {!capturedImage ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-mono text-brand-muted">
                          PROJECT PROOF SPECIFICATIONS & ARTIFACT DESCRIPTION
                        </label>
                        <textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder={`Describe what you built to learn ${skillName} (e.g. "I coded a fully responsive React Dashboard with dynamic sidebar, circular progress meters, custom visual charts, and high-fidelity modular layout.")`}
                          className="w-full h-24 p-3 bg-brand-surface border border-white/8 rounded-xl text-sm focus:border-brand-primary outline-none transition-all placeholder-brand-muted text-white resize-none"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleGenerateAIProof}
                          disabled={isGeneratingAI}
                          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-brand-primary text-white hover:brightness-110 disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-brand-primary/20"
                        >
                          {isGeneratingAI ? (
                            <>
                              <RefreshCw size={13} className="animate-spin" /> Coding Custom Vector Artifact...
                            </>
                          ) : (
                            <>
                              <Sparkles size={13} /> Generate Vector Artifact
                            </>
                          )}
                        </button>
                      </div>

                      {aiError && (
                        <div className="p-3 bg-rose-600/10 border border-rose-500/25 rounded-xl text-xs text-rose-400 flex items-start gap-2">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <span>{aiError}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-brand-muted">
                        <span>AI Generated Vector Artifact Preview:</span>
                        <button
                          onClick={() => setCapturedImage(null)}
                          className="text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw size={11} /> Reset / Rewrite Prompt
                        </button>
                      </div>
                      <div className="aspect-video w-full rounded-xl bg-[#08080c] border border-brand-secondary/30 overflow-hidden flex items-center justify-center relative">
                        {isSvg ? (
                          <div
                            className="w-full h-full text-white"
                            dangerouslySetInnerHTML={{ __html: capturedImage }}
                          />
                        ) : (
                          <img src={capturedImage} alt="AI Generated Graphic" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions panel */}
        <div className="p-4 bg-brand-surface2 border-t border-white/8 flex items-center justify-between">
          <span className="text-[10px] font-mono text-brand-muted max-w-[280px] text-left leading-tight">
            💡 Verifying completion automatically completes this node and turns its branch vibrant green in real-time!
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white/5 hover:bg-white/10 text-brand-body hover:text-white transition-all cursor-pointer border border-white/5"
            >
              Cancel
            </button>
            
            {activeTab === "capture" && (
              <button
                onClick={handleSubmitProof}
                disabled={!capturedImage}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-brand-secondary text-brand-bg hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1 shadow-lg shadow-brand-secondary/15 font-extrabold"
              >
                <Check size={14} strokeWidth={3} /> Verify Skill Completion
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
