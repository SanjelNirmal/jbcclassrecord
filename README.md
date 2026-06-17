# Class Record Printer

Class Record Printer is a specialized web application designed to help teachers map, structure, and directly print daily class records onto pre-printed paper templates with absolute precision.

## Features

- **Dashboard**: Track your previous class records.
- **Record Entry**: Easily enter daily subjects, topics, starting times, and pedagogy indicators. Multiple rows are fully supported.
- **Template Calibration Engine**: Upload a scan of your pre-printed document. Interactively drag, place, and assign X, Y coordinates to specific input fields. These will lock onto the pre-printed layout perfectly.
- **Accurate Browser Printing**: Employs `@media print` layout and absolute viewport positioning to send text precisely to a configured offset on specific rows without misaligned margins or unexpected zooming. 
- **SQLite Storage**: Local embedded SQLite database, ready out of the box with zero external configuration requirements. 

## Technology 

- **Frontend**: React 19, React Router, TailwindCSS, Lucide Icons, Vite
- **Backend**: Express, Multer (for template image uploads)
- **Database**: SQLite3 (\`better-sqlite3\`) embedded. No remote DB necessary!

## Installation & Setup 

*(For local deployment outside of AI Studio)*

1. Navigate to the project directory:
   \`\`\`bash
   cd react-example
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the application:
   \`\`\`bash
   npm run dev
   \`\`\`

The server will be available at \`http://localhost:3000\`.

## Common Workflows

**Calibrate your Template:**
1. Navigate to **Templates** -> **New Template**.
2. Upload a scan or photo of your actual paper record.
3. Your fields appear in red overlays. Adjust X and Y text input boxes on the left to slide elements onto their destination positions.
4. Save the calibrated template.

**Print an Entry:**
1. Navigate to the Dashboard. Click **New Class Record**.
2. Fill your period information into the table. 
3. Switch off "Overlay Mode" and check the visual proof against your template scan.
4. Put the original pre-printed document into your printer.
5. Click **Print Now**.
