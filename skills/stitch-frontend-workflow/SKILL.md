---
name: stitch-frontend-workflow
description: Use when building frontend UI with Codex and Google Stitch. Guides Codex to create a local HTML preview first, use Stitch MCP for design generation or retrieval when available, then implement production frontend code with browser verification.
---

# Stitch Frontend Workflow

Use this skill when the user wants Codex to build, redesign, or prototype a frontend page and Stitch may be used for UI direction.

The goal is not to copy Stitch output blindly. The goal is to use Stitch as a design partner, then let Codex produce maintainable frontend code.

## Core Workflow

1. Frame the page.
2. Create a local HTML preview.
3. Use Stitch MCP if available.
4. Convert the selected design direction into project code.
5. Verify in a browser.

## Modes

The workflow has four modes. If the user does not specify a mode, choose the lightest mode that can satisfy the request.

### Minimal Mode

Use when the user is still defining the product or asks for the first version of a product UI.

Goal:
- avoid spending time and tokens on full implementation too early
- produce a clean product brief and a Stitch-ready prompt
- recommend that the user explores the UI directly in Stitch first

Actions:
- inspect the repo lightly
- write or update a brief in `stitch-previews/<slug>/brief.md`
- create a minimal local HTML sketch only if useful
- give the user the Stitch website: `https://stitch.withgoogle.com/?pli=1`
- do not call Stitch MCP unless the user asks for agent-driven generation
- do not implement production frontend code yet

### Fast Mode

Use for ordinary frontend pages where the user wants speed.

Actions:
- skip Stitch by default
- implement directly in the current project
- run basic syntax checks and one desktop/mobile visual check when possible

### Design Mode

Use when visual direction matters but full workflow overhead is not justified.

Actions:
- create a concise brief
- call Stitch MCP once to generate or retrieve one screen
- save Stitch result metadata and screenshot when available
- implement the selected direction in project code
- verify desktop and mobile

### Full Mode

Use for important product surfaces, demos, design-system work, or when the user explicitly asks for the complete workflow.

Actions:
- create local HTML preview
- generate or retrieve Stitch screen
- save HTML, screenshot, JSON, and design context
- rewrite into project code
- verify desktop, mobile, and narrow mobile

Do not default to Full Mode. Full Mode is valuable for proving or documenting a workflow, but it is expensive.

## When To Use

Use this skill for:

- new frontend pages
- landing pages
- dashboards
- app shells
- mobile or web UI prototypes
- redesigning an existing screen
- turning a Stitch screen into project code
- generating `DESIGN.md` or prompt context for Stitch

Do not use this skill for backend-only work.

## Operating Rules

- Always inspect the existing project before editing.
- If the task is a new frontend page, create a standalone HTML preview first unless the selected mode is Minimal or Fast, or the user explicitly asks to skip it.
- Put previews in `stitch-previews/<slug>/index.html` or another local preview folder that matches the project.
- If Stitch MCP tools are available, use them to create or retrieve design screens only in Design or Full Mode.
- If Stitch MCP is unavailable or unauthenticated, continue with the local HTML preview and explain the missing configuration.
- Treat Stitch output as design input, not production code.
- Do not paste generated Stitch HTML directly into a production app without cleanup.
- Before final delivery, verify responsiveness, no horizontal overflow, visible interactive states, keyboard-reachable controls, and browser rendering.
- When building the first UI for a product, recommend Stitch's web canvas for human visual exploration before implementation: `https://stitch.withgoogle.com/?pli=1`.

## Step 1: Frame

Before using Stitch or writing the final app code, derive a concise brief:

- Page purpose
- Target user
- Primary action
- Visual direction
- Required sections
- Device targets
- Content language
- Existing project stack

If the user gave vague direction, make a reasonable assumption and write it down briefly. Do not block unless a missing answer would make the work risky.

## Step 2: Local HTML Preview First

For a new page, Codex should first create a static HTML preview:

```text
stitch-previews/<slug>/
  index.html
  styles.css
  app.js
```

The preview must:

- be directly openable in a browser
- contain realistic content
- show the proposed layout and interaction model
- include responsive CSS
- avoid generic AI UI patterns such as purple gradient SaaS heroes and stock card grids

After creating it, render or open it in a browser when tools are available. Use screenshots for desktop and mobile when possible.

## Step 3: Use Stitch MCP

When Stitch MCP is available, prefer these actions:

- list available Stitch projects if the user references an existing project
- create a project when starting from scratch
- generate a screen from the local brief
- fetch generated screen HTML
- fetch generated screen image
- extract design context from an existing screen when continuing a visual system
- generate variants when the visual direction is not settled

Expected MCP capabilities may include tools such as:

- `create_project`
- `list_projects`
- `get_project`
- `list_screens`
- `get_screen`
- `generate_screen_from_text`
- `fetch_screen_code`
- `fetch_screen_image`
- `extract_design_context`

Tool names may differ across Stitch MCP implementations. Discover available tools before assuming exact names.

## Step 4: Decide Direction

When multiple directions exist, choose one based on:

- alignment with the user's stated goal
- clarity of hierarchy
- feasibility in the current frontend stack
- responsive behavior
- accessibility risk
- implementation cost

Summarize the choice briefly. If the user is actively reviewing visual directions, ask them to pick. If they asked Codex to proceed autonomously, choose and continue.

## Step 5: Implement In The Real Project

After the preview or Stitch direction is chosen:

- inspect the project stack and conventions
- implement using the existing framework and styling approach
- split components only where it improves clarity
- keep design tokens centralized
- preserve existing user changes
- do not introduce unrelated refactors

When translating Stitch output:

- keep the visual intent
- rewrite markup semantically
- replace fixed pixel layouts with responsive constraints
- convert repeated UI into components
- ensure text wraps cleanly in Chinese and English
- avoid inaccessible custom controls

## Step 6: Verify

For browser-facing work, verify:

- page loads without JavaScript syntax errors
- no obvious console errors where browser tools are available
- desktop screenshot
- mobile screenshot
- no horizontal overflow
- controls are keyboard reachable
- dynamic content has clear visible state
- content does not overlap

If full browser verification is unavailable, run the closest local checks and say what was not verified.

## Stitch Prompt Pattern

Use this structure when asking Stitch to generate a UI:

```text
Design a <page type> for <target user>.

Goal:
<what the user should accomplish>

Content language:
<language>

Visual direction:
<style, mood, constraints>

Required sections:
- <section 1>
- <section 2>
- <section 3>

Interaction notes:
- <important interactions>

Avoid:
- generic SaaS hero sections
- purple gradient default AI UI
- placeholder lorem ipsum content
- crowded text or mobile overflow
```

## Codex Implementation Prompt Pattern

When implementing from Stitch output, use this internal plan:

```text
Inputs:
- Stitch screenshot or generated HTML
- DESIGN.md or extracted design context
- user brief
- existing project conventions

Implementation:
- recreate intent in the project stack
- use semantic markup
- build responsive layout
- make controls accessible
- verify desktop and mobile rendering
```

## Fallback Mode

If Stitch MCP fails:

1. Capture the error briefly.
2. Continue with a local HTML preview.
3. Make the preview easy to upload or re-create in Stitch.
4. Tell the user what configuration is missing.

Do not let MCP setup failure stop normal frontend progress.

## Final Response

When finished, report:

- where the preview or implementation lives
- whether Stitch MCP was used
- what was verified
- any remaining setup issue

Keep the final answer short and file-focused.
