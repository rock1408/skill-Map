import React, { useState, useRef, useEffect, useMemo } from "react";
import { ZoomIn, ZoomOut, Maximize, RefreshCw, X, Check, ArrowRight, Play, BookOpen, ExternalLink, HelpCircle, GraduationCap, Award, FileCheck, Upload, ShieldCheck, FileText, Video, Users, Wrench, Globe } from "lucide-react";
import { RoadmapData, Phase, FreeResource, PaidCourse, ProjectBrief } from "../types";

interface SkillMapCanvasProps {
  roadmap: RoadmapData;
  completedNodes: string[];
  setCompletedNodes: React.Dispatch<React.SetStateAction<string[]>>;
  inProgressNodes: string[];
  setInProgressNodes: React.Dispatch<React.SetStateAction<string[]>>;
  proofs?: any[];
  onVerifySkill?: (skillName: string) => void;
}

interface MapNode {
  id: string;
  label: string;
  type: "central" | "phase" | "skill" | "resource" | "project" | "cert";
  status: "have" | "learn" | "critical" | "completed" | "in_progress";
  x: number;
  y: number;
  color: string;
  phaseIdx?: number;
  angle?: number;
  details?: {
    description?: string;
    objectives?: string[];
    resources?: FreeResource[];
    paidCourses?: PaidCourse[];
    projects?: ProjectBrief[];
    milestone?: string;
    weeklySchedule?: string;
  };
}

interface MapEdge {
  from: string;
  to: string;
  type: "solid" | "dashed";
}

// Custom auxiliary React Flow 'nodeTypes' configuration to ensure compatibility with flow specs
export const nodeTypes = {
  customNode: ({ data }: { data: { label: string } }) => {
    return (
      <div className="p-3.5 rounded-xl border border-white/10 bg-brand-surface text-white min-w-[140px] text-center shadow-lg hover:border-brand-secondary/40 transition-colors">
        <div className="font-semibold text-xs leading-normal break-words whitespace-normal">{data.label}</div>
      </div>
    );
  }
};

export default function SkillMapCanvas({
  roadmap,
  completedNodes,
  setCompletedNodes,
  inProgressNodes,
  setInProgressNodes,
  proofs = [],
  onVerifySkill,
}: SkillMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"constellation" | "grid">("constellation");
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(350);
  const [translateY, setTranslateY] = useState(250);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [activeTab, setActiveTab] = useState<"free" | "paid" | "projects">("free");

  // Recenter canvas on mount or resize
  const handleRecenter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTranslateX(rect.width / 2);
      setTranslateY(rect.height / 2 - 40);
      setScale(0.85);
    }
  };

  useEffect(() => {
    handleRecenter();
    window.addEventListener("resize", handleRecenter);
    return () => window.removeEventListener("resize", handleRecenter);
  }, [roadmap]);

  // Generate Map Nodes and Edges Layout using robust radial math
  const { nodes, edges } = useMemo(() => {
    const listNodes: MapNode[] = [];
    const listEdges: MapEdge[] = [];

    // 1. Central Node
    listNodes.push({
      id: "central",
      label: roadmap.targetRole,
      type: "central",
      status: "have",
      x: 0,
      y: 0,
      color: "#6366f1",
      details: {
        description: roadmap.summary,
        objectives: ["Map out steps", "Achieve milestones", "Master the skills"]
      }
    });

    const phasesCount = roadmap.phases.length;

    // 2. Phase and Skill nodes
    roadmap.phases.forEach((phase, idx) => {
      // Calculate phase angle around center
      const angle = (idx * 2 * Math.PI) / phasesCount - Math.PI / 2;
      const phaseRadius = 240;
      const px = phaseRadius * Math.cos(angle);
      const py = phaseRadius * Math.sin(angle);

      const phaseNodeId = `phase-${idx}`;
      listNodes.push({
        id: phaseNodeId,
        label: phase.title.split(":")[0], // "Phase 1"
        type: "phase",
        status: "learn",
        x: px,
        y: py,
        color: idx % 3 === 0 ? "#6366f1" : idx % 3 === 1 ? "#34d399" : "#fbbf24",
        phaseIdx: idx,
        angle: angle,
        details: {
          description: phase.title,
          objectives: phase.objectives,
          milestone: phase.milestone,
          weeklySchedule: phase.weeklySchedule,
          resources: phase.freeResources,
          paidCourses: phase.paidCourses,
          projects: phase.projects
        }
      });

      // Edge from central to phase
      listEdges.push({ from: "central", to: phaseNodeId, type: "solid" });

      // Calculate skills for this phase radiating further outward
      const skills = phase.skills || [];
      const skillCount = skills.length;
      const childRadius = 150;

      skills.forEach((skillName, sIdx) => {
        // Space skill nodes in an arc radiating outward from the phase node
        const fanAngle = Math.min(Math.PI * 0.9, (skillCount * Math.PI) / 9 + Math.PI / 6);
        const startAngle = angle - fanAngle / 2;
        const sAngle = skillCount === 1 
          ? angle 
          : startAngle + (sIdx * fanAngle) / (skillCount - 1);

        const sx = px + childRadius * Math.cos(sAngle);
        const sy = py + childRadius * Math.sin(sAngle);

        const skillId = `skill-${idx}-${sIdx}`;
        
        // Determine status dynamically
        let status: MapNode["status"] = "learn";
        if (completedNodes.includes(skillName)) status = "completed";
        else if (inProgressNodes.includes(skillName)) status = "in_progress";
        else if (roadmap.skillGaps.some(g => g.skill.toLowerCase() === skillName.toLowerCase() && g.priority === "critical")) {
          status = "critical";
        }

        listNodes.push({
          id: skillId,
          label: skillName,
          type: "skill",
          status,
          x: sx,
          y: sy,
          color: status === "completed" 
            ? "#34d399" 
            : status === "in_progress" 
            ? "#60a5fa" 
            : status === "critical" 
            ? "#f43f5e" 
            : "#71717a",
          phaseIdx: idx,
          angle: sAngle,
          details: {
            description: `Core skill in ${phase.title.split(":")[0]}. Necessary to achieve professional proficiency.`,
            resources: phase.freeResources,
            paidCourses: phase.paidCourses,
            projects: phase.projects
          }
        });

        // Edge from phase to skill
        listEdges.push({ from: phaseNodeId, to: skillId, type: "solid" });
      });
    });

    // 3. Certifications
    if (roadmap.certifications && roadmap.certifications.length > 0) {
      roadmap.certifications.forEach((cert, cIdx) => {
        const certId = `cert-${cIdx}`;
        // Place certs around top/sides
        const angle = -Math.PI / 4 - (cIdx * Math.PI) / 8;
        const radius = 420;
        const cx = radius * Math.cos(angle);
        const cy = radius * Math.sin(angle);

        listNodes.push({
          id: certId,
          label: cert.name,
          type: "cert",
          status: "learn",
          x: cx,
          y: cy,
          color: "#fbbf24",
          angle: angle,
          details: {
            description: `Certification provided by ${cert.provider}. Exam cost: $${cert.examCostUSD}. Suggested preparation time: ${cert.prepWeeks} weeks.`,
            objectives: ["Prepare according to syllabus", "Take mock exam modules"]
          }
        });

        // Edge from central to cert
        listEdges.push({ from: "central", to: certId, type: "dashed" });
      });
    }

    return { nodes: listNodes, edges: listEdges };
  }, [roadmap, completedNodes, inProgressNodes, proofs]);

  // Panning Event Listeners
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - translateX, y: e.clientY - translateY });
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setTranslateX(e.clientX - dragStart.x);
    setTranslateY(e.clientY - dragStart.y);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  // Zooming wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    let newScale = scale;
    if (e.deltaY < 0) {
      newScale = Math.min(scale * zoomFactor, 3);
    } else {
      newScale = Math.max(scale / zoomFactor, 0.4);
    }
    setScale(newScale);
  };

  // Node Toggle Operations
  const handleToggleCompleted = (label: string) => {
    setCompletedNodes((prev) => {
      const isCompleted = prev.includes(label);
      if (isCompleted) {
        return prev.filter((n) => n !== label);
      } else {
        // Remove from in progress if switching to completed
        setInProgressNodes((ip) => ip.filter((n) => n !== label));
        return [...prev, label];
      }
    });
  };

  const handleToggleInProgress = (label: string) => {
    setInProgressNodes((prev) => {
      const isInProgress = prev.includes(label);
      if (isInProgress) {
        return prev.filter((n) => n !== label);
      } else {
        // Remove from completed if switching to in progress
        setCompletedNodes((c) => c.filter((n) => n !== label));
        return [...prev, label];
      }
    });
  };

  return (
    <div
      id="skillmap-canvas-container"
      className="relative border border-white/5 bg-brand-bg rounded-2xl overflow-hidden h-[600px] flex flex-col justify-end select-none"
    >
      {/* Layout Toggle (top right) */}
      <div className="absolute top-4 right-4 z-30 flex bg-brand-surface/95 border border-white/10 rounded-xl p-1 backdrop-blur-md shadow-xl text-xs">
        <button
          onClick={() => setViewMode("constellation")}
          className={`px-3 py-1.5 rounded-lg font-bold font-sans transition-all cursor-pointer ${
            viewMode === "constellation"
              ? "bg-brand-secondary text-brand-bg shadow"
              : "text-brand-muted hover:text-white"
          }`}
        >
          Constellation Map
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`px-3 py-1.5 rounded-lg font-bold font-sans transition-all cursor-pointer ${
            viewMode === "grid"
              ? "bg-brand-secondary text-brand-bg shadow"
              : "text-brand-muted hover:text-white"
          }`}
        >
          Structured Flow Grid
        </button>
      </div>

      {viewMode === "grid" ? (
        <div className="w-full h-full overflow-y-auto p-6 pt-16 space-y-8 bg-brand-bg/95 text-left custom-scrollbar" style={{ contentVisibility: "auto" }}>
          {/* Header */}
          <div className="border-b border-white/5 pb-4">
            <span className="text-[10px] font-mono uppercase font-bold text-brand-secondary tracking-wider bg-brand-secondary/10 px-2.5 py-1 rounded-full">
              Structured Roadmap Flow
            </span>
            <h3 className="text-lg font-display font-bold text-white mt-2 leading-tight">
              {roadmap.targetRole} Path
            </h3>
            <p className="text-xs text-brand-muted mt-1 leading-relaxed max-w-2xl">
              {roadmap.summary}
            </p>
          </div>

          {/* Central Target Card */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-brand-primary/10 via-brand-secondary/10 to-brand-primary/5 border border-white/10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-secondary/20 flex items-center justify-center border border-brand-secondary/40">
              <span className="text-xl">🎯</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">Target Role</h4>
              <p className="text-base font-display font-black text-brand-secondary mt-0.5">{roadmap.targetRole}</p>
            </div>
          </div>

          {/* Phases Grid */}
          <div className="space-y-8">
            {roadmap.phases.map((phase, idx) => {
              const phaseNodeId = `phase-${idx}`;
              const phaseNode = nodes.find(n => n.id === phaseNodeId);
              const phaseSkills = nodes.filter(n => n.type === "skill" && n.phaseIdx === idx);

              return (
                <div key={idx} className="space-y-4">
                  {/* Phase Header Card */}
                  <div 
                    onClick={() => {
                      if (phaseNode) setSelectedNode(phaseNode);
                    }}
                    className="p-4 rounded-xl border border-white/10 bg-brand-surface2/80 hover:border-brand-secondary/50 hover:bg-brand-surface2 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: idx % 3 === 0 ? "#6366f1" : idx % 3 === 1 ? "#34d399" : "#fbbf24" }}>
                        {idx + 1}
                      </div>
                      <div className="text-left">
                        <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider">PHASE {idx + 1}</span>
                        <h4 className="text-sm font-bold text-white leading-tight group-hover:text-brand-secondary transition-colors">{phase.title.split(":")[1] || phase.title}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-brand-muted bg-white/5 px-2 py-1 rounded">
                        {phase.skills?.length || 0} Skills
                      </span>
                      <ArrowRight size={14} className="text-brand-muted group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Skills Grid for this Phase */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-4 border-l border-white/5">
                    {phaseSkills.map((skill) => {
                      const isCompleted = completedNodes.includes(skill.label);
                      const isInProgress = inProgressNodes.includes(skill.label);
                      const isCritical = skill.status === "critical";
                      const isVerified = proofs?.some(p => p.skillName.toLowerCase() === skill.label.toLowerCase() && p.proofImage);

                      let statusBg = "bg-white/5 border-white/5";
                      let statusText = "Pending";
                      let statusColor = "text-brand-muted";

                      if (isCompleted) {
                        statusBg = "bg-brand-secondary/10 border-brand-secondary/20";
                        statusText = "Completed";
                        statusColor = "text-brand-secondary";
                      } else if (isInProgress) {
                        statusBg = "bg-blue-500/10 border-blue-500/20";
                        statusText = "In Progress";
                        statusColor = "text-blue-400";
                      } else if (isCritical) {
                        statusBg = "bg-rose-500/10 border-rose-500/20";
                        statusText = "Critical Gap";
                        statusColor = "text-rose-400";
                      }

                      return (
                        <div
                          key={skill.id}
                          onClick={() => setSelectedNode(skill)}
                          className={`p-3 rounded-xl border hover:border-white/20 hover:bg-brand-surface2/60 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative group ${statusBg}`}
                        >
                          {/* Top part: Label & status */}
                          <div className="space-y-1.5 text-left">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${statusColor}`}>
                                {statusText}
                              </span>
                              {isVerified && (
                                <span className="text-[9px] font-mono text-brand-secondary bg-brand-secondary/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  <ShieldCheck size={10} /> Proof
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-white leading-normal break-words whitespace-normal group-hover:text-brand-secondary transition-colors">
                              {skill.label}
                            </h5>
                          </div>

                          {/* Action footer */}
                          <div className="flex items-center justify-between text-[10px] text-brand-muted pt-2 border-t border-white/5">
                            <span>Open Details</span>
                            <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Certifications Section */}
          {roadmap.certifications && roadmap.certifications.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Award className="text-yellow-500" size={18} />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">Suggested Professional Certifications</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roadmap.certifications.map((cert, cIdx) => {
                  const certNodeId = `cert-${cIdx}`;
                  const certNode = nodes.find(n => n.id === certNodeId);

                  return (
                    <div
                      key={cIdx}
                      onClick={() => {
                        if (certNode) setSelectedNode(certNode);
                      }}
                      className="p-3.5 rounded-xl border border-yellow-500/10 hover:border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 cursor-pointer transition-all flex items-start gap-3 text-left group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-yellow-500/15 flex items-center justify-center shrink-0 border border-yellow-500/30">
                        <GraduationCap size={16} className="text-yellow-400" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-yellow-400 font-bold uppercase tracking-wider">{cert.provider}</span>
                        <h5 className="text-xs font-bold text-white leading-snug group-hover:text-yellow-400 transition-colors">{cert.name}</h5>
                        <p className="text-[10px] text-brand-muted leading-relaxed">Prep: {cert.prepWeeks} weeks • Exam: ${cert.examCostUSD}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Zoom and recenter panel (bottom left) */}
          <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2 bg-brand-surface/90 border border-white/10 rounded-xl p-2 backdrop-blur-md shadow-xl">
            <button
              onClick={() => setScale(prev => Math.min(prev + 0.15, 3))}
              title="Zoom In"
              className="p-2 rounded-lg bg-brand-bg hover:bg-white/5 border border-white/5 hover:border-white/15 text-white transition-all cursor-pointer"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setScale(prev => Math.max(prev - 0.15, 0.4))}
              title="Zoom Out"
              className="p-2 rounded-lg bg-brand-bg hover:bg-white/5 border border-white/5 hover:border-white/15 text-white transition-all cursor-pointer"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={handleRecenter}
              title="Recenter"
              className="p-2 rounded-lg bg-brand-bg hover:bg-white/5 border border-white/5 hover:border-white/15 text-white transition-all cursor-pointer"
            >
              <Maximize size={16} />
            </button>
          </div>

          {/* Main interactive canvas area */}
          <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
      >
        <svg
          className="w-full h-full"
          style={{ transformOrigin: "0px 0px" }}
        >
          {/* Constellation Nodes and Edges Group */}
          <g transform={`translate(${translateX}, ${translateY}) scale(${scale})`}>
            
            {/* Draw connections first (behind nodes) */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const isCompleted = fromNode.status === "completed" && toNode.status === "completed";
              const strokeColor = isCompleted ? "#34d399" : "rgba(255, 255, 255, 0.12)";
              const strokeDash = edge.type === "dashed" ? "5,5" : "none";

              return (
                <g key={`edge-${idx}`}>
                  {/* Base line */}
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={strokeColor}
                    strokeWidth={edge.type === "dashed" ? 1.5 : 2.5}
                    strokeDasharray={strokeDash}
                    className="transition-all duration-300"
                  />
                  {/* Glowing moving particles */}
                  {!isCompleted && edge.type === "solid" && (
                    <circle r="2.5" className="fill-brand-secondary">
                      <animateMotion
                        dur="6s"
                        repeatCount="indefinite"
                        path={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Draw nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              
              // Custom styles based on node type
              let r = 18;
              let fontSize = "10px";
              let fillBg = "#18181b";
              let borderStroke = "rgba(255, 255, 255, 0.15)";
              let labelColor = "#d4d4d8";

              if (node.type === "central") {
                r = 28;
                fontSize = "12px";
                fillBg = "#6366f1";
                borderStroke = "#34d399";
                labelColor = "#FFFFFF";
              } else if (node.type === "phase") {
                r = 22;
                fontSize = "11px";
                fillBg = "#27272a";
                borderStroke = node.color;
                labelColor = "#FFFFFF";
              } else if (node.type === "skill") {
                r = 13;
                const isVerifiedNode = proofs?.some(
                  (p) => p.skillName.toLowerCase() === node.label.toLowerCase() && p.proofImage
                );
                
                fillBg = isVerifiedNode
                  ? "#0f766e" // Deep teal for verified
                  : node.status === "completed" 
                  ? "#34d399" 
                  : node.status === "in_progress" 
                  ? "#60a5fa" 
                  : node.status === "critical" 
                  ? "#f43f5e" 
                  : "#18181b";
                  
                borderStroke = isVerifiedNode
                  ? "#2dd4bf" // Bright teal for verified glow
                  : node.status === "completed" 
                  ? "#34d399" 
                  : node.status === "in_progress" 
                  ? "#60a5fa" 
                  : node.status === "critical" 
                  ? "#f43f5e" 
                  : "#3f3f46";
              } else if (node.type === "cert") {
                r = 12;
                fillBg = "#fbbf24";
                borderStroke = "#fbbf24";
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Selection glow */}
                  {isSelected && (
                    <circle
                      r={r + 8}
                      className="fill-none stroke-brand-secondary stroke-[2] animate-pulse"
                    />
                  )}

                  {/* Verified glow ring */}
                  {node.type === "skill" && proofs?.some((p) => p.skillName.toLowerCase() === node.label.toLowerCase() && p.proofImage) && (
                    <circle
                      r={r + 4}
                      className="fill-none stroke-brand-secondary stroke-[1.2] opacity-75"
                      strokeDasharray="3, 2"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={r}
                    fill={fillBg}
                    stroke={borderStroke}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-300 group-hover:scale-110"
                  />

                  {/* Type indicator icon overlay */}
                  {node.type === "central" && (
                    <circle r="4" fill="#FFFFFF" />
                  )}

                  {/* Node label text with halo effect and smart radial alignment */}
                  {(() => {
                    let textX = 0;
                    let textY = 0;
                    let textAnchor = "middle";
                    let dy = "0.3em";

                    if (node.type === "central") {
                      textX = 0;
                      textY = 40;
                      textAnchor = "middle";
                      dy = "0.3em";
                    } else {
                      const radialAngle = node.angle ?? 0;
                      const textDist = r + 15; // spacing from node border

                      textX = textDist * Math.cos(radialAngle);
                      textY = textDist * Math.sin(radialAngle);

                      const cosVal = Math.cos(radialAngle);
                      if (cosVal > 0.3) {
                        textAnchor = "start";
                      } else if (cosVal < -0.3) {
                        textAnchor = "end";
                      } else {
                        textAnchor = "middle";
                      }

                      const sinVal = Math.sin(radialAngle);
                      if (sinVal > 0.5) {
                        dy = "0.8em";
                      } else if (sinVal < -0.5) {
                        dy = "-0.3em";
                      } else {
                        dy = "0.3em";
                      }
                    }

                    // Wrap long labels into beautiful multi-line labels
                    const wrapText = (text: string, maxCharsPerLine = 15): string[] => {
                      if (text.length <= maxCharsPerLine) return [text];
                      const words = text.split(" ");
                      const lines: string[] = [];
                      let currentLine = "";
                      
                      words.forEach((word) => {
                        if (currentLine === "") {
                          currentLine = word;
                        } else if ((currentLine + " " + word).length <= maxCharsPerLine) {
                          currentLine += " " + word;
                        } else {
                          lines.push(currentLine);
                          currentLine = word;
                        }
                      });
                      if (currentLine !== "") {
                        lines.push(currentLine);
                      }
                      if (lines.length > 2) {
                        return [lines[0], lines[1] + "..."];
                      }
                      return lines;
                    };

                    const labelLines = wrapText(node.label);

                    return (
                      <>
                        {/* Background halo for legibility against lines */}
                        <text
                          x={textX}
                          y={textY}
                          dy={dy}
                          textAnchor={textAnchor}
                          stroke="#0D0F14"
                          strokeWidth={4}
                          strokeLinejoin="round"
                          fontSize={fontSize}
                          fontWeight={node.type === "central" || node.type === "phase" ? "bold" : "normal"}
                          className="pointer-events-none font-display font-semibold select-none opacity-95"
                        >
                          {labelLines.map((line, lineIdx) => (
                            <tspan
                              key={lineIdx}
                              x={textX}
                              dy={lineIdx === 0 ? (labelLines.length > 1 ? "-0.4em" : "0") : "1.2em"}
                            >
                              {line}
                            </tspan>
                          ))}
                        </text>

                        {/* Foreground text */}
                        <text
                          x={textX}
                          y={textY}
                          dy={dy}
                          textAnchor={textAnchor}
                          fill={labelColor}
                          fontSize={fontSize}
                          fontWeight={node.type === "central" || node.type === "phase" ? "bold" : "normal"}
                          className="pointer-events-none font-display font-semibold select-none transition-colors duration-200 group-hover:fill-white"
                        >
                          {labelLines.map((line, lineIdx) => (
                            <tspan
                              key={lineIdx}
                              x={textX}
                              dy={lineIdx === 0 ? (labelLines.length > 1 ? "-0.4em" : "0") : "1.2em"}
                            >
                              {line}
                            </tspan>
                          ))}
                        </text>
                      </>
                    );
                  })()}
                </g>
              );
            })}

          </g>
        </svg>
      </div>
    </>
  )}

  {/* Backdrop blur overlay on mobile screens when side drawer is active */}
  {selectedNode && (
    <div 
      className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[45] transition-opacity duration-300 sm:hidden cursor-pointer"
      onClick={() => setSelectedNode(null)}
    />
  )}

  {/* Side drawer for Node Details (slides in from right) */}
  <div
    className={`absolute top-0 right-0 h-full w-full sm:w-[380px] bg-brand-surface border-l border-white/10 shadow-2xl z-50 transition-transform duration-300 transform flex flex-col justify-between ${
      selectedNode ? "translate-x-0" : "translate-x-full"
    }`}
  >
        {selectedNode && (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/8 flex items-center justify-between bg-brand-surface2">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {selectedNode.type === "central" ? "🎯" : selectedNode.type === "phase" ? "🗺️" : "🔑"}
                </span>
                <span className="font-display font-bold text-white text-sm truncate max-w-[200px]">
                  {selectedNode.label}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-full hover:bg-white/10 text-brand-muted hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-left">
              {/* Type and Description */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded border border-brand-secondary/20">
                  {selectedNode.type} NODE
                </span>
                <p className="text-sm text-brand-body leading-relaxed">
                  {selectedNode.details?.description}
                </p>
              </div>

              {/* Status Indicator */}
              {selectedNode.type === "skill" && (
                <div className="bg-brand-bg/50 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs text-brand-muted font-mono font-medium">STATUS</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleToggleInProgress(selectedNode.label)}
                      className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                        inProgressNodes.includes(selectedNode.label)
                          ? "bg-blue-600 text-white"
                          : "bg-white/5 text-brand-muted hover:text-white"
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleToggleCompleted(selectedNode.label)}
                      className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                        completedNodes.includes(selectedNode.label)
                          ? "bg-brand-secondary text-brand-bg"
                          : "bg-white/5 text-brand-muted hover:text-white"
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              )}

              {/* Project Proof Verification Card inside side drawer */}
              {selectedNode.type === "skill" && (
                <div className="bg-brand-bg/60 border border-white/8 rounded-xl p-4 space-y-3">
                  <span className="block text-xs font-mono font-bold text-brand-muted uppercase tracking-wider">
                    🏆 Project Proof Verification
                  </span>
                  
                  {proofs?.some((p) => p.skillName.toLowerCase() === selectedNode.label.toLowerCase() && p.proofImage) ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-brand-secondary font-mono font-bold">
                        <ShieldCheck size={16} className="text-brand-secondary animate-pulse" />
                        <span>VERIFIED COMPLETION PROOF</span>
                      </div>
                      <p className="text-[11px] text-brand-muted leading-relaxed">
                        A project proof has been uploaded and anchored to this skill node, validating your knowledge.
                      </p>
                      <button
                        onClick={() => onVerifySkill?.(selectedNode.label)}
                        className="w-full py-2 rounded-xl text-xs font-mono font-bold bg-brand-secondary/10 hover:bg-brand-secondary text-brand-secondary hover:text-brand-bg border border-brand-secondary/35 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        🛡️ Inspect Proof Artifact
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-[11px] text-brand-muted leading-relaxed">
                        To claim a verified badge and complete this skill node, upload a project screenshot or generate an AI technical schematic.
                      </p>
                      <button
                        onClick={() => onVerifySkill?.(selectedNode.label)}
                        className="w-full py-2.5 rounded-xl text-xs font-mono font-bold bg-brand-primary text-white hover:brightness-110 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-brand-primary/10 font-bold"
                      >
                        🛡️ Verify Skill with Project Proof
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Objectives */}
              {selectedNode.details?.objectives && (
                <div className="space-y-2">
                  <span className="block text-xs font-bold font-mono text-brand-muted uppercase tracking-wide">
                    Objectives
                  </span>
                  <ul className="space-y-1.5">
                    {selectedNode.details.objectives.map((obj, i) => (
                      <li key={i} className="text-xs text-brand-body flex items-start gap-2">
                        <Check size={12} className="text-brand-secondary shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resources / Tabs Section (Only for Phase / Skills) */}
              {(selectedNode.type === "skill" || selectedNode.type === "phase") && (
                <div className="space-y-3">
                  <div className="flex border-b border-white/5 font-mono text-xs">
                    <button
                      onClick={() => setActiveTab("free")}
                      className={`flex-1 pb-2 font-bold border-b-2 text-center transition-colors cursor-pointer ${
                        activeTab === "free" ? "border-brand-secondary text-brand-secondary" : "border-transparent text-brand-muted hover:text-white"
                      }`}
                    >
                      Free
                    </button>
                    <button
                      onClick={() => setActiveTab("paid")}
                      className={`flex-1 pb-2 font-bold border-b-2 text-center transition-colors cursor-pointer ${
                        activeTab === "paid" ? "border-brand-primary text-brand-primary" : "border-transparent text-brand-muted hover:text-white"
                      }`}
                    >
                      Paid (Affiliate)
                    </button>
                    <button
                      onClick={() => setActiveTab("projects")}
                      className={`flex-1 pb-2 font-bold border-b-2 text-center transition-colors cursor-pointer ${
                        activeTab === "projects" ? "border-brand-accent text-brand-accent" : "border-transparent text-brand-muted hover:text-white"
                      }`}
                    >
                      Projects
                    </button>
                  </div>

                  {/* Tab Items */}
                  <div className="space-y-2">
                    {activeTab === "free" && (
                      <div className="space-y-2">
                        {selectedNode.details?.resources?.slice(0, 2).map((res, i) => {
                          const getIcon = () => {
                            switch (res.type?.toLowerCase()) {
                              case "video":
                                return <Video size={11} className="text-brand-secondary shrink-0" />;
                              case "docs":
                                return <FileText size={11} className="text-brand-secondary shrink-0" />;
                              case "book":
                                return <BookOpen size={11} className="text-brand-secondary shrink-0" />;
                              case "community":
                                return <Users size={11} className="text-brand-secondary shrink-0" />;
                              case "tool":
                                return <Wrench size={11} className="text-brand-secondary shrink-0" />;
                              default:
                                return <Globe size={11} className="text-brand-secondary shrink-0" />;
                            }
                          };

                          return (
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={i}
                              className="block p-2.5 rounded-xl border border-white/5 hover:border-brand-secondary/30 bg-brand-bg/40 hover:bg-brand-surface/30 transition-all flex items-start justify-between group"
                            >
                              <div className="space-y-0.5 text-left">
                                <div className="flex items-center gap-1">
                                  {getIcon()}
                                  <span className="text-[10px] font-mono text-brand-secondary uppercase leading-none">{res.type}</span>
                                </div>
                                <h5 className="text-xs font-bold text-white leading-snug group-hover:text-brand-secondary transition-colors mt-0.5">
                                  {res.title}
                                </h5>
                                <span className="block text-[10px] text-brand-muted">{res.platform} ({res.estimatedHours}h)</span>
                              </div>
                              <ExternalLink size={12} className="text-brand-muted group-hover:text-white shrink-0 ml-2 mt-0.5" />
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {activeTab === "paid" && (
                      <div className="space-y-2">
                        {selectedNode.details?.paidCourses?.slice(0, 2).map((course, i) => (
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={i}
                            className="block p-2.5 rounded-xl border border-white/5 hover:border-brand-primary/30 bg-brand-bg/40 hover:bg-brand-surface/30 transition-all flex items-start justify-between group"
                          >
                            <div className="space-y-0.5 text-left">
                              <span className="text-[9px] font-mono text-brand-primary-light font-bold uppercase bg-brand-primary/10 px-1 py-0.5 rounded">
                                {course.platform} • AFFILIATE
                              </span>
                              <h5 className="text-xs font-bold text-white leading-snug group-hover:text-brand-primary transition-colors mt-1">
                                {course.title}
                              </h5>
                              <span className="block text-[10px] text-brand-muted">By {course.instructor} • ${course.priceUSD}</span>
                            </div>
                            <ExternalLink size={12} className="text-brand-muted group-hover:text-white shrink-0 ml-2" />
                          </a>
                        ))}
                      </div>
                    )}

                    {activeTab === "projects" && (
                      <div className="space-y-2">
                        {selectedNode.details?.projects?.slice(0, 2).map((proj, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl border border-white/5 bg-brand-bg/40 space-y-2"
                          >
                            <div className="text-left">
                              <span className="text-[9px] font-mono text-brand-accent uppercase bg-brand-accent/10 px-1 py-0.5 rounded">
                                {proj.difficulty}
                              </span>
                              <h5 className="text-xs font-bold text-white mt-1">{proj.title}</h5>
                              <p className="text-[10px] text-brand-muted mt-0.5">{proj.description}</p>
                            </div>
                            {proj.steps && (
                              <div className="pt-2 border-t border-white/5 space-y-1">
                                {proj.steps.slice(0, 2).map((step, sIdx) => (
                                  <div key={sIdx} className="text-[9px] text-brand-body flex gap-1 items-start">
                                    <span className="text-brand-accent font-bold">{sIdx + 1}.</span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions inside drawer */}
            <div className="p-4 bg-brand-surface2 border-t border-white/8 text-xs text-brand-muted font-sans text-left">
              💡 Completed skills turn green on your mind map instantly!
            </div>
          </>
        )}
      </div>

    </div>
  );
}
