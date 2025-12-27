/**
 * Test file for simulation engine
 * Run this test to verify the simulation engine works correctly
 */

import { simulateFlow, validateCondition, testCondition } from './simulationEngine.js';

// Test 1: Simple linear path (no decisions)
console.log('=== Test 1: Simple Linear Path ===');
const linearNodes = [
  { id: 'node-1', type: 'service', data: { label: 'Start' } },
  { id: 'node-2', type: 'service', data: { label: 'Process' } },
  { id: 'node-3', type: 'service', data: { label: 'End' } },
];

const linearEdges = [
  { id: 'edge-1', source: 'node-1', target: 'node-2' },
  { id: 'edge-2', source: 'node-2', target: 'node-3' },
];

const linearCase = {
  id: 'case-1',
  name: 'Linear Flow',
  input: {
    nodeId: 'node-1',
    data: { value: 42 },
  },
};

const result1 = simulateFlow(linearCase, linearNodes, linearEdges);
console.log('Result:', result1);
console.log('Path:', result1.path);
console.log('Success:', result1.success);
console.log();

// Test 2: Decision node with conditional branching
console.log('=== Test 2: Decision Node (age > 18) ===');
const decisionNodes = [
  { id: 'start', type: 'service', data: { label: 'Input' } },
  { id: 'decision', type: 'decision', data: { label: 'Age Check' } },
  { id: 'adult', type: 'service', data: { label: 'Adult Path' } },
  { id: 'minor', type: 'service', data: { label: 'Minor Path' } },
];

const decisionEdges = [
  { id: 'e1', source: 'start', target: 'decision' },
  {
    id: 'e2',
    source: 'decision',
    target: 'adult',
    data: { condition: 'age > 18', priority: 1, conditionType: 'true' },
  },
  {
    id: 'e3',
    source: 'decision',
    target: 'minor',
    data: { condition: 'age <= 18', priority: 2, conditionType: 'false' },
  },
];

// Test with age = 25 (adult path)
const adultCase = {
  id: 'case-2',
  name: 'Adult User',
  input: {
    nodeId: 'start',
    data: { age: 25, name: 'John' },
  },
};

const result2 = simulateFlow(adultCase, decisionNodes, decisionEdges);
console.log('Adult case result:', result2);
console.log('Path:', result2.path);
console.log('Expected: ["start", "decision", "adult"]');
console.log('Match:', JSON.stringify(result2.path) === JSON.stringify(['start', 'decision', 'adult']));
console.log();

// Test with age = 16 (minor path)
const minorCase = {
  id: 'case-3',
  name: 'Minor User',
  input: {
    nodeId: 'start',
    data: { age: 16, name: 'Jane' },
  },
};

const result3 = simulateFlow(minorCase, decisionNodes, decisionEdges);
console.log('Minor case result:', result3);
console.log('Path:', result3.path);
console.log('Expected: ["start", "decision", "minor"]');
console.log('Match:', JSON.stringify(result3.path) === JSON.stringify(['start', 'decision', 'minor']));
console.log();

// Test 3: Validate conditions
console.log('=== Test 3: Condition Validation ===');
console.log('Valid condition:', validateCondition('age > 18'));
console.log('Invalid condition:', validateCondition('age > >'));
console.log('Empty condition:', validateCondition(''));
console.log();

// Test 4: Test condition evaluation
console.log('=== Test 4: Condition Evaluation ===');
console.log('Test "age > 18" with {age: 25}:', testCondition('age > 18', { age: 25 }));
console.log('Test "age > 18" with {age: 16}:', testCondition('age > 18', { age: 16 }));
console.log('Test "status == \'active\'" with {status: "active"}:', testCondition('status == "active"', { status: 'active' }));
console.log();

// Test 5: Error handling - circular path
console.log('=== Test 5: Circular Path Detection ===');
const circularNodes = [
  { id: 'a', type: 'service', data: { label: 'A' } },
  { id: 'b', type: 'service', data: { label: 'B' } },
  { id: 'c', type: 'service', data: { label: 'C' } },
];

const circularEdges = [
  { id: 'e1', source: 'a', target: 'b' },
  { id: 'e2', source: 'b', target: 'c' },
  { id: 'e3', source: 'c', target: 'a' }, // Creates circular path
];

const circularCase = {
  id: 'case-circular',
  name: 'Circular Test',
  input: { nodeId: 'a', data: {} },
};

const result5 = simulateFlow(circularCase, circularNodes, circularEdges);
console.log('Circular path result:', result5);
console.log('Success:', result5.success);
console.log('Error:', result5.error);
console.log();

// Test 6: Error handling - invalid condition
console.log('=== Test 6: Invalid Condition Handling ===');
const invalidConditionEdges = [
  { id: 'e1', source: 'start', target: 'decision' },
  {
    id: 'e2',
    source: 'decision',
    target: 'adult',
    data: { condition: 'invalid syntax >', priority: 1 },
  },
];

const invalidCase = {
  id: 'case-invalid',
  name: 'Invalid Condition',
  input: { nodeId: 'start', data: { age: 25 } },
};

const result6 = simulateFlow(invalidCase, decisionNodes, invalidConditionEdges);
console.log('Invalid condition result:', result6);
console.log('Success:', result6.success);
console.log('Error:', result6.error);
console.log();

console.log('=== All Tests Complete ===');
