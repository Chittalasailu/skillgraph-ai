import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import api from '../services/api'
import Spinner from './Spinner'

const NODE_COLORS = {
  Person: '#2563eb',
  Skill: '#16a34a',
  Role: '#f97316',
  Company: '#7c3aed',
  Technology: '#06b6d4',
  Vulnerability: '#ef4444',
}

const DEFAULT_NODE_COLOR = '#475569'
const GRID_COLUMNS = 8
const GRID_X_STEP = 250
const GRID_Y_STEP = 180

function getNodeColor(type) {
  return NODE_COLORS[type] || DEFAULT_NODE_COLOR
}

function createDebugGridPosition(index) {
  return {
    x: (index % GRID_COLUMNS) * GRID_X_STEP,
    y: Math.floor(index / GRID_COLUMNS) * GRID_Y_STEP,
  }
}

function normalizeGraph(data) {
  if (!data) return { nodes: [], edges: [] }
  if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
    return { nodes: data.nodes, edges: data.edges }
  }

  const nodes = []
  const edges = []

  if (Array.isArray(data.persons)) {
    data.persons.forEach((person) => {
      nodes.push({ id: String(person.id), label: person.name, type: 'Person' })
    })
  }
  if (Array.isArray(data.skills)) {
    data.skills.forEach((skill) => {
      nodes.push({ id: String(skill.id), label: skill.name, type: 'Skill' })
    })
  }
  if (Array.isArray(data.roles)) {
    data.roles.forEach((role) => {
      nodes.push({ id: String(role.id), label: role.name, type: 'Role' })
    })
  }
  if (Array.isArray(data.companies)) {
    data.companies.forEach((company) => {
      nodes.push({ id: String(company.id), label: company.name, type: 'Company' })
    })
  }
  if (Array.isArray(data.technologies)) {
    data.technologies.forEach((technology) => {
      nodes.push({ id: String(technology.id), label: technology.name, type: 'Technology' })
    })
  }
  if (Array.isArray(data.vulnerabilities)) {
    data.vulnerabilities.forEach((vulnerability) => {
      nodes.push({ id: String(vulnerability.id), label: vulnerability.name, type: 'Vulnerability' })
    })
  }

  if (Array.isArray(data.relationships)) {
    data.relationships.forEach((rel, index) => {
      if (rel.source && rel.target && rel.type) {
        edges.push({
          id: String(rel.id ?? `edge-${index}`),
          source: String(rel.source),
          target: String(rel.target),
          label: rel.type,
        })
      }
    })
  }

  return { nodes, edges }
}

export default function GraphView({ selectedPerson }) {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNode, setSelectedNode] = useState(null)
  const flowRef = useRef(null)

  // Keep nodeTypes stable across renders to avoid React Flow warning about recreated objects
  const nodeTypes = useMemo(() => ({}), [])

  const normalizedSearch = searchTerm.trim().toLowerCase()

  useEffect(() => {
    let active = true

    async function loadGraph() {
      try {
        setLoading(true)
        const response = await api.get('/api/graph')

        console.log(response.data)
        console.log(response.data.nodes.length)
        console.log(response.data.edges.length)

        const { nodes: rawNodes, edges: rawEdges } = normalizeGraph(response.data)

        const flowNodes = rawNodes.map((node, index) => ({
          id: String(node.id ?? node.label ?? index),
          type: 'default',
          data: { label: node.label ?? node.name ?? node.id },
          position: createDebugGridPosition(index),
          className: node.type,
          meta: { originalType: node.type },
          style: {
            border: `2px solid ${getNodeColor(node.type)}`,
            background: 'rgba(15,23,36,0.95)',
            color: '#fff',
            padding: 14,
            borderRadius: 14,
            boxShadow: '0 16px 36px rgba(15,23,42,0.36)',
            transition: 'all 320ms ease',
            fontWeight: 600,
            minWidth: 170,
            minHeight: 72,
          },
        }))

        const flowEdges = rawEdges.map((edge, index) => ({
          id: String(edge.id ?? `e${index + 1}`),
          source: String(edge.source),
          target: String(edge.target),
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
          },
          meta: {
            relationshipType: edge.label ?? edge.type ?? '',
          },
          style: {
            stroke: 'rgba(148,163,184,0.72)',
            strokeWidth: 1.8,
            transition: 'all 320ms ease',
          },
        }))

        console.log(flowNodes)
        console.log(flowEdges)

        const validNodeIds = new Set(flowNodes.map((node) => node.id))
        const invalidEdge = flowEdges.find((edge) => !validNodeIds.has(edge.source) || !validNodeIds.has(edge.target))
        if (invalidEdge) {
          throw new Error(`Invalid edge references: ${invalidEdge.id}`)
        }

        if (!active) return
        setNodes(flowNodes)
        setEdges(flowEdges)
      } catch (err) {
        if (!active) return
        setError(err.message || 'Failed to load graph data')
      } finally {
        if (!active) return
        setLoading(false)
      }
    }

    loadGraph()
    return () => {
      active = false
    }
  }, [])

  const selectedPersonNodeId = useMemo(() => {
    return nodes.find((node) => node.className === 'Person' && node.data?.label === selectedPerson)?.id ?? null
  }, [nodes, selectedPerson])

  const highlightedNeighborIds = useMemo(() => {
    const ids = new Set()
    if (!selectedPersonNodeId) {
      return ids
    }

    ids.add(selectedPersonNodeId)
    edges.forEach((edge) => {
      if (edge.source === selectedPersonNodeId) {
        ids.add(edge.target)
      }
      if (edge.target === selectedPersonNodeId) {
        ids.add(edge.source)
      }
    })

    return ids
  }, [edges, selectedPersonNodeId])

  const visibleNodes = useMemo(() => {
    return nodes
      .filter((node) => {
        if (!normalizedSearch) return true
        return String(node.data?.label || '').toLowerCase().includes(normalizedSearch)
      })
      .map((node) => {
        const isSelected = node.id === selectedPersonNodeId
        const isConnected = highlightedNeighborIds.has(node.id)

        return {
          ...node,
          type: 'default',
          zIndex: isSelected ? 50 : 10,
          style: {
            ...node.style,
            opacity: selectedPersonNodeId ? (isSelected || isConnected ? 1 : 0.2) : 1,
            zIndex: isSelected ? 50 : 10,
            transform: isSelected ? 'scale(1.04)' : undefined,
            boxShadow: isSelected
              ? '0 0 0 2px rgba(96,165,250,0.95), 0 0 28px rgba(37,99,235,0.72)'
              : node.style?.boxShadow,
          },
        }
      })
  }, [highlightedNeighborIds, selectedPersonNodeId, normalizedSearch, nodes])

  const visibleEdges = useMemo(() => {
    const visibleNodeIds = new Set(visibleNodes.map((node) => node.id))
    return edges
      .filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
      .map((edge) => {
        const isHighlighted = selectedPersonNodeId ? edge.source === selectedPersonNodeId || edge.target === selectedPersonNodeId : true

        return {
          ...edge,
          style: {
            ...edge.style,
            opacity: selectedPersonNodeId ? (isHighlighted ? 1 : 0.2) : 0.88,
            stroke: isHighlighted ? 'rgba(96,165,250,0.92)' : 'rgba(148,163,184,0.45)',
          },
        }
      })
  }, [edges, selectedPersonNodeId, visibleNodes])

  const onInit = useCallback((instance) => {
      // expose for debugging in the browser console and ensure a sane initial viewport
      try {
        // reset viewport to origin if this instance exposes the method
        if (instance?.setViewport) {
          instance.setViewport({ x: 0, y: 0, zoom: 1 })
        }
        // attach to window for interactive debugging
        // eslint-disable-next-line no-undef
        if (typeof window !== 'undefined') window._reactFlowInstance = instance
      } catch (err) {
        // ignore
      }
      flowRef.current = instance
    }, [])

  // Helper to safely call fitView only when the react-flow container has a reasonable size.
  function attemptFitView(options = { padding: 0.16, duration: 500 }, retries = 0) {
    try {
      const container = document.querySelector('.react-flow')
      const MIN_WIDTH = 200
      const MIN_HEIGHT = 150
      if (!container) {
        if (retries < 6) setTimeout(() => attemptFitView(options, retries + 1), 150)
        return
      }
      const rect = container.getBoundingClientRect()
      if (rect.width < MIN_WIDTH || rect.height < MIN_HEIGHT) {
        if (retries < 6) setTimeout(() => attemptFitView(options, retries + 1), 150)
        return
      }
      if (flowRef.current) {
        if (options.nodes) {
          flowRef.current.fitView(options)
        } else {
          flowRef.current.fitView(options)
        }
      }
    } catch (err) {
      // swallow errors and retry a few times
      if (retries < 6) setTimeout(() => attemptFitView(options, retries + 1), 150)
    }
  }

  useEffect(() => {
    if (flowRef.current && nodes.length > 0) {
      // Give the DOM a short moment to finish layout before fitting view
      requestAnimationFrame(() => {
        setTimeout(() => {
          attemptFitView({ padding: 0.25, includeHiddenNodes: true, duration: 800 })
        }, 120)
      })
    }
  }, [nodes])

  // Ensure all node DOM elements are present before doing a final fitView pass.
  useEffect(() => {
    if (!flowRef.current || nodes.length === 0) return

    let cancelled = false

    const ensureDomNodesThenFit = () => {
      const domNodes = document.querySelectorAll('.react-flow__node')
      if (cancelled) return
      // If the DOM has at least as many nodes as the data, assume rendering finished
      if (domNodes.length >= nodes.length) {
        try {
          flowRef.current.fitView({ padding: 0.25, includeHiddenNodes: true, duration: 800 })
        } catch (err) {
          // ignore
        }
      } else {
        // retry shortly
        setTimeout(ensureDomNodesThenFit, 120)
      }
    }

    // start after a small delay to let layout libraries finish (if any)
    const starter = setTimeout(ensureDomNodesThenFit, 200)
    return () => {
      cancelled = true
      clearTimeout(starter)
    }
  }, [nodes])

  useEffect(() => {
    if (!flowRef.current || nodes.length === 0) {
      return
    }

    requestAnimationFrame(() => {
      if (!flowRef.current) {
        return
      }

      const focusNodes = visibleNodes.filter((node) => highlightedNeighborIds.has(node.id))
      if (selectedPersonNodeId && focusNodes.length) {
        attemptFitView({ nodes: focusNodes, padding: 0.32, includeHiddenNodes: true, duration: 700 })
        return
      }

      attemptFitView({ padding: 0.25, includeHiddenNodes: true, duration: 800 })
    })
  }, [highlightedNeighborIds, nodes.length, selectedPersonNodeId, visibleNodes])

  const onNodeClick = useCallback((event, node) => {
    const connected = edges.filter((edge) => edge.source === node.id || edge.target === node.id)
    const neighborIds = new Set()

    connected.forEach((edge) => {
      if (edge.source !== node.id) neighborIds.add(edge.source)
      if (edge.target !== node.id) neighborIds.add(edge.target)
    })

    const neighbors = nodes
      .filter((candidate) => neighborIds.has(candidate.id))
      .map((candidate) => candidate.data?.label || candidate.id)

    setSelectedNode({
      id: node.id,
      name: node.data?.label || node.id,
      type: node.className || node.meta?.originalType || 'Unknown',
      relationships: connected.length,
      neighbors,
    })
  }, [edges, nodes])

  const onFit = useCallback(() => {
    if (flowRef.current) {
      flowRef.current.fitView({ padding: 0.16, duration: 500 })
    }
  }, [])

  if (loading) {
    return (
      <div style={{ width: '100%', minHeight: '520px' }}>
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ color: '#fecaca', padding: 24, minHeight: '520px', background: 'rgba(15,23,36,0.9)', borderRadius: 16 }}>
        <strong>Error loading graph:</strong>
        <div>{error}</div>
      </div>
    )
  }

  // Diagnostic: print raw mapped nodes/edges before any filtering or memoization
  console.log('RAW state nodes:', nodes)
  console.log('RAW state edges:', edges)

  // For debugging, bypass all filtering/highlighting and use the raw mapped nodes/edges directly.
  // This will help determine whether nodes are disappearing before they reach ReactFlow or being hidden by styling/logic.
  let finalNodes = nodes
  let finalEdges = edges


  // If there are no nodes at this point, inject two test nodes to verify ReactFlow/CSS rendering.
  if (!finalNodes || finalNodes.length === 0) {
    console.warn('No final nodes present - injecting two test nodes for debugging')
    finalNodes = [
      { id: 'debug-1', data: { label: 'Test 1' }, position: { x: 100, y: 100 }, style: { background: '#111827', color: '#fff', padding: 12 } },
      { id: 'debug-2', data: { label: 'Test 2' }, position: { x: 350, y: 250 }, style: { background: '#0b1220', color: '#fff', padding: 12 } },
    ]
    finalEdges = []
  }

  console.log('FINAL NODES', finalNodes)
  console.log('FINAL EDGES', finalEdges)

  return (
    <div style={{ width: '100%', height: '75vh', minHeight: 700, borderRadius: 16, overflow: 'visible', background: '#071023', border: '1px solid rgba(148,163,184,0.12)', display: 'flex' }}>
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <input
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(148,163,184,0.08)', background: '#0b1220', color: '#e6edf3' }}
          />
          <button onClick={onFit} style={{ padding: '8px 12px', borderRadius: 8, background: '#1f2937', color: '#fff', border: 'none', cursor: 'pointer' }}>Fit Graph</button>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#cbd5e1', flexWrap: 'wrap' }}>
              <LegendItem color="#60a5fa" label="Selected Person" />
              <LegendItem color="#22c55e" label="Connected Skills" />
              <LegendItem color="#f97316" label="Target Role" />
              <LegendItem color="rgba(148,163,184,0.5)" label="Other Nodes" />
            </div>
          </div>
        </div>

        <div style={{ flex: 1, borderRadius: 12, overflow: 'visible', background: '#071023' }}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={finalNodes}
              edges={finalEdges}
              onInit={onInit}
              onNodeClick={onNodeClick}
                          nodeTypes={nodeTypes}
              panOnDrag
              zoomOnScroll
              zoomOnPinch
              zoomOnDoubleClick
              style={{ width: '100%', height: '100%' }}
            >
              <MiniMap
                nodeStrokeColor={(node) => {
                  if (node.className === 'Person') return NODE_COLORS.Person
                  if (node.className === 'Skill') return NODE_COLORS.Skill
                  if (node.className === 'Role') return NODE_COLORS.Role
                  if (node.className === 'Company') return NODE_COLORS.Company
                  if (node.className === 'Technology') return NODE_COLORS.Technology
                  if (node.className === 'Vulnerability') return NODE_COLORS.Vulnerability
                  return '#64748b'
                }}
                nodeColor={(node) => {
                  if (node.className === 'Person') return NODE_COLORS.Person
                  if (node.className === 'Skill') return NODE_COLORS.Skill
                  if (node.className === 'Role') return NODE_COLORS.Role
                  if (node.className === 'Company') return NODE_COLORS.Company
                  if (node.className === 'Technology') return NODE_COLORS.Technology
                  if (node.className === 'Vulnerability') return NODE_COLORS.Vulnerability
                  return '#475569'
                }}
                nodeBorderRadius={10}
              />
              <Controls showInteractive={false} />
              <Background gap={16} size={1} color="#334155" />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>

      <div style={{ width: 300, borderLeft: '1px solid rgba(148,163,184,0.06)', padding: 16, background: 'linear-gradient(180deg, rgba(3,7,18,0.6), rgba(7,12,23,0.9))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ color: '#e6edf3', margin: 0 }}>Node Details</h3>
          <button onClick={() => setSelectedNode(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Close</button>
        </div>

        {selectedNode ? (
          <div style={{ color: '#cbd5e1' }}>
            <div style={{ marginBottom: 10 }}><strong>Name:</strong> <span style={{ color: '#fff' }}>{selectedNode.name}</span></div>
            <div style={{ marginBottom: 10 }}><strong>Type:</strong> <span style={{ color: '#fff' }}>{selectedNode.type}</span></div>
            <div style={{ marginBottom: 10 }}><strong>Relationships:</strong> <span style={{ color: '#fff' }}>{selectedNode.relationships}</span></div>
            <div style={{ marginBottom: 8 }}><strong>Connected Nodes:</strong></div>
            <ul style={{ paddingLeft: 18 }}>
              {selectedNode.neighbors.map((neighbor) => (
                <li key={neighbor} style={{ marginBottom: 6, color: '#e6edf3' }}>{neighbor}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div style={{ color: '#94a3b8' }}>Click a node to view details</div>
        )}
      </div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 12, height: 12, borderRadius: 3, background: color, boxShadow: '0 6px 12px rgba(0,0,0,0.3)' }} />
      <div style={{ fontSize: 12 }}>{label}</div>
    </div>
  )
}

