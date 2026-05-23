'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Topic } from '@/types';

interface KnowledgeGraphProps {
  topics: Topic[];
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ topics }) => {
  const { nodes, edges } = useMemo(() => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];

    // Simple vertical layout mapping for AP CSA Units
    // Ideally we'd use a layout engine like dagre for complex graphs
    const layoutMap: Record<string, { x: number; y: number }> = {
      'U1': { x: 250, y: 0 },
      'U2': { x: 100, y: 100 },
      'U3': { x: 400, y: 100 },
      'U4': { x: 400, y: 200 },
      'U5': { x: 100, y: 200 },
      'U6': { x: 400, y: 300 },
      'U7': { x: 250, y: 400 },
      'U8': { x: 550, y: 400 },
      'U9': { x: 100, y: 300 },
      'U10': { x: 250, y: 500 },
    };

    topics.forEach((topic) => {
      const position = layoutMap[topic.id] || { x: Math.random() * 400, y: Math.random() * 400 };
      
      initialNodes.push({
        id: topic.id,
        data: { label: topic.title },
        position,
        style: { 
          background: '#fff', 
          border: '2px solid #4f46e5', 
          borderRadius: '8px',
          padding: '10px',
          fontSize: '12px',
          fontWeight: 'bold',
          width: 150,
          textAlign: 'center'
        },
      });

      topic.prerequisites?.forEach((prereq) => {
        initialEdges.push({
          id: `e${prereq.id}-${topic.id}`,
          source: prereq.id,
          target: topic.id,
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#4f46e5',
          },
          style: { stroke: '#4f46e5', strokeWidth: 2 },
        });
      });
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [topics]);

  return (
    <div style={{ width: '100%', height: '600px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default KnowledgeGraph;
