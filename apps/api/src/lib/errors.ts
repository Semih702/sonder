import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "./logger";

export type ErrorCode =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limited"
  | "maintenance"
  | "posting_disabled"
  | "validation_error"
  | "internal_error";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export function jsonOk<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function jsonCreated<T>(data: T): NextResponse<T> {
  return jsonOk(data, 201);
}

export async function handleRoute(handler: () => Promise<Response>): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    return errorResponse(error);
  }
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "The request was invalid.",
          details: error.flatten()
        }
      },
      { status: 400 },
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      },
      { status: error.status },
    );
  }

  logger.error("Unhandled API error", {
    error: error instanceof Error ? error.message : String(error)
  });

  return NextResponse.json(
    {
      error: {
        code: "internal_error",
        message: "Something went wrong."
      }
    },
    { status: 500 },
  );
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "bad_request", "Expected a JSON request body.");
  }
}

