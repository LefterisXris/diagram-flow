/**
 * Pet Clinic Template - Spring Boot + Angular
 *
 * A classic 3-tier web application demonstrating:
 * - Frontend (Angular 18 with TypeScript)
 * - Backend (Spring Boot 3.2 with Java 21)
 * - Database (MySQL 8.0)
 * - Authentication decision logic
 *
 * Based on architect.md Section 10.4
 */

export const petClinicTemplate = {
  metadata: {
    name: "Pet Clinic - Spring Boot + Angular",
    description: "Classic 3-tier CRUD application for managing a veterinary clinic",
    version: "1.0.0",
    author: "DiagramFlow",
    created: new Date().toISOString(),
  },

  nodes: [
    // Angular Frontend (Client)
    {
      id: "angular-frontend",
      type: "client",
      position: { x: 100, y: 250 },
      data: {
        label: "Angular Frontend",
        icon: "Layout",
        description: "Single-page application built with Angular 18 providing the user interface for the Pet Clinic system",
        metadata: {
          techStack: "Angular 18, TypeScript, RxJS, Angular Material",
          version: "18.0.0",
          features: [
            "User authentication with JWT",
            "Pet management CRUD operations",
            "Owner management",
            "Veterinarian directory",
            "Visit scheduling",
            "Responsive design"
          ],
          routes: [
            "/login - User login page",
            "/dashboard - Main dashboard",
            "/pets - Pet list and management",
            "/owners - Owner list and management",
            "/vets - Veterinarian directory",
            "/visits - Visit scheduling and history"
          ],
          dependencies: [
            "@angular/core: ^18.0.0",
            "@angular/material: ^18.0.0",
            "rxjs: ^7.8.0",
            "typescript: ^5.3.0"
          ]
        },
        tags: ["frontend", "angular", "typescript", "spa"],
        owner: "Frontend Team",
        status: "active",
      }
    },

    // Authentication Decision Node
    {
      id: "auth-decision",
      type: "decision",
      position: { x: 400, y: 250 },
      data: {
        label: "Authentication Check",
        icon: "Shield",
        description: "Validates user credentials and determines if the request should proceed or be rejected",
        metadata: {
          logic: "JWT token validation",
          conditions: [
            "Valid credentials → Proceed to backend",
            "Invalid credentials → Return 401 Unauthorized",
            "Expired token → Return 403 Forbidden"
          ],
          security: [
            "JWT signature verification",
            "Token expiration check",
            "User role validation"
          ]
        },
        tags: ["security", "authentication", "jwt", "decision"],
        owner: "Security Team",
        status: "active",
      }
    },

    // Spring Boot Backend (Service)
    {
      id: "spring-backend",
      type: "service",
      position: { x: 700, y: 250 },
      data: {
        label: "Spring Boot Backend",
        icon: "Server",
        description: "RESTful API service built with Spring Boot 3.2, handling business logic and data operations",
        metadata: {
          techStack: "Java 21, Spring Boot 3.2, Spring Data JPA, Spring Security, Hibernate",
          version: "3.2.0",
          endpoints: [
            "POST /api/auth/login - User authentication",
            "POST /api/auth/logout - User logout",
            "GET /api/pets - List all pets",
            "POST /api/pets - Create new pet",
            "GET /api/pets/{id} - Get pet details",
            "PUT /api/pets/{id} - Update pet",
            "DELETE /api/pets/{id} - Delete pet",
            "GET /api/owners - List all owners",
            "POST /api/owners - Create new owner",
            "GET /api/owners/{id} - Get owner details",
            "PUT /api/owners/{id} - Update owner",
            "GET /api/vets - List all veterinarians",
            "GET /api/visits - List all visits",
            "POST /api/visits - Schedule new visit"
          ],
          features: [
            "JWT-based authentication",
            "Role-based access control (RBAC)",
            "RESTful API design",
            "Request validation",
            "Exception handling",
            "Logging and monitoring",
            "API documentation with Swagger"
          ],
          services: [
            "AuthService - Authentication logic",
            "PetService - Pet management",
            "OwnerService - Owner management",
            "VetService - Veterinarian management",
            "VisitService - Visit scheduling"
          ],
          dependencies: [
            "spring-boot-starter-web: 3.2.0",
            "spring-boot-starter-data-jpa: 3.2.0",
            "spring-boot-starter-security: 3.2.0",
            "mysql-connector-java: 8.0.33",
            "jjwt: 0.11.5"
          ]
        },
        tags: ["backend", "spring-boot", "java", "rest-api"],
        owner: "Backend Team",
        status: "active",
      }
    },

    // MySQL Database
    {
      id: "mysql-database",
      type: "database",
      position: { x: 1000, y: 250 },
      data: {
        label: "MySQL Database",
        icon: "Database",
        description: "MySQL 8.0 database storing all application data with proper normalization and constraints",
        metadata: {
          techStack: "MySQL 8.0, InnoDB storage engine",
          version: "8.0.35",
          tables: [
            "users - User accounts and credentials",
            "pets - Pet information (name, type, birth date)",
            "owners - Pet owner details (name, address, phone)",
            "vets - Veterinarian information (name, specialties)",
            "visits - Visit records (date, description, pet_id, vet_id)",
            "pet_types - Pet type lookup (dog, cat, bird, etc.)",
            "specialties - Veterinarian specialty lookup"
          ],
          schema: {
            users: {
              columns: [
                "id (INT PRIMARY KEY AUTO_INCREMENT)",
                "username (VARCHAR(50) UNIQUE NOT NULL)",
                "password_hash (VARCHAR(255) NOT NULL)",
                "email (VARCHAR(100) UNIQUE NOT NULL)",
                "role (ENUM('USER', 'ADMIN') DEFAULT 'USER')",
                "created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
              ],
              indexes: ["idx_username", "idx_email"]
            },
            pets: {
              columns: [
                "id (INT PRIMARY KEY AUTO_INCREMENT)",
                "name (VARCHAR(100) NOT NULL)",
                "birth_date (DATE)",
                "type_id (INT, FK → pet_types.id)",
                "owner_id (INT NOT NULL, FK → owners.id)",
                "created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
              ],
              indexes: ["idx_owner_id", "idx_type_id"]
            },
            owners: {
              columns: [
                "id (INT PRIMARY KEY AUTO_INCREMENT)",
                "first_name (VARCHAR(50) NOT NULL)",
                "last_name (VARCHAR(50) NOT NULL)",
                "address (VARCHAR(255))",
                "city (VARCHAR(50))",
                "telephone (VARCHAR(20))",
                "created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
              ],
              indexes: ["idx_last_name"]
            },
            vets: {
              columns: [
                "id (INT PRIMARY KEY AUTO_INCREMENT)",
                "first_name (VARCHAR(50) NOT NULL)",
                "last_name (VARCHAR(50) NOT NULL)",
                "created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
              ]
            },
            visits: {
              columns: [
                "id (INT PRIMARY KEY AUTO_INCREMENT)",
                "pet_id (INT NOT NULL, FK → pets.id)",
                "vet_id (INT, FK → vets.id)",
                "visit_date (DATE NOT NULL)",
                "description (TEXT)",
                "created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
              ],
              indexes: ["idx_pet_id", "idx_vet_id", "idx_visit_date"]
            }
          },
          features: [
            "Foreign key constraints for referential integrity",
            "Indexes on frequently queried columns",
            "Timestamps for audit trails",
            "UTF-8 character set support",
            "InnoDB for ACID compliance"
          ]
        },
        tags: ["database", "mysql", "storage", "persistence"],
        owner: "Database Team",
        status: "active",
      }
    }
  ],

  edges: [
    // Angular → Auth Decision
    {
      id: "edge-frontend-auth",
      source: "angular-frontend",
      target: "auth-decision",
      type: "default",
      animated: false,
      label: "User Request",
      data: {
        label: "User Request",
        description: "HTTP request from Angular to backend (with or without credentials)",
        protocol: "HTTP/HTTPS",
        dataFormat: "JSON",
        authentication: "JWT Bearer Token (if logged in)"
      }
    },

    // Auth Decision → Spring Backend (Valid)
    {
      id: "edge-auth-valid",
      source: "auth-decision",
      target: "spring-backend",
      type: "default",
      animated: false,
      label: "Valid Credentials",
      data: {
        label: "Valid Credentials",
        description: "Request proceeds to backend after successful authentication",
        condition: "credentials.valid === true",
        conditionType: "conditional",
        priority: 1
      }
    },

    // Auth Decision → Angular (Invalid - return path)
    {
      id: "edge-auth-invalid",
      source: "auth-decision",
      target: "angular-frontend",
      type: "default",
      animated: false,
      label: "Invalid Credentials",
      data: {
        label: "Invalid Credentials (401)",
        description: "Returns 401 Unauthorized error to frontend",
        condition: "credentials.valid === false",
        conditionType: "conditional",
        priority: 2
      },
      style: {
        stroke: '#ef4444',
        strokeDasharray: '5,5'
      }
    },

    // Spring Backend → MySQL Database
    {
      id: "edge-backend-db",
      source: "spring-backend",
      target: "mysql-database",
      type: "default",
      animated: false,
      label: "JDBC",
      data: {
        label: "JDBC Connection",
        description: "Database operations via JDBC and Spring Data JPA",
        protocol: "MySQL Protocol (TCP/IP)",
        connectionPool: "HikariCP",
        operations: ["SELECT", "INSERT", "UPDATE", "DELETE"]
      }
    },

    // MySQL Database → Spring Backend (Response)
    {
      id: "edge-db-backend",
      source: "mysql-database",
      target: "spring-backend",
      type: "default",
      animated: false,
      label: "Query Result",
      data: {
        label: "Query Result",
        description: "Database query results returned to backend",
        dataFormat: "ResultSet / Entity Objects"
      }
    },

    // Spring Backend → Angular (Response)
    {
      id: "edge-backend-frontend",
      source: "spring-backend",
      target: "angular-frontend",
      type: "default",
      animated: false,
      label: "HTTP Response",
      data: {
        label: "HTTP Response (JSON)",
        description: "API response sent back to Angular frontend",
        protocol: "HTTP/HTTPS",
        dataFormat: "JSON",
        statusCodes: ["200 OK", "201 Created", "400 Bad Request", "404 Not Found", "500 Internal Server Error"]
      }
    }
  ],

  // Example cases demonstrating various flows
  exampleCases: [
    // Case 1: User Login Flow (Success Path)
    {
      id: "case-login-success",
      name: "User Login Flow",
      description: "Successful user authentication through JWT validation",
      input: {
        nodeId: "angular-frontend",
        data: {
          username: "admin",
          password: "admin123",
          credentials: {
            valid: true
          }
        }
      },
      expectedPath: [
        "angular-frontend",
        "auth-decision",
        "spring-backend",
        "mysql-database",
        "spring-backend",
        "angular-frontend"
      ],
      highlights: [
        {
          edgeId: "edge-frontend-auth",
          reason: "User submits login credentials from Angular app"
        },
        {
          edgeId: "edge-auth-valid",
          reason: "Credentials are valid, proceeds to backend"
        },
        {
          edgeId: "edge-backend-db",
          reason: "Backend queries database to verify user credentials"
        },
        {
          edgeId: "edge-db-backend",
          reason: "Database returns user record with hashed password"
        },
        {
          edgeId: "edge-backend-frontend",
          reason: "Backend generates JWT token and returns to frontend"
        }
      ]
    },

    // Case 2: Create New Pet (CRUD Operation)
    {
      id: "case-create-pet",
      name: "Create New Pet",
      description: "CRUD operation with owner validation before creating a pet record",
      input: {
        nodeId: "angular-frontend",
        data: {
          name: "Fluffy",
          type: "cat",
          birthDate: "2022-05-15",
          ownerId: 42,
          credentials: {
            valid: true,
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          }
        }
      },
      expectedPath: [
        "angular-frontend",
        "auth-decision",
        "spring-backend",
        "mysql-database",
        "spring-backend",
        "angular-frontend"
      ],
      highlights: [
        {
          edgeId: "edge-frontend-auth",
          reason: "User submits pet creation form with JWT token"
        },
        {
          edgeId: "edge-auth-valid",
          reason: "JWT token is valid, request proceeds"
        },
        {
          edgeId: "edge-backend-db",
          reason: "Backend validates owner exists, then inserts pet record"
        },
        {
          edgeId: "edge-db-backend",
          reason: "Database returns newly created pet with ID"
        },
        {
          edgeId: "edge-backend-frontend",
          reason: "Backend returns success response with pet details"
        }
      ]
    },

    // Case 3: Invalid Owner Error (Error Handling)
    {
      id: "case-invalid-owner",
      name: "Invalid Owner Error",
      description: "Error handling when attempting to create a pet with non-existent owner",
      input: {
        nodeId: "angular-frontend",
        data: {
          name: "Spot",
          type: "dog",
          birthDate: "2023-01-10",
          ownerId: 999,
          credentials: {
            valid: true,
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          }
        }
      },
      expectedPath: [
        "angular-frontend",
        "auth-decision",
        "spring-backend",
        "mysql-database",
        "spring-backend",
        "angular-frontend"
      ],
      highlights: [
        {
          edgeId: "edge-frontend-auth",
          reason: "User submits pet creation form with invalid owner ID"
        },
        {
          edgeId: "edge-auth-valid",
          reason: "JWT token is valid, request proceeds"
        },
        {
          edgeId: "edge-backend-db",
          reason: "Backend queries database to validate owner exists"
        },
        {
          edgeId: "edge-db-backend",
          reason: "Database returns null - owner ID 999 not found"
        },
        {
          edgeId: "edge-backend-frontend",
          reason: "Backend returns 404 Not Found error to frontend"
        }
      ]
    }
  ],

  // Viewport settings for optimal initial view
  viewport: {
    x: 0,
    y: 0,
    zoom: 0.8
  }
};

export default petClinicTemplate;
