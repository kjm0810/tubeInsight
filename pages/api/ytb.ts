import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { searchKeyword, type = "video" } = req.query;

        const API_KEY = process.env.YOUTUBE_API_KEY;

        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=${type}&maxResults=50&q=${encodeURIComponent(searchKeyword as string)}&regionCode=KR&key=${API_KEY}`;

        console.log("YOUTUBE URL:", url);

        const ytRes = await fetch(url, {
            next: { revalidate: 36000 }
        });
        const data = await ytRes.json();

        console.log("YOUTUBE RESPONSE:", data);

        return res.status(200).json(data);
    } catch (error) {
        console.error("YOUTUBE ERROR:", error);
        return res.status(500).json({ error: "youtube request failed" });
    }
}