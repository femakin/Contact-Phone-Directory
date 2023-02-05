import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { MdClear } from "react-icons/md";

export default function Home() {
    const navigate = useNavigate();
    const [stories, getStories] = useState();
    const [stories2, getStories2] = useState();
    const [searchquery, setSearchqury] = useState("");
    const [loading, setLoading] = useState(false);
    const [deletecontact] = useState(false);
    const [refresh, setrefresh] = useState(false);
    const [afterclear, setafterclear] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            FetchData();
        }, 100);
        return () => clearTimeout(timer);
    }, [deletecontact, afterclear]);

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
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `${process.env.REACT_APP_AUTH_TOKEN}`);

        var requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(
            `https://api.storyblok.com/v1/spaces/187484/stories/${data}`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                setLoading(false);
                window.location.reload();
            })
            .catch((error) => console.log("error", error));
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

    const FetchData = () => {
        setLoading(true);

        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        fetch(
            `https://api.storyblok.com/v2/cdn/stories/?token=${process.env.REACT_APP_ACCESS_TOKEN}`,
            requestOptions
        )
            .then((response) => response.json())
            .then((response) => {
                getStories(response?.stories);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
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
