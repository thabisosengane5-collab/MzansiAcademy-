export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Routes
    if (url.pathname === "/api/health") {
      return Response.json({ status: "ok", timestamp: new Date().toISOString() }, { headers: corsHeaders });
    }

    if (url.pathname === "/api/subjects") {
      return Response.json({
        subjects: [
          { id: "mathematics", name: "Mathematics", grades: ["8","9","10","11","12"] },
          { id: "physical-science", name: "Physical Science", grades: ["8","9","10","11","12"] },
          { id: "english-fal", name: "English FAL", grades: ["8","9","10","11","12"] },
          { id: "life-science", name: "Life Science", grades: ["10","11","12"] },
          { id: "accounting", name: "Accounting", grades: ["10","11","12"] },
        ]
      }, { headers: corsHeaders });
    }

    return Response.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
  }
};

interface Env {}
