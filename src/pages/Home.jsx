import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { MdClear } from "react-icons/md";
import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react";

export default function Home() {
    const navigate = useNavigate();
    const [stories, getStories] = useState();
    const [stories2, getStories2] = useState();
    const [searchquery, setSearchqury] = useState("");
    const [loading, setLoading] = useState(false);
    const [refresh, setrefresh] = useState(false);
    const [afterclear, setafterclear] = useState(false);
    const StoryblokClient = require("storyblok-js-client");
    const Storyblok = new StoryblokClient({
        oauthToken: `${process.env.REACT_APP_STORYBLOK_AUTH_TOKEN}`,
    });

    const FetchData = async () => {
        setLoading(true);
        storyblokInit({
            accessToken: `${process.env.REACT_APP_STORYBLOK_ACCESS_TOKEN}`,
            use: [apiPlugin],
        });

        const storyblokApi = getStoryblokApi();
        const { data } = await storyblokApi.get("cdn/stories", {
            version: "published",
        });
        getStories(data?.stories);
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            FetchData();
        }, 500);
        return () => clearTimeout(timer);
    }, [afterclear]);

    const handleNavigate = () => {
        navigate("/");
    };

    const HandleEdit = (data) => {
        navigate("/editpage", {
            state: data,
        });
    };

    const handleDelete = (data) => {
        setLoading(true);
        Storyblok.delete(
            `spaces/${process.env.REACT_APP_STORYBLOCK_SPACE_ID}/stories/${data}`
        )
            .then((response) => {
                setLoading(false);
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSearchForm = (e) => {
        e.preventDefault();
        getStories(
            stories?.filter((x) =>
                x?.content?.first_name?.includes(searchquery.toLocaleLowerCase())
            )
        );
        getStories2(
            stories?.filter((x) =>
                x?.content?.first_name?.includes(searchquery.toLocaleLowerCase())
            )
        );
        setrefresh(!refresh);
    };

    const handleClearSearch = (e) => {
        getStories(stories2);
        setSearchqury("");
        setafterclear(true);
    };

    return (
        <div className="main_body">
            {loading ? (
                <div
                    style={{
                        textAlign: "center",
                    }}
                >
                    Loading...
                </div>
            ) : (
                <div className="main_">
                    <div className="contactandform">
                        <div>
                            <h1 className="title_text" onClick={() => handleNavigate()}>
                                All Contacts
                            </h1>
                        </div>

                        <div>
                            <h1
                                className="title_text"
                                onClick={() => navigate("/addcontact")}
                            >
                                Add Contact
                            </h1>
                        </div>
                    </div>

                    <div className="search_input_btn">
                        <form onSubmit={handleSearchForm}>
                            <div className="search_input">
                                <input
                                    required
                                    className="searchinput"
                                    value={searchquery}
                                    onChange={(e) => setSearchqury(e.target.value)}
                                    type="text"
                                    placeholder="Search for contact..."
                                />

                                <input className="btn_" type="submit" value="Search" />

                                <MdClear
                                    onClick={() => handleClearSearch()}
                                    className="mdclear"
                                />
                            </div>
                        </form>
                    </div>

                    <div className="main_conatiner">
                        {stories?.map((x, i) => {
                            return (
                                <div key={i} className="img_others">
                                    {
                                        <>
                                            <div className="imganddetails">
                                                <div className="img_body">
                                                    {" "}
                                                    <img
                                                        src={x?.content?.imagetwo}
                                                        alt={x?.content?.first_name}
                                                    />{" "}
                                                </div>
                                                <div className="other_contents">
                                                    <div>
                                                        <div>
                                                            <p className="firstname">
                                                                {x?.content?.first_name?.replace(
                                                                    /^./,
                                                                    x?.content?.first_name
                                                                        ?.charAt(0)
                                                                        .toUpperCase()
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="phone_num">
                                                                {x?.content?.phone_number}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="edit_delete_container">
                                                <div onClick={() => HandleEdit(x)}>
                                                    <p className="firstname">
                                                        {" "}
                                                        <FiEdit />
                                                    </p>
                                                </div>

                                                <div
                                                    onClick={() => {
                                                        return handleDelete(x?.id);
                                                    }}
                                                >
                                                    <p className="phone_num">
                                                        {" "}
                                                        <MdDeleteOutline />
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
