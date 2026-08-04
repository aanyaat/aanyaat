import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QuizScorePayload {
  score: number;
  total: number;
  answers?: number[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json() as QuizScorePayload;
    const { score, total, answers } = body;

    if (typeof score !== "number" || typeof total !== "number") {
      return new Response(
        JSON.stringify({ error: "score and total are required numbers" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // --- 1. Persist the score to the database ---
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const perfect = score === total;

    const { error: dbError } = await supabase
      .from("quiz_scores")
      .insert({
        score,
        total,
        perfect,
        answers: answers ? JSON.stringify(answers) : null,
      });

    if (dbError) {
      console.error("DB insert failed:", dbError.message);
    }

    // --- 2. Send an email via Resend ---
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const recipientEmail = Deno.env.get("QUIZ_NOTIFY_EMAIL");
    const now = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const subject = perfect
      ? `Perfect quiz score! ${score}/${total} — Aanya just aced it`
      : `New quiz score: ${score}/${total}`;

    const html = `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #fdf8f0; border: 1px solid #e7c98f; border-radius: 20px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #c02048, #e8b62a); padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 26px;">Quiz Score Alert</h1>
          <p style="color: #fffbeb; margin: 8px 0 0; font-size: 14px;">Someone just finished the birthday quiz</p>
        </div>
        <div style="padding: 32px;">
          <div style="text-align: center; margin-bottom: 28px;">
            <span style="display: inline-block; font-size: 52px; font-weight: bold; color: ${perfect ? "#2f8f5b" : "#c02048"};">
              ${score}<span style="color: #8a6a56; font-size: 32px;"> / ${total}</span>
            </span>
            ${perfect ? '<p style="color: #2f8f5b; font-style: italic; margin: 8px 0 0;">A perfect score!</p>' : ""}
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr>
              <td style="padding: 10px 0; color: #8a6a56; border-bottom: 1px solid #f0e6d2;">Score</td>
              <td style="padding: 10px 0; text-align: right; color: #4a1d2e; font-weight: bold; border-bottom: 1px solid #f0e6d2;">${score} correct</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8a6a56; border-bottom: 1px solid #f0e6d2;">Total questions</td>
              <td style="padding: 10px 0; text-align: right; color: #4a1d2e; border-bottom: 1px solid #f0e6d2;">${total}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8a6a56; border-bottom: 1px solid #f0e6d2;">Result</td>
              <td style="padding: 10px 0; text-align: right; color: ${perfect ? "#2f8f5b" : "#c02048"}; font-weight: bold; border-bottom: 1px solid #f0e6d2;">${perfect ? "Perfect" : "Almost"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8a6a56;">When</td>
              <td style="padding: 10px 0; text-align: right; color: #4a1d2e;">${now} (IST)</td>
            </tr>
          </table>
          ${answers && answers.length > 0 ? `
            <h3 style="color: #4a1d2e; margin: 28px 0 12px; font-size: 16px;">Answers</h3>
            <ol style="padding-left: 20px; color: #4a1d2e; font-size: 14px; line-height: 1.8;">
              ${answers.map((a, i) => `<li>Q${i + 1}: option ${a + 1}</li>`).join("")}
            </ol>
          ` : ""}
          <p style="text-align: center; margin-top: 28px; color: #b3324a; font-style: italic; font-size: 14px;">
            Made with love, just for you.
          </p>
        </div>
      </div>
    `;

    let emailSent = false;
    let emailError: string | null = null;

    if (resendApiKey && recipientEmail) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Birthday Quiz <onboarding@resend.dev>",
            to: [recipientEmail],
            subject,
            html,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          emailError = `Resend ${res.status}: ${errText}`;
          console.error(emailError);
        } else {
          emailSent = true;
        }
      } catch (e) {
        emailError = e instanceof Error ? e.message : String(e);
        console.error("Email send failed:", emailError);
      }
    } else {
      emailError = "RESEND_API_KEY or QUIZ_NOTIFY_EMAIL not configured";
      console.warn(emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        saved: !dbError,
        emailSent,
        emailError,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
