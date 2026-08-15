import { StudyItem } from '../src/types';

export const INITIAL_ITEMS: StudyItem[] = [
  // ROOT LEVEL FOLDERS
  {
    id: 'f-diploma',
    name: 'Diploma in Engineering',
    type: 'folder',
    parentId: null,
    status: 'published',
    size: 0,
    downloadsCount: 0,
    viewsCount: 1420,
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-08-10T10:00:00.000Z',
    description: 'All state board diploma engineering branches curriculum and study notes.'
  },

  // BRANCHES UNDER DIPLOMA
  {
    id: 'f-electrical',
    name: 'Electrical Engineering',
    type: 'folder',
    parentId: 'f-diploma',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    downloadsCount: 0,
    viewsCount: 890,
    createdAt: '2026-01-11T09:00:00.000Z',
    updatedAt: '2026-08-11T11:30:00.000Z',
    description: 'Circuits, machines, power systems, control and measurements.'
  },
  {
    id: 'f-mechanical',
    name: 'Mechanical Engineering',
    type: 'folder',
    parentId: 'f-diploma',
    status: 'published',
    size: 0,
    branch: 'Mechanical Engineering',
    downloadsCount: 0,
    viewsCount: 750,
    createdAt: '2026-01-11T09:15:00.000Z',
    updatedAt: '2026-08-05T14:20:00.000Z',
    description: 'Thermodynamics, fluid mechanics, SOM, TOM and manufacturing.'
  },
  {
    id: 'f-civil',
    name: 'Civil Engineering',
    type: 'folder',
    parentId: 'f-diploma',
    status: 'published',
    size: 0,
    branch: 'Civil Engineering',
    downloadsCount: 0,
    viewsCount: 680,
    createdAt: '2026-01-11T09:30:00.000Z',
    updatedAt: '2026-08-01T12:00:00.000Z',
    description: 'Surveying, concrete technology, hydraulics and structures.'
  },
  {
    id: 'f-cse',
    name: 'Computer Science & Engineering',
    type: 'folder',
    parentId: 'f-diploma',
    status: 'published',
    size: 0,
    branch: 'Computer Science & Engineering',
    downloadsCount: 0,
    viewsCount: 1120,
    createdAt: '2026-01-11T09:45:00.000Z',
    updatedAt: '2026-08-12T16:00:00.000Z',
    description: 'Data structures, algorithms, databases, web and operating systems.'
  },
  {
    id: 'f-ece',
    name: 'Electronics & Communication',
    type: 'folder',
    parentId: 'f-diploma',
    status: 'published',
    size: 0,
    branch: 'Electronics & Communication',
    downloadsCount: 0,
    viewsCount: 540,
    createdAt: '2026-01-11T10:00:00.000Z',
    updatedAt: '2026-07-28T09:10:00.000Z',
    description: 'Analog, digital circuits, microprocessors and communication.'
  },

  // SEMESTERS UNDER ELECTRICAL
  {
    id: 'f-ee-sem1',
    name: 'Semester 1',
    type: 'folder',
    parentId: 'f-electrical',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 1',
    downloadsCount: 0,
    viewsCount: 310,
    createdAt: '2026-01-12T10:00:00.000Z',
    updatedAt: '2026-07-15T11:00:00.000Z'
  },
  {
    id: 'f-ee-sem2',
    name: 'Semester 2',
    type: 'folder',
    parentId: 'f-electrical',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 2',
    downloadsCount: 0,
    viewsCount: 290,
    createdAt: '2026-01-12T10:30:00.000Z',
    updatedAt: '2026-07-16T11:00:00.000Z'
  },
  {
    id: 'f-ee-sem3',
    name: 'Semester 3',
    type: 'folder',
    parentId: 'f-electrical',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    downloadsCount: 0,
    viewsCount: 940,
    createdAt: '2026-01-12T11:00:00.000Z',
    updatedAt: '2026-08-14T09:00:00.000Z'
  },
  {
    id: 'f-ee-sem4',
    name: 'Semester 4',
    type: 'folder',
    parentId: 'f-electrical',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 4',
    downloadsCount: 0,
    viewsCount: 420,
    createdAt: '2026-01-12T11:30:00.000Z',
    updatedAt: '2026-07-20T14:00:00.000Z'
  },
  {
    id: 'f-ee-sem5',
    name: 'Semester 5',
    type: 'folder',
    parentId: 'f-electrical',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 5',
    downloadsCount: 0,
    viewsCount: 380,
    createdAt: '2026-01-12T12:00:00.000Z',
    updatedAt: '2026-07-22T10:00:00.000Z'
  },
  {
    id: 'f-ee-sem6',
    name: 'Semester 6',
    type: 'folder',
    parentId: 'f-electrical',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 6',
    downloadsCount: 0,
    viewsCount: 360,
    createdAt: '2026-01-12T12:30:00.000Z',
    updatedAt: '2026-07-25T16:00:00.000Z'
  },

  // SUBJECTS UNDER EE SEMESTER 3
  {
    id: 'f-ee-s3-ecn',
    name: 'Electrical Circuit & Network',
    type: 'folder',
    parentId: 'f-ee-sem3',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    downloadsCount: 0,
    viewsCount: 650,
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-08-14T08:30:00.000Z'
  },
  {
    id: 'f-ee-s3-em1',
    name: 'Electrical Machines - I',
    type: 'folder',
    parentId: 'f-ee-sem3',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Machines - I',
    downloadsCount: 0,
    viewsCount: 410,
    createdAt: '2026-01-15T09:30:00.000Z',
    updatedAt: '2026-08-02T10:00:00.000Z'
  },
  {
    id: 'f-ee-s3-eem',
    name: 'Electrical & Electronics Measurement',
    type: 'folder',
    parentId: 'f-ee-sem3',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical & Electronics Measurement',
    downloadsCount: 0,
    viewsCount: 320,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-07-29T12:00:00.000Z'
  },

  // UNITS UNDER Electrical Circuit & Network
  {
    id: 'f-ee-s3-ecn-u1',
    name: 'Unit 1 - Circuit Elements & Basic Laws',
    type: 'folder',
    parentId: 'f-ee-s3-ecn',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    unit: 'Unit 1',
    downloadsCount: 0,
    viewsCount: 520,
    createdAt: '2026-01-16T10:00:00.000Z',
    updatedAt: '2026-08-14T08:00:00.000Z'
  },
  {
    id: 'f-ee-s3-ecn-u2',
    name: 'Unit 2 - Network Theorems',
    type: 'folder',
    parentId: 'f-ee-s3-ecn',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    unit: 'Unit 2',
    downloadsCount: 0,
    viewsCount: 460,
    createdAt: '2026-01-16T10:30:00.000Z',
    updatedAt: '2026-08-10T14:00:00.000Z'
  },
  {
    id: 'f-ee-s3-ecn-u3',
    name: 'Unit 3 - Single Phase AC Circuits & Resonance',
    type: 'folder',
    parentId: 'f-ee-s3-ecn',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    unit: 'Unit 3',
    downloadsCount: 0,
    viewsCount: 390,
    createdAt: '2026-01-16T11:00:00.000Z',
    updatedAt: '2026-08-04T15:20:00.000Z'
  },

  // NESTED SUBFOLDER: Unit 1 -> Important Questions
  {
    id: 'f-ee-s3-ecn-u1-imp',
    name: 'Important Questions & PYQ',
    type: 'folder',
    parentId: 'f-ee-s3-ecn-u1',
    status: 'published',
    size: 0,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    unit: 'Unit 1',
    downloadsCount: 0,
    viewsCount: 380,
    createdAt: '2026-01-18T14:00:00.000Z',
    updatedAt: '2026-08-12T11:00:00.000Z'
  },

  // FILES IN Unit 1
  {
    id: 'file-kcl-kvl-pdf',
    name: 'KCL & KVL Complete Notes.pdf',
    type: 'pdf',
    parentId: 'f-ee-s3-ecn-u1',
    status: 'published',
    size: 2450000, // 2.45 MB
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    unit: 'Unit 1',
    downloadsCount: 342,
    viewsCount: 890,
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-08-12T09:00:00.000Z',
    description: 'Comprehensive handwritten & typed notes covering Kirchhoff’s Current Law, Voltage Law, nodal analysis, and sign conventions with solved examples.'
  },
  {
    id: 'file-nodal-mesh-html',
    name: 'Nodal and Mesh Analysis Interactive Guide.html',
    type: 'html',
    parentId: 'f-ee-s3-ecn-u1',
    status: 'published',
    size: 340000,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    unit: 'Unit 1',
    downloadsCount: 215,
    viewsCount: 640,
    createdAt: '2026-02-05T14:20:00.000Z',
    updatedAt: '2026-08-10T16:00:00.000Z',
    description: 'Interactive step-by-step circuit solver and formula derivation for Nodal and Mesh analysis with live circuit diagrams.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Nodal & Mesh Analysis Interactive Study Guide</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 860px; margin: 0 auto; padding: 24px; background: #ffffff; }
  h1 { color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; font-size: 26px; }
  h2 { color: #1e40af; margin-top: 28px; font-size: 20px; }
  .formula-box { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 18px; margin: 16px 0; border-radius: 6px; font-family: monospace; font-size: 15px; }
  .note-box { background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 16px 0; border-radius: 6px; }
  .highlight { background: #fef08a; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
  th { background: #f1f5f9; color: #0f172a; }
  .step-card { background: #fafafa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 12px 0; }
</style>
</head>
<body>
  <h1>POLYTECHNIC APP — Electrical Engineering (Semester 3)</h1>
  <h2>Unit 1: Nodal & Mesh Analysis Comprehensive Guide</h2>
  
  <div class="note-box">
    <strong>Subject:</strong> Electrical Circuit & Network (Course Code: EE-301)<br>
    <strong>Target Audience:</strong> Polytechnic 2nd Year Diploma Students
  </div>

  <h2>1. Kirchhoff's Current Law (KCL)</h2>
  <p>Kirchhoff's Current Law states that the algebraic sum of currents entering a node (or a closed boundary) is equal to zero at any instant of time.</p>
  <div class="formula-box">
    &Sigma; I_entering = &Sigma; I_leaving &nbsp;&nbsp;&rArr;&nbsp;&nbsp; &Sigma; I = 0
  </div>
  <p><strong>Conservation Principle:</strong> KCL is a direct consequence of the Law of Conservation of Electric Charge.</p>

  <h2>2. Kirchhoff's Voltage Law (KVL)</h2>
  <p>Kirchhoff's Voltage Law states that the algebraic sum of all branch voltages around any closed loop in a circuit is equal to zero.</p>
  <div class="formula-box">
    &Sigma; V = 0 &nbsp;&nbsp;&rArr;&nbsp;&nbsp; &Sigma; V_sources = &Sigma; I &times; R
  </div>
  <p><strong>Conservation Principle:</strong> KVL is based on the Law of Conservation of Energy.</p>

  <h2>3. Step-by-Step Nodal Analysis Method</h2>
  <div class="step-card">
    <strong>Step 1:</strong> Identify the total number of nodes (N) in the circuit.<br>
    <strong>Step 2:</strong> Select one reference node (Datum node) and assign its potential as 0V.<br>
    <strong>Step 3:</strong> Assign voltage variables (V1, V2, ... VN-1) to all remaining non-reference nodes.<br>
    <strong>Step 4:</strong> Apply KCL at each non-reference node using Ohm's Law (I = (V_from - V_to) / R).<br>
    <strong>Step 5:</strong> Form a set of simultaneous linear equations and solve for unknown node voltages using Cramer's Rule or Matrix inversion.
  </div>

  <h2>4. Summary Comparison Table</h2>
  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>Nodal Analysis</th>
        <th>Mesh Analysis</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Fundamental Law</td>
        <td>Kirchhoff's Current Law (KCL)</td>
        <td>Kirchhoff's Voltage Law (KVL)</td>
      </tr>
      <tr>
        <td>Primary Variable</td>
        <td>Node Voltages (V)</td>
        <td>Loop / Mesh Currents (I)</td>
      </tr>
      <tr>
        <td>Equations Count</td>
        <td>(N - 1) where N = Nodes</td>
        <td>(B - N + 1) where B = Branches</td>
      </tr>
      <tr>
        <td>Applicability</td>
        <td>Both Planar and Non-Planar Circuits</td>
        <td>Planar Circuits ONLY</td>
      </tr>
    </tbody>
  </table>

  <h2>5. Important Examination Tips</h2>
  <ul>
    <li>Always check whether a Supernode or Supermesh exists before writing equations.</li>
    <li>When a voltage source is directly connected between two non-reference nodes without resistance in series, use <strong>Supernode analysis</strong>.</li>
    <li>Verify units: ensure resistance is in &Omega;, voltage in Volts, and current in Amperes.</li>
  </ul>
</body>
</html>`
  },

  // FILES IN Important Questions subfolder
  {
    id: 'file-vvi-questions-pdf',
    name: 'Unit 1 VVI Examination Questions.pdf',
    type: 'pdf',
    parentId: 'f-ee-s3-ecn-u1-imp',
    status: 'published',
    size: 1850000,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    unit: 'Unit 1',
    downloadsCount: 512,
    viewsCount: 1240,
    createdAt: '2026-02-10T11:00:00.000Z',
    updatedAt: '2026-08-11T10:00:00.000Z',
    description: 'Top repeated semester examination questions with 100% complete step-by-step solutions for 2-mark, 5-mark, and 10-mark questions.'
  },
  {
    id: 'file-pyq-solved-pdf',
    name: 'Previous 5 Years Solved Papers (2020-2025).pdf',
    type: 'pdf',
    parentId: 'f-ee-s3-ecn-u1-imp',
    status: 'published',
    size: 4200000,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    unit: 'Unit 1',
    downloadsCount: 680,
    viewsCount: 1650,
    createdAt: '2026-02-12T09:00:00.000Z',
    updatedAt: '2026-08-13T12:00:00.000Z',
    description: 'Complete solved question bank from state board of technical education examinations.'
  },

  // FILES IN Unit 2 - Network Theorems
  {
    id: 'file-theorems-notes-pdf',
    name: 'Thevenin and Norton Theorems Derivation.pdf',
    type: 'pdf',
    parentId: 'f-ee-s3-ecn-u2',
    status: 'published',
    size: 3100000,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    unit: 'Unit 2',
    downloadsCount: 420,
    viewsCount: 980,
    createdAt: '2026-02-15T09:00:00.000Z',
    updatedAt: '2026-08-10T11:00:00.000Z',
    description: 'Thevenin’s equivalent voltage (Vth), Thevenin resistance (Rth), Maximum Power Transfer theorem with proofs.'
  },
  {
    id: 'file-theorems-interactive-html',
    name: 'Network Theorems Interactive Calculator & Notes.html',
    type: 'html',
    parentId: 'f-ee-s3-ecn-u2',
    status: 'published',
    size: 280000,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    unit: 'Unit 2',
    downloadsCount: 190,
    viewsCount: 450,
    createdAt: '2026-02-18T10:00:00.000Z',
    updatedAt: '2026-08-08T15:00:00.000Z',
    description: 'Interactive theorem solver & formula sheet covering Superposition, Thevenin, Norton, and Maximum Power Transfer.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Network Theorems Interactive Study Notes</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 860px; margin: 0 auto; padding: 24px; background: #ffffff; }
  h1 { color: #0f172a; border-bottom: 2px solid #2563eb; padding-bottom: 8px; font-size: 24px; }
  h2 { color: #1d4ed8; margin-top: 24px; font-size: 19px; }
  .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
  .theorem-title { font-weight: 700; color: #0f172a; font-size: 17px; margin-bottom: 6px; }
  .formula { background: #ecfdf5; border-left: 4px solid #10b981; padding: 10px 14px; font-family: monospace; font-weight: 600; margin: 8px 0; }
</style>
</head>
<body>
  <h1>POLYTECHNIC APP — Electrical Circuit & Network (Unit 2)</h1>
  <p>Comprehensive reference guide for all major Network Theorems used in DC & AC Circuit Analysis.</p>

  <div class="card">
    <div class="theorem-title">1. Thevenin's Theorem</div>
    <p>Any linear active two-terminal network containing resistance and energy sources can be replaced by an equivalent circuit consisting of a single voltage source (V_th) in series with a single resistance (R_th).</p>
    <div class="formula">V_th = Open-circuit voltage across load terminals A-B</div>
    <div class="formula">R_th = Resistance looking into terminals A-B with all independent sources deactivated (Voltage source &rarr; Short, Current source &rarr; Open)</div>
    <div class="formula">I_L = V_th / (R_th + R_L)</div>
  </div>

  <div class="card">
    <div class="theorem-title">2. Norton's Theorem</div>
    <p>Any linear active two-terminal network can be replaced by an equivalent circuit comprising a constant current source (I_N) in parallel with a resistor (R_N).</p>
    <div class="formula">I_N = Short-circuit current through terminals A-B</div>
    <div class="formula">R_N = R_th</div>
    <div class="formula">I_L = I_N &times; [ R_N / (R_N + R_L) ]</div>
  </div>

  <div class="card">
    <div class="theorem-title">3. Maximum Power Transfer Theorem</div>
    <p>A resistive load connected to a DC source receives maximum power when the load resistance (R_L) is equal to the internal resistance (R_th) of the network looking from the load terminals.</p>
    <div class="formula">Condition: R_L = R_th</div>
    <div class="formula">P_max = (V_th)^2 / (4 &times; R_th)</div>
    <div class="formula">Efficiency at Maximum Power = 50%</div>
  </div>

  <div class="card">
    <div class="theorem-title">4. Superposition Theorem</div>
    <p>In any linear, bilateral network with multiple independent sources, the response (voltage or current) across any element is the algebraic sum of the individual responses caused by each source acting alone.</p>
  </div>
</body>
</html>`
  },

  // MECHANICAL ENGINEERING CURRICULUM ITEMS
  {
    id: 'f-me-sem3',
    name: 'Semester 3',
    type: 'folder',
    parentId: 'f-mechanical',
    status: 'published',
    size: 0,
    branch: 'Mechanical Engineering',
    semester: 'Semester 3',
    downloadsCount: 0,
    viewsCount: 380,
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-08-05T12:00:00.000Z'
  },
  {
    id: 'f-me-s3-thermo',
    name: 'Thermodynamics & Heat Transfer',
    type: 'folder',
    parentId: 'f-me-sem3',
    status: 'published',
    size: 0,
    branch: 'Mechanical Engineering',
    semester: 'Semester 3',
    subject: 'Thermodynamics',
    downloadsCount: 0,
    viewsCount: 420,
    createdAt: '2026-01-22T10:00:00.000Z',
    updatedAt: '2026-08-05T14:00:00.000Z'
  },
  {
    id: 'file-thermo-laws-pdf',
    name: 'Laws of Thermodynamics & Steam Tables.pdf',
    type: 'pdf',
    parentId: 'f-me-s3-thermo',
    status: 'published',
    size: 3800000,
    branch: 'Mechanical Engineering',
    semester: 'Semester 3',
    subject: 'Thermodynamics',
    downloadsCount: 290,
    viewsCount: 710,
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-08-05T14:30:00.000Z',
    description: 'Zeroth, First, and Second Laws of Thermodynamics, Carnot Cycle, Entropy calculations, and Mollier diagram study.'
  },
  {
    id: 'file-carnot-cycle-html',
    name: 'Carnot Cycle & Heat Engine Interactive Study.html',
    type: 'html',
    parentId: 'f-me-s3-thermo',
    status: 'published',
    size: 260000,
    branch: 'Mechanical Engineering',
    semester: 'Semester 3',
    subject: 'Thermodynamics',
    downloadsCount: 140,
    viewsCount: 380,
    createdAt: '2026-02-14T11:00:00.000Z',
    updatedAt: '2026-08-04T12:00:00.000Z',
    description: 'Interactive P-V and T-S diagram breakdown with efficiency formulas for Diesel, Otto, and Carnot cycles.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Thermodynamics - Carnot Cycle Interactive Study</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 860px; margin: 0 auto; padding: 24px; }
  h1 { color: #0f172a; border-bottom: 2px solid #e11d48; padding-bottom: 8px; }
  .box { background: #fff1f2; border-left: 4px solid #e11d48; padding: 14px; margin: 16px 0; border-radius: 6px; }
  .formula { font-family: monospace; font-size: 16px; background: #f8fafc; padding: 8px 12px; border-radius: 4px; border: 1px solid #cbd5e1; display: inline-block; margin: 6px 0; }
</style>
</head>
<body>
  <h1>POLYTECHNIC APP — Mechanical Engineering</h1>
  <h2>Subject: Applied Thermodynamics</h2>
  <div class="box">
    <strong>Module:</strong> Heat Engines, Refrigerators & Heat Pumps
  </div>
  <h3>Carnot Cycle Four Reversible Processes</h3>
  <ol>
    <li><strong>1-2: Reversible Isothermal Expansion</strong> at high temperature T_H (Heat Q_in absorbed)</li>
    <li><strong>2-3: Reversible Adiabatic (Isentropic) Expansion</strong> (Temperature drops from T_H to T_L)</li>
    <li><strong>3-4: Reversible Isothermal Compression</strong> at low temperature T_L (Heat Q_out rejected)</li>
    <li><strong>4-1: Reversible Adiabatic (Isentropic) Compression</strong> (Temperature rises from T_L to T_H)</li>
  </ol>
  <h3>Carnot Efficiency Formula</h3>
  <div>
    <div class="formula">&eta;_carnot = 1 - (T_L / T_H) = (T_H - T_L) / T_H</div>
  </div>
  <p><em>Note: Temperatures T_H and T_L must always be in Kelvin (K = &deg;C + 273.15).</em></p>
</body>
</html>`
  },

  // COMPUTER SCIENCE CURRICULUM ITEMS
  {
    id: 'f-cse-sem3',
    name: 'Semester 3',
    type: 'folder',
    parentId: 'f-cse',
    status: 'published',
    size: 0,
    branch: 'Computer Science & Engineering',
    semester: 'Semester 3',
    downloadsCount: 0,
    viewsCount: 520,
    createdAt: '2026-01-20T11:00:00.000Z',
    updatedAt: '2026-08-12T14:00:00.000Z'
  },
  {
    id: 'f-cse-s3-dsa',
    name: 'Data Structures & Algorithms',
    type: 'folder',
    parentId: 'f-cse-sem3',
    status: 'published',
    size: 0,
    branch: 'Computer Science & Engineering',
    semester: 'Semester 3',
    subject: 'Data Structures',
    downloadsCount: 0,
    viewsCount: 680,
    createdAt: '2026-01-22T12:00:00.000Z',
    updatedAt: '2026-08-12T15:00:00.000Z'
  },
  {
    id: 'file-dsa-trees-pdf',
    name: 'Binary Trees and Graphs Complete Guide.pdf',
    type: 'pdf',
    parentId: 'f-cse-s3-dsa',
    status: 'published',
    size: 4500000,
    branch: 'Computer Science & Engineering',
    semester: 'Semester 3',
    subject: 'Data Structures',
    downloadsCount: 460,
    viewsCount: 1100,
    createdAt: '2026-02-12T10:00:00.000Z',
    updatedAt: '2026-08-12T15:30:00.000Z',
    description: 'BST operations, AVL rotations, BFS, DFS algorithms, Dijkstra shortest path with C / C++ code examples.'
  },
  {
    id: 'file-dsa-complexity-html',
    name: 'Big-O Time & Space Complexity Master Cheat Sheet.html',
    type: 'html',
    parentId: 'f-cse-s3-dsa',
    status: 'published',
    size: 310000,
    branch: 'Computer Science & Engineering',
    semester: 'Semester 3',
    subject: 'Data Structures',
    downloadsCount: 380,
    viewsCount: 890,
    createdAt: '2026-02-15T14:00:00.000Z',
    updatedAt: '2026-08-11T12:00:00.000Z',
    description: 'Interactive visual reference for sorting algorithms, search complexity, and data structure operations.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Data Structures - Big-O Complexity Cheat Sheet</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 880px; margin: 0 auto; padding: 24px; }
  h1 { color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 8px; font-size: 24px; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
  th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; }
  th { background: #0f172a; color: #ffffff; }
  .good { background: #dcfce7; color: #166534; font-weight: 600; text-align: center; }
  .fair { background: #fef9c3; color: #854d0e; font-weight: 600; text-align: center; }
  .bad { background: #fee2e2; color: #991b1b; font-weight: 600; text-align: center; }
</style>
</head>
<body>
  <h1>POLYTECHNIC APP — Computer Science & Engineering</h1>
  <h2>Subject: Data Structures Using C (Course Code: CS-302)</h2>
  
  <h3>Sorting Algorithms Complexity</h3>
  <table>
    <thead>
      <tr>
        <th>Algorithm</th>
        <th>Best Case</th>
        <th>Average Case</th>
        <th>Worst Case</th>
        <th>Space Complexity</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Quick Sort</td>
        <td class="good">&Omega;(N log N)</td>
        <td class="good">&Theta;(N log N)</td>
        <td class="bad">O(N&sup2;)</td>
        <td class="good">O(log N)</td>
      </tr>
      <tr>
        <td>Merge Sort</td>
        <td class="good">&Omega;(N log N)</td>
        <td class="good">&Theta;(N log N)</td>
        <td class="good">O(N log N)</td>
        <td class="fair">O(N)</td>
      </tr>
      <tr>
        <td>Binary Search</td>
        <td class="good">&Omega;(1)</td>
        <td class="good">&Theta;(log N)</td>
        <td class="good">O(log N)</td>
        <td class="good">O(1)</td>
      </tr>
    </tbody>
  </table>
</body>
</html>`
  },

  // CIVIL ENGINEERING CURRICULUM ITEMS
  {
    id: 'f-ce-sem3',
    name: 'Semester 3',
    type: 'folder',
    parentId: 'f-civil',
    status: 'published',
    size: 0,
    branch: 'Civil Engineering',
    semester: 'Semester 3',
    downloadsCount: 0,
    viewsCount: 310,
    createdAt: '2026-01-20T12:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'f-ce-s3-survey',
    name: 'Advanced Surveying & Levelling',
    type: 'folder',
    parentId: 'f-ce-sem3',
    status: 'published',
    size: 0,
    branch: 'Civil Engineering',
    semester: 'Semester 3',
    subject: 'Advanced Surveying',
    downloadsCount: 0,
    viewsCount: 340,
    createdAt: '2026-01-22T14:00:00.000Z',
    updatedAt: '2026-08-01T11:00:00.000Z'
  },
  {
    id: 'file-surveying-notes-pdf',
    name: 'Theodolite Traversing & Total Station Field Notes.pdf',
    type: 'pdf',
    parentId: 'f-ce-s3-survey',
    status: 'published',
    size: 3200000,
    branch: 'Civil Engineering',
    semester: 'Semester 3',
    subject: 'Advanced Surveying',
    downloadsCount: 220,
    viewsCount: 540,
    createdAt: '2026-02-16T10:00:00.000Z',
    updatedAt: '2026-08-01T11:30:00.000Z',
    description: 'Transit theodolite adjustments, Latitude & Departure calculation, Bowditch rule, and Total Station surveying guidelines.'
  },

  // DRAFT & UNPUBLISHED ITEMS (To verify Admin draft/publish workflow)
  {
    id: 'file-draft-microprocessor',
    name: '8085 Microprocessor Pin Diagram & Architecture Draft.pdf',
    type: 'pdf',
    parentId: 'f-ee-s3-ecn',
    status: 'draft',
    size: 1950000,
    branch: 'Electrical Engineering',
    semester: 'Semester 3',
    subject: 'Electrical Circuit & Network',
    downloadsCount: 0,
    viewsCount: 0,
    createdAt: '2026-08-14T06:00:00.000Z',
    updatedAt: '2026-08-14T06:00:00.000Z',
    description: 'Draft notes under verification by department faculty before student release.'
  },
  {
    id: 'f-draft-sem4-preview',
    name: 'Upcoming Semester 4 Resources (Under Review)',
    type: 'folder',
    parentId: 'f-electrical',
    status: 'draft',
    size: 0,
    branch: 'Electrical Engineering',
    downloadsCount: 0,
    viewsCount: 0,
    createdAt: '2026-08-14T07:00:00.000Z',
    updatedAt: '2026-08-14T07:00:00.000Z',
    description: 'Work in progress folder for next semester curriculum.'
  }
];
