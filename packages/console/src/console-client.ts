import type {
  ConsoleCommandRequest,
  ConsoleCommandResult,
} from "@dotln/skeleton/dist/src/console-commands.js";

/** A transport client suitable for the text host or a browser shell whose
 * local host supplies the private connection token. It imports no Node API. */
export type ConsoleConnection = Readonly<{
  version: 1;
  host: "127.0.0.1";
  port: number;
  token: string;
}>;

function endpoint(connection: ConsoleConnection, path: string): string {
  if (
    connection.version !== 1 ||
    connection.host !== "127.0.0.1" ||
    !Number.isSafeInteger(connection.port) ||
    connection.port < 1 ||
    connection.port > 65535 ||
    !/^[a-f0-9]{64}$/u.test(connection.token)
  )
    throw new Error("invalid local console connection");
  return `http://127.0.0.1:${connection.port}${path}`;
}

/** A transport failure names its cause, the socket error's code and message,
 * so a reset or refused connection is told apart from a refusal the resident
 * answered. The token and the request never appear in the message. */
async function transport(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    const cause = (error as { cause?: { code?: unknown; message?: unknown } })
      .cause;
    const detail =
      cause && typeof cause === "object"
        ? `${typeof cause.code === "string" ? cause.code : "error"}: ${String(cause.message)}`
        : error instanceof Error
          ? error.message
          : String(error);
    throw new Error(`console request failed (${detail})`, { cause: error });
  }
}

function decodeResult(value: unknown): ConsoleCommandResult {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("invalid console command result");
  const result = value as Record<string, unknown>;
  if (
    result.version !== 1 ||
    typeof result.command !== "string" ||
    !Number.isSafeInteger(result.exitCode) ||
    typeof result.stdoutBase64 !== "string" ||
    typeof result.stderrBase64 !== "string"
  )
    throw new Error("invalid console command result");
  return result as ConsoleCommandResult;
}

/** Returns the terminal's result bytes. A caller, route or request refusal
 * arrives in the same terminal refusal shape with a non-2xx status. */
export async function invokeConsoleCommand(
  connection: ConsoleConnection,
  request: ConsoleCommandRequest,
  signal?: AbortSignal,
): Promise<ConsoleCommandResult> {
  const response = await transport(
    endpoint(connection, "/console-commands-v1/invoke"),
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${connection.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(request),
      ...(signal ? { signal } : {}),
    },
  );
  const result = decodeResult(await response.json());
  if (response.ok ? result.command !== request.command : result.exitCode === 0)
    throw new Error("invalid console command result");
  return response.ok ? result : { ...result, command: request.command };
}

export async function readConsoleContract(
  connection: ConsoleConnection,
  signal?: AbortSignal,
): Promise<unknown> {
  const response = await transport(
    endpoint(connection, "/console-commands-v1"),
    {
      headers: { authorization: `Bearer ${connection.token}` },
      ...(signal ? { signal } : {}),
    },
  );
  if (!response.ok)
    throw new Error(`console contract refused (${response.status})`);
  return response.json();
}
