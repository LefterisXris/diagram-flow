# DiagramFlow Examples

This directory contains realistic example diagrams that can be imported into DiagramFlow.

## Available Examples

### E-Commerce Order Processing System
**File**: `ecommerce-order-processing.json`

A complete order processing flow for an online retail platform featuring:

**Architecture Components:**
- **Client Applications**: Web (React) and Mobile (React Native) clients
- **API Gateway**: Centralized entry point with authentication and rate limiting
- **Microservices**:
  - Authentication Service (OAuth 2.0, MFA)
  - Order Service (Python FastAPI)
  - Inventory Service (Go)
  - Fraud Detection Service (ML-based)
  - Payment Service (Multi-gateway, PCI DSS compliant)
  - Notification Service (Email, SMS, Push)
  - Fulfillment Service (.NET)
- **Databases**: PostgreSQL for orders and inventory
- **Decision Nodes**: Authentication validation, stock availability, fraud checking, payment validation

**Features Demonstrated:**
- ✅ Multiple node types (Service, Database, Client, Decision, Generic)
- ✅ Rich metadata (descriptions, tags, owners, links, status, versions)
- ✅ Conditional logic with decision nodes
- ✅ 5 example cases for simulation:
  1. **Happy Path**: Successful order from start to fulfillment
  2. **Out of Stock**: Order rejected due to inventory shortage
  3. **Fraud Detected**: High-risk order blocked by fraud detection
  4. **Payment Failed**: Order processed but payment declined
  5. **Unauthorized**: Invalid authentication token
- ✅ Real-world tech stack (React, Python, Go, Java, .NET, PostgreSQL)
- ✅ Production-grade details (SLAs, performance metrics, monitoring links)

**Total Nodes**: 19 (7 services, 2 databases, 2 clients, 4 decisions, 4 error handlers)
**Total Edges**: 20 connections with conditional logic
**Example Cases**: 5 simulation scenarios

## How to Import

### Method 1: Via Application UI

1. Open DiagramFlow application
2. Click **"Import"** button in the header
3. Select the JSON file (e.g., `ecommerce-order-processing.json`)
4. The diagram will load with all nodes, edges, and example cases

### Method 2: Via File Manager

1. Copy the JSON file content
2. Open DiagramFlow
3. Click **"Import"** → **"Import from JSON"**
4. Paste the JSON content
5. Click **"Import"**

### Method 3: Programmatically

```javascript
import { importDiagram } from './utils/importDiagram';

// Load the JSON file
const response = await fetch('/examples/ecommerce-order-processing.json');
const diagramData = await response.json();

// Import the diagram
const result = importDiagram(diagramData);
console.log('Imported diagram:', result.metadata.name);
```

## Running Simulations

After importing the e-commerce example:

1. **Select an Example Case** in the sidebar:
   - "Successful Order - Happy Path"
   - "Out of Stock - Order Rejected"
   - "High Fraud Risk - Order Blocked"
   - "Payment Declined"
   - "Unauthorized Access - Invalid Token"

2. **Run the Simulation**:
   - Click the **Play** button
   - Watch the flow execute step-by-step
   - See conditional branching in action

3. **Experiment**:
   - Modify the input data (fraud score, inventory quantity, etc.)
   - Create your own example cases
   - Test different scenarios

## Creating Your Own Examples

To create a new example diagram:

1. Build your diagram in DiagramFlow
2. Add rich metadata to nodes:
   - Descriptions (short and detailed)
   - Icons from Lucide library
   - Tags, owners, status, version
   - Links to documentation/repos
3. Add conditional logic with decision nodes
4. Create example cases for simulation
5. Export to JSON: Click **"Export"** → **"Export as JSON"**
6. Save to `examples/` directory
7. Update this README with your example

### Example Structure

```json
{
  "version": "1.0.0",
  "metadata": {
    "id": "unique-id",
    "name": "Example Name",
    "description": "Brief description",
    "createdAt": "2025-12-27T10:00:00Z",
    "author": "Your Team"
  },
  "nodes": [ /* node definitions */ ],
  "edges": [ /* edge connections */ ],
  "exampleCases": [ /* simulation scenarios */ ],
  "viewport": { "x": 0, "y": 0, "zoom": 1 }
}
```

## Use Cases for Examples

- **Onboarding**: Help new users understand DiagramFlow capabilities
- **Templates**: Starting point for similar systems
- **Education**: Learn microservices architecture patterns
- **Testing**: Validate DiagramFlow features
- **Documentation**: Reference implementations
- **Demos**: Showcase the tool's power

## Contributing Examples

We welcome contributions! To add an example:

1. Create a realistic, production-grade diagram
2. Include rich metadata and descriptions
3. Add at least 3 example cases for simulation
4. Export to JSON with descriptive filename
5. Add documentation to this README
6. Submit a pull request

### Quality Guidelines

- **Realistic**: Use actual tech stacks and patterns
- **Complete**: Include all metadata fields
- **Documented**: Clear descriptions for all nodes
- **Tested**: Verify example cases execute correctly
- **Educational**: Demonstrate best practices

## Tips for Effective Examples

1. **Use Real Technologies**: Specify actual frameworks, databases, versions
2. **Add Links**: Include documentation, repository, monitoring URLs
3. **Rich Descriptions**: Explain what each component does and why
4. **Multiple Scenarios**: Create example cases for success and failure paths
5. **Conditional Logic**: Use decision nodes to show branching
6. **Metadata**: Add owners, tags, status, criticality levels
7. **Realistic Data**: Use plausible numbers (request rates, SLAs, etc.)

## Example Categories

Planned examples (contributions welcome):

- **Microservices**: E-commerce (✅), Social Media, Video Streaming
- **Data Pipelines**: ETL workflows, Real-time processing, Data lakes
- **Infrastructure**: CI/CD, Monitoring, Disaster recovery
- **AI/ML**: Training pipelines, Inference services, Model deployment
- **Enterprise**: ERP systems, CRM workflows, HR processes

---

**Questions or Issues?**

- Check the [User Guide](../public/docs/user-guide.md)
- Open an [Issue](https://github.com/LefterisXris/diagram-flow/issues)
- Start a [Discussion](https://github.com/LefterisXris/diagram-flow/discussions)
