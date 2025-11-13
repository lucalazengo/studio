# **App Name**: Employee Manager

## Core Features:

- Employee Table: Display employees in a sortable, filterable data table using Shadcn UI.
- New Employee Modal: A modal dialog to add new employees.
- Edit Employee: Functionality to edit existing employee data.
- Employee Status Badge: Visually display the employee's status (Active, Inactive, Suspended) using badges.
- QR Code Generation: Generates QR code for employee badge and shows badge information on page
- Persist employee data: Store all changes in Cloud SQL Database
- Employee Photo Analysis: Analyze uploaded employee photos using AI to verify photo integrity and adherence to company standards. The LLM reasons as a tool to use face detection, and filters on image dimensions and image size

## Style Guidelines:

- Primary color: Muted blue (#60A5FA) for a professional and trustworthy feel.
- Background color: Light gray (#F9FAFB) to provide a clean and neutral backdrop.
- Accent color: Soft purple (#A78BFA) to highlight key actions and elements, creating a subtle visual distinction.
- Font pairing: 'Inter' (sans-serif) for both headlines and body text. 'Source Code Pro' for code snippets.
- Use consistent, simple icons from a library like Lucide for actions and status indicators.
- Responsive layout with a fixed header and sidebar, ensuring usability across different devices.
- Subtle animations for transitions and loading states to enhance the user experience.