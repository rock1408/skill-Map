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
      const phaseRadius = 180;
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
      const childRadius = 110;

      skills.forEach((skillName, sIdx) => {
        // Space skill nodes in an arc radiating outward from the phase node
        const fanAngle = Math.PI / 2.5; // arc range
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
        const radius = 340;
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
    <div className="relative border border-white/5 bg-brand-bg rounded-2xl overflow-hidden h-[500px] flex flex-col justify-end select-none">
      
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
              let textOffset = 24;
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

                  {/* Node label text */}
                  <text
                    y={node.type === "central" || node.type === "phase" ? 0 : textOffset}
                    dy={node.type === "central" || node.type === "phase" ? "0.3em" : "0"}
                    textAnchor="middle"
                    fill={labelColor}
                    fontSize={fontSize}
                    fontWeight={node.type === "central" || node.type === "phase" ? "bold" : "normal"}
                    className="pointer-events-none font-display font-medium select-none shadow-sm transition-colors duration-200 group-hover:fill-white"
                  >
                    {node.label.length > 20 ? `${node.label.substring(0, 18)}...` : node.label}
                  </text>
                </g>
              );
            })}

          </g>
        </svg>
      </div>

      {/* Side drawer for Node Details (slides in from right) */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-[380px] bg-brand-surface border-l border-white/10 shadow-2xl z-40 transition-transform duration-300 transform flex flex-col justify-between ${
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
