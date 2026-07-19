const apiURL: string = process.env.API_URL || "";

export async function GET() {
  try {
    const res = await fetch(apiURL);
    const data = await res.json();

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return Response.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
