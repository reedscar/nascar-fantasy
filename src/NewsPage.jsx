import NavBar from "./NavBar";
import { useEffect, useState } from "react";
import NascarFeed from "./NascarFeed";
import './css_styles/newsPage.css'

function NewsPage({ user, setUser }){

    return(
        <div className="news-page">
            <NavBar user={user} setUser={setUser}></NavBar>
            <NascarFeed></NascarFeed>
        </div>
    );
}
export default NewsPage