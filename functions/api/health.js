/**
 * Health Check API
 * GET /api/health
 *
 * Returns system status and version info
 */

export async function onRequestGet(context) {
  const { env } = context;

  // Check if environment variables are set
  const hasDatabase = !!env.NEON_DATABASE_URL;
  const hasJwtSecret = !!env.JWT_SECRET;
  const hasGitHubToken = !!env.GITHUB_TOKEN;

  const health = {
    success: true,
    data: {
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: {
        database: hasDatabase ? 'configured' : 'not configured',
        authentication: hasJwtSecret ? 'configured' : 'not configured',
        githubApi: hasGitHubToken ? 'configured (authenticated)' : 'configured (unauthenticated)',
      },
      message: 'Vibe Grade API is running'
    }
  };

  return new Response(JSON.stringify(health, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    }
  });
}
