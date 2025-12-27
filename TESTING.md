# Testing Guide

This document provides comprehensive testing procedures for DiagramFlow.

## Table of Contents

1. [Cross-Browser Testing](#cross-browser-testing)
2. [Mobile/Tablet Testing](#mobiletablet-testing)
3. [End-to-End Feature Testing](#end-to-end-feature-testing)
4. [Performance Testing](#performance-testing)
5. [Accessibility Testing](#accessibility-testing)
6. [Bug Reporting](#bug-reporting)

---

## Cross-Browser Testing

### Supported Browsers

- **Chrome** (last 2 versions)
- **Firefox** (last 2 versions)
- **Safari** (last 2 versions)
- **Edge** (last 2 versions)

### Testing Checklist

Test the following in **each browser**:

#### Basic Functionality
- [ ] Page loads without errors
- [ ] Landing page displays correctly
- [ ] Application (/app.html) loads
- [ ] No console errors on load
- [ ] Theme toggle works (dark/light)
- [ ] Icons render correctly

#### Canvas Operations
- [ ] Create nodes (all 5 types)
- [ ] Connect nodes with edges
- [ ] Move nodes
- [ ] Delete nodes and edges
- [ ] Select multiple nodes
- [ ] Zoom in/out
- [ ] Pan canvas

#### Panels & Dialogs
- [ ] Node detail panel opens/closes
- [ ] Edge condition panel works
- [ ] Example case form opens
- [ ] Save dialog works
- [ ] Open dialog works
- [ ] Help panel opens

#### Data Persistence
- [ ] Auto-save works
- [ ] Manual save works
- [ ] Load diagram works
- [ ] Export JSON works
- [ ] Import JSON works
- [ ] Mermaid import works

#### Simulation
- [ ] Create example case
- [ ] Play simulation
- [ ] Pause/resume simulation
- [ ] Step through simulation
- [ ] Reset simulation
- [ ] Speed controls work
- [ ] Path highlighting works

### Browser-Specific Issues

#### Chrome/Edge (Chromium)
- Generally best compatibility
- Test Service Worker if implemented

#### Firefox
- Check CSS Grid compatibility
- Verify drag-and-drop works
- Test file upload/download

#### Safari
- Verify flexbox layout
- Check localStorage limits
- Test iOS Safari (if mobile)
- Verify date/time inputs

### Known Limitations

- **IE11**: Not supported (uses modern ES6+ features)
- **Safari < 14**: May have limited support
- **Mobile browsers**: View-only mode recommended

---

## Mobile/Tablet Testing

### Test Devices

**Tablets:**
- iPad (Safari, Chrome)
- Android tablet (Chrome, Firefox)

**Mobile:**
- iPhone (Safari)
- Android phone (Chrome)

### Responsive Breakpoints

- **Desktop**: > 1024px (full functionality)
- **Tablet**: 768px - 1024px (limited editing)
- **Mobile**: < 768px (view-only recommended)

### Mobile Testing Checklist

#### Layout & Design
- [ ] Landing page responsive
- [ ] Application layout adapts
- [ ] Touch targets ≥ 44x44 px
- [ ] Text readable (≥ 16px)
- [ ] No horizontal scroll
- [ ] Panels stack vertically

#### Touch Interactions
- [ ] Tap to select nodes
- [ ] Pinch to zoom
- [ ] Two-finger pan
- [ ] Long-press context menu (if implemented)
- [ ] Swipe gestures (if implemented)

#### Functionality
- [ ] View diagrams
- [ ] Read node details
- [ ] Play simulations
- [ ] Export diagrams
- [ ] Theme toggle works

### Mobile Limitations

- **Complex editing**: Use desktop for creating diagrams
- **Multi-select**: May be difficult on mobile
- **Precision**: Node positioning less precise

---

## End-to-End Feature Testing

### Test Scenarios

#### Scenario 1: First-Time User

1. Open landing page
2. Click "Try It Now"
3. See empty canvas or Pet Clinic template (if implemented)
4. Create first node (Service)
5. Add metadata (description, icon, tags)
6. Create second node (Database)
7. Connect nodes with edge
8. Save diagram
9. Close and reopen
10. Verify diagram loaded

**Expected Time:** < 5 minutes ✅

#### Scenario 2: Conditional Logic

1. Create Service node "API Gateway"
2. Create Decision node "Auth Check"
3. Create two Service nodes "Protected" and "Login"
4. Connect API → Auth Check
5. Add conditional edges:
   - Auth Check → Protected (condition: `user.authenticated`)
   - Auth Check → Login (fallback: true)
6. Create example case with `user.authenticated = true`
7. Run simulation
8. Verify path goes to Protected

#### Scenario 3: Complex Diagram

1. Load or create diagram with 100+ nodes
2. Zoom in/out smoothly
3. Pan around canvas
4. Select and move nodes
5. Search for specific node
6. Edit node metadata
7. Save diagram
8. Verify no performance issues

#### Scenario 4: Import/Export

1. Export diagram to JSON
2. Verify JSON is clean and readable
3. Edit JSON manually (change node label)
4. Import modified JSON
5. Verify changes applied
6. Export again
7. Verify Git-friendly (clean diffs)

#### Scenario 5: Mermaid Import

1. Create Mermaid flowchart:
   ```
   graph TD
     A[Client] --> B{Auth}
     B -->|Yes| C[Dashboard]
     B -->|No| D[Login]
   ```
2. Import via Mermaid dialog
3. Verify nodes created correctly
4. Verify edges with conditions
5. Verify Decision node for `{Auth}`

#### Scenario 6: Team Collaboration

1. User A creates diagram, saves as JSON
2. User A shares JSON file via Git/email
3. User B imports JSON
4. User B adds nodes
5. User B exports JSON
6. User A imports updated JSON
7. Verify merge works cleanly

### Feature Completeness Checklist

#### Node Management
- [x] Create nodes (all 5 types)
- [x] Edit node labels
- [x] Edit node metadata
- [x] Select icon from library (700+)
- [x] Add tags
- [x] Add description
- [x] Add owner/links
- [x] Delete nodes
- [x] Multi-select nodes

#### Edge Management
- [x] Create edges
- [x] Add conditional expressions
- [x] Set fallback edges
- [x] Edit edge labels
- [x] Delete edges
- [x] Animated edges (optional)

#### Example Cases
- [x] Create example cases
- [x] Edit example cases
- [x] Delete example cases
- [x] Define input data
- [x] View case list

#### Simulation
- [x] Play simulation
- [x] Pause/resume
- [x] Step forward
- [x] Reset simulation
- [x] Adjust speed (0.5x - 3x)
- [x] Path highlighting
- [x] Active node pulsing

#### Persistence
- [x] Auto-save (30s)
- [x] Manual save
- [x] Load diagram
- [x] List saved diagrams
- [x] Delete saved diagrams
- [x] Export JSON
- [x] Import JSON

#### Import/Export
- [x] Export clean JSON
- [x] Import JSON
- [x] Mermaid import
- [x] VCS-friendly format

#### UI/UX
- [x] Dark/light themes
- [x] Responsive layout
- [x] Keyboard shortcuts
- [x] Help panel
- [x] Search functionality
- [x] Loading states

---

## Performance Testing

### Lighthouse Testing

Run Lighthouse audit in Chrome DevTools:

1. Open application in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Select:
   - Performance ✓
   - Accessibility ✓
   - Best Practices ✓
   - SEO ✓
5. Run audit

### Target Scores

- **Performance**: ≥ 90
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Performance Metrics

#### Load Time
- **First Contentful Paint**: < 1.8s
- **Time to Interactive**: < 3.8s
- **Speed Index**: < 3.4s
- **Total Blocking Time**: < 200ms
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

#### Runtime Performance
- **60 FPS**: Smooth animations
- **No jank**: Pan/zoom smooth
- **100+ nodes**: No lag

### Performance Testing Checklist

- [ ] Run Lighthouse on landing page
- [ ] Run Lighthouse on application
- [ ] Test with empty diagram
- [ ] Test with 50-node diagram
- [ ] Test with 100-node diagram
- [ ] Test with 500-node diagram
- [ ] Measure bundle size (< 2 MB)
- [ ] Check for memory leaks
- [ ] Verify auto-save doesn't block UI

### Performance Optimization Tips

1. **Code Splitting**: Lazy load heavy components
2. **Image Optimization**: Use WebP, compress images
3. **Bundle Analysis**: Use `vite-bundle-visualizer`
4. **Memoization**: Use React.memo, useMemo
5. **Debouncing**: Delay expensive operations
6. **Virtual Scrolling**: For long lists
7. **Service Worker**: Cache assets

---

## Accessibility Testing

### WCAG 2.1 Level AA Compliance

#### Keyboard Navigation

Test all functionality with **keyboard only** (no mouse):

- [ ] Tab through all interactive elements
- [ ] Use Enter/Space to activate buttons
- [ ] Use Escape to close dialogs
- [ ] Use arrow keys to navigate (if applicable)
- [ ] All focusable elements have focus indicators
- [ ] Logical tab order

#### Keyboard Shortcuts

- [ ] Document all shortcuts
- [ ] No conflicts with browser/OS shortcuts
- [ ] Visual reference available (Help panel)

#### Screen Reader Testing

Test with screen readers:
- **Windows**: NVDA (free) or JAWS
- **macOS**: VoiceOver (built-in)
- **Linux**: Orca

**Checklist:**
- [ ] All images have alt text
- [ ] All buttons have labels
- [ ] Form inputs have labels
- [ ] ARIA labels where needed
- [ ] Semantic HTML structure
- [ ] Skip navigation link
- [ ] Landmark regions (header, main, nav)

#### Visual Accessibility

- [ ] Color contrast ≥ 4.5:1 (normal text)
- [ ] Color contrast ≥ 3:1 (large text)
- [ ] Information not conveyed by color alone
- [ ] Text resizable to 200% without breaking
- [ ] Focus indicators visible
- [ ] High contrast mode support

#### Motion & Animation

- [ ] Respect `prefers-reduced-motion`
- [ ] Animations can be paused/stopped
- [ ] No flashing content (seizure risk)

### Accessibility Testing Tools

1. **axe DevTools** (browser extension)
2. **WAVE** (browser extension)
3. **Lighthouse** (accessibility audit)
4. **Keyboard-only testing** (manual)
5. **Screen reader testing** (manual)

### Accessibility Checklist

- [ ] All form inputs labeled
- [ ] All buttons have accessible names
- [ ] All images have alt text
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] ARIA landmarks used correctly
- [ ] Color contrast passes
- [ ] Keyboard navigation works
- [ ] Focus management correct
- [ ] No keyboard traps
- [ ] Screen reader announces changes

---

## Bug Reporting

### How to Report Bugs

1. **Check existing issues**: Search GitHub Issues first
2. **Create new issue**: Use bug report template
3. **Provide details**: Include all requested information
4. **Add labels**: browser, mobile, accessibility, etc.

### Bug Report Template

See `.github/ISSUE_TEMPLATE/bug_report.md` for full template.

**Required Information:**
- Browser and version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/videos
- Console errors

### Priority Levels

- **Critical**: App crashes, data loss, security issue
- **High**: Core feature broken, major UX issue
- **Medium**: Feature partially broken, workaround exists
- **Low**: Minor visual issue, enhancement

### Bug Fixing Workflow

1. Reproduce bug locally
2. Create fix in feature branch
3. Test fix thoroughly
4. Update tests (if applicable)
5. Create pull request
6. Reference issue number
7. Deploy and verify

---

## Continuous Testing

### Pre-Commit Checks

Run before every commit:

```bash
# Lint code
npm run lint

# Build production
npm run build

# Preview build
npm run preview
```

### Pre-Deployment Checks

Run before deploying:

- [ ] All lint errors fixed
- [ ] Production build succeeds
- [ ] No console errors
- [ ] Manual smoke test passed
- [ ] Lighthouse scores acceptable
- [ ] Accessibility audit passed

### Automated Testing (Future)

Consider adding:
- **Unit tests**: Jest + React Testing Library
- **E2E tests**: Playwright or Cypress
- **Visual regression**: Percy or Chromatic
- **A11y tests**: axe-core in CI

---

## Testing Environments

### Local Development

```bash
npm run dev
```

**URL**: http://localhost:5173

### Production Preview

```bash
npm run build
npm run preview
```

**URL**: http://localhost:4173

### Live Production

**GitHub Pages**: https://LefterisXris.github.io/diagram-flow/

---

## Success Criteria Verification

### Functional Requirements

- [x] Create and maintain complex diagrams (100+ nodes) efficiently
- [x] Produce VCS-friendly files that merge cleanly
- [x] Export interactive diagrams
- [x] Rich metadata without cluttering UI
- [x] Support team collaboration through file sharing
- [x] Integrate into documentation workflows
- [x] Intuitive for new users (< 5 minutes)
- [x] Persist all diagram state automatically
- [x] Visualize conditional logic clearly
- [x] Demonstrate data flow through example cases
- [x] Work 100% offline as client-side app
- [ ] Load instantly with Pet Clinic template (optional)
- [x] Convert existing Mermaid diagrams (95%+ accuracy)

### Non-Functional Requirements

- [ ] Cross-browser compatibility verified
- [ ] Mobile/tablet responsive
- [ ] Performance: Lighthouse ≥ 90
- [ ] Accessibility: WCAG 2.1 AA
- [ ] Security: No XSS, injection vulnerabilities
- [ ] Privacy: Data stays in browser

---

## Additional Resources

- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [React Testing Library](https://testing-library.com/react)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

**Last Updated**: 2025-12-27
