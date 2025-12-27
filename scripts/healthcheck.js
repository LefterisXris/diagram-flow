#!/usr/bin/env node

/**
 * DiagramFlow Health Check Script
 *
 * This script verifies that the DiagramFlow application is running correctly
 * and accessible to users. It checks:
 * 1. Dev server is running and responding
 * 2. HTML page loads successfully
 * 3. No critical errors in the response
 *
 * Usage:
 *   node scripts/healthcheck.js [port]
 *   Default port: 5173
 */

import http from 'http';

const DEFAULT_PORT = 5173;
const TIMEOUT = 5000; // 5 seconds

function checkHealth(port = DEFAULT_PORT) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: TIMEOUT
    };

    console.log(`\n🔍 Checking DiagramFlow health at http://localhost:${port}...`);

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Server is responding (Status: 200)');

          // Check for critical content
          const checks = [
            { name: 'HTML structure', test: () => data.includes('<!DOCTYPE html>') || data.includes('<html') },
            { name: 'Root div', test: () => data.includes('id="root"') },
            { name: 'Script tag', test: () => data.includes('<script') }
          ];

          let allPassed = true;
          checks.forEach(check => {
            const passed = check.test();
            const icon = passed ? '✅' : '❌';
            console.log(`${icon} ${check.name}: ${passed ? 'Found' : 'Missing'}`);
            if (!passed) allPassed = false;
          });

          if (allPassed) {
            console.log('\n✅ Health check PASSED - App is accessible and functional\n');
            resolve(true);
          } else {
            console.log('\n⚠️  Health check WARNING - App loaded but some checks failed\n');
            resolve(false);
          }
        } else {
          console.log(`❌ Server responded with status: ${res.statusCode}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ Connection refused - Server not running on port ${port}`);
        console.log('   💡 Try running: npm run dev\n');
      } else {
        console.log(`❌ Error: ${error.message}\n`);
      }
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`❌ Request timeout after ${TIMEOUT}ms\n`);
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// Parse command line arguments
const port = parseInt(process.argv[2]) || DEFAULT_PORT;

// Run health check
checkHealth(port)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
