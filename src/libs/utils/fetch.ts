import nodefetch from "node-fetch";

class RequestError extends Error {
  public status: number;
  public body?: any;
  constructor(message: string, status: number, body?: any) {
    super(message);
    this.status = status;
    this.body = body || null;
  }
}

const fetch = async (url: string, init: any) => {
  const response = await nodefetch(url, init);

  const { status, headers } = response;
  const body = status === 204 ? null : await response.json();

  // Response was not succesfull
  if (!response.ok) {
    const bodyMessage = body ? body.error || body.message : null;
    throw new RequestError(bodyMessage || "Unkown Error", status, body);
  }

  return { body, status, headers };
};

export { RequestError, fetch };
