import React, { useEffect, useState } from "react";
import './css_styles/newsPage.css'

function NascarFeed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("https://www.reddit.com/r/NASCAR/.json")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch subreddit");
                    return res.json();
                }
            )
            .then((data) => {
                const fetchedPosts = data.data.children.map((child) => child.data);
                setPosts(fetchedPosts);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading NASCAR posts...</p>;
    } 
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <div className="newsTitle"><h1>r/NASCAR Reddit News</h1></div>
            <div className="news-feed">
                {posts
                .filter((post) => post.post_hint === "link") // filter the news articles
                .map((post) => {
                    const postDate = new Date(post.created_utc * 1000);
                    const formattedTime = postDate.toLocaleString(); 

                    return (
                    <div key={post.id} className="news-card">
                        <p>{post.title}</p>
                        <div style={{ fontSize: "0.85rem", color: "darkgreen", marginTop: "4px" }}>
                        Posted on: {formattedTime}
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}

export default NascarFeed;

