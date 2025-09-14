import { SIGHTENGINE_SECRET_ENV, SIGHTENGINE_USER_ENV } from "@/constant";
import { NextResponse } from "next/server";

// Using Sightengine API (popular choice for content moderation)
const SIGHTENGINE_USER = SIGHTENGINE_USER_ENV;
const SIGHTENGINE_SECRET = SIGHTENGINE_SECRET_ENV;

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    if (!SIGHTENGINE_USER || !SIGHTENGINE_SECRET) {
      return NextResponse.json(
        { error: "API credentials not configured" },
        { status: 500 }
      );
    }

    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type;

    console.log(`Processing ${mime} file: ${file.name} (${file.size} bytes)`);

    if (mime.startsWith("image/")) {
      const result = await moderateImage(buffer, file.name);

      console.log({ result });

      return NextResponse.json({
        type: "image",
        filename: file.name,
        size: file.size,
        ok: result.safe,
        confidence: result.confidence,
        reasons: result.reasons,
        details: result.details,
      });
    }

    if (mime.startsWith("video/")) {
      const result = await moderateVideo(buffer, file.name);

      console.log({ result });

      return NextResponse.json({
        type: "video",
        filename: file.name,
        size: file.size,
        ok: result.safe,
        confidence: result.confidence,
        reasons: result.reasons,
        details: result.details,
      });
    }

    return NextResponse.json(
      { error: "Unsupported file type. Only images and videos are supported." },
      { status: 400 }
    );
  } catch (err) {
    console.error("Media moderation failed:", err);
    return NextResponse.json(
      {
        error: "Failed to moderate content",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function moderateImage(buffer: Buffer, filename: string) {
  const formData = new FormData();
  formData.append("media", new Blob([new Uint8Array(buffer)]), filename);

  // Multiple models for comprehensive checking
  formData.append("models", "nudity-2.1,wad,offensive,gore-2.0");
  formData.append("api_user", SIGHTENGINE_USER!);
  formData.append("api_secret", SIGHTENGINE_SECRET!);

  const response = await fetch("https://api.sightengine.com/1.0/check.json", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Sightengine API error: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();

  if (result.status !== "success") {
    throw new Error(
      `API request failed: ${result.error?.message || "Unknown error"}`
    );
  }

  // Analyze results
  const nudity = result.nudity || {};
  const wad = result.weapon || {};
  const offensive = result.offensive || {};
  const gore = result.gore || {};

  const issues = [];
  let confidence = 0;

  // Check nudity (more strict thresholds)
  if (nudity.sexual_activity > 0.5 || nudity.sexual_display > 0.5) {
    issues.push("sexual_content");
    confidence = Math.max(
      confidence,
      Math.max(nudity.sexual_activity, nudity.sexual_display)
    );
  }

  if (nudity.erotica > 0.6) {
    issues.push("erotica");
    confidence = Math.max(confidence, nudity.erotica);
  }

  // Check weapons, alcohol, drugs
  if (wad.prob > 0.7) {
    issues.push("weapons_alcohol_drugs");
    confidence = Math.max(confidence, wad.prob);
  }

  // Check offensive content
  if (offensive.prob > 0.6) {
    issues.push("offensive_gesture");
    confidence = Math.max(confidence, offensive.prob);
  }

  // Check gore
  if (gore.prob > 0.5) {
    issues.push("graphic_violence");
    confidence = Math.max(confidence, gore.prob);
  }

  const safe = issues.length === 0;

  return {
    safe,
    confidence: Math.round(confidence * 100) / 100,
    reasons: issues,
    details: {
      nudity: {
        sexual_activity: nudity.sexual_activity || 0,
        sexual_display: nudity.sexual_display || 0,
        erotica: nudity.erotica || 0,
        suggestive: nudity.suggestive || 0,
        safe: nudity.safe || 0,
      },
      weapons_alcohol_drugs: wad.prob || 0,
      offensive: offensive.prob || 0,
      gore: gore.prob || 0,
    },
  };
}

async function moderateVideo(buffer: Buffer, filename: string) {
  const formData = new FormData();
  formData.append("media", new Blob([new Uint8Array(buffer)]), filename);
  formData.append("models", "nudity-2.1,wad,offensive,gore-2.0");
  formData.append("api_user", SIGHTENGINE_USER!);
  formData.append("api_secret", SIGHTENGINE_SECRET!);

  const response = await fetch(
    "https://api.sightengine.com/1.0/video/check.json",
    // "https://api.sightengine.com/1.0/video/moderate.json",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      `Sightengine API error: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();

  if (result.status !== "success") {
    throw new Error(
      `API request failed: ${result.error?.message || "Unknown error"}`
    );
  }

  // Process video frames results
  const frames = result.data?.frames || [];
  const summary = result.data?.summary || {};

  let unsafeFrames = 0;
  let maxConfidence = 0;
  const issues: any[] = [];

  frames.forEach((frame: any) => {
    const nudity = frame.nudity || {};
    const wad = frame.weapon || {};
    const offensive = frame.offensive || {};
    const gore = frame.gore || {};

    let frameUnsafe = false;

    if (
      nudity.sexual_activity > 0.5 ||
      nudity.sexual_display > 0.5 ||
      nudity.erotica > 0.6
    ) {
      frameUnsafe = true;
      maxConfidence = Math.max(
        maxConfidence,
        Math.max(
          nudity.sexual_activity || 0,
          nudity.sexual_display || 0,
          nudity.erotica || 0
        )
      );
      if (!issues.includes("sexual_content")) issues.push("sexual_content");
    }

    if (wad.prob > 0.7) {
      frameUnsafe = true;
      maxConfidence = Math.max(maxConfidence, wad.prob);
      if (!issues.includes("weapons_alcohol_drugs"))
        issues.push("weapons_alcohol_drugs");
    }

    if (offensive.prob > 0.6) {
      frameUnsafe = true;
      maxConfidence = Math.max(maxConfidence, offensive.prob);
      if (!issues.includes("offensive_gesture"))
        issues.push("offensive_gesture");
    }

    if (gore.prob > 0.5) {
      frameUnsafe = true;
      maxConfidence = Math.max(maxConfidence, gore.prob);
      if (!issues.includes("graphic_violence")) issues.push("graphic_violence");
    }

    if (frameUnsafe) unsafeFrames++;
  });

  const safe = unsafeFrames === 0;

  return {
    safe,
    confidence: Math.round(maxConfidence * 100) / 100,
    reasons: issues,
    details: {
      totalFrames: frames.length,
      unsafeFrames,
      duration: result.data?.duration || 0,
      summary: {
        nudity: summary.nudity || {},
        weapons_alcohol_drugs: summary.weapon?.prob || 0,
        offensive: summary.offensive?.prob || 0,
        gore: summary.gore?.prob || 0,
      },
    },
  };
}
