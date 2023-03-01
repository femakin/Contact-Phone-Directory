import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StoryblokClient from "storyblok-js-client";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { MdClear } from "react-icons/md";
import Swal from "sweetalert2";

export default function Home() {
    const navigate = useNavigate();

    const [stories, getStories] = useState();
    const [stories2, getStories2] = useState();
    const [searchquery, setSearchqury] = useState("");
    const [loading, setLoading] = useState(false);
    const [deletecontact, setDeleteContact] = useState(false);

    const HandleEdit = (data) => {
        navigate("/editpage", {
            state: data,
        });
    };



    const stageOne = (data) => {
        console.log(data, 'dataaaa')

        if (deletecontact) {
            // alert('Confirm you want to delete')
            Swal.fire({
                title: "Delete!",
                text: "Do you want to delete",
                icon: "error",
                confirmButtonText: "Cool",
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete(data)
                }
            })
        }
    }


    const handleDelete = (data) => {
        console.log(data, 'data')
        var myHeaders = new Headers();
        myHeaders.append(
            "Authorization",
            "Xh2EhgBpDto1tHct8qGEDAtt-139200-CCGF4UwNMnQ9x3pDk7NJ"
        );

        var requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(
            `https://mapi.storyblok.com/v1/spaces/${process.env.REACT_APP_STORYBLOCK_SPACE_ID}/stories/${data}`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                console.log(result, "resulttttttt");
                // window.location.reload();
            })
            .catch((error) => console.log("error", error));
    };

    // if (deletecontact) {
    //     // alert('Confirm you want to delete')
    //     Swal.fire({
    //         title: "Delete!",
    //         text: "Do you want to delete",
    //         icon: "error",
    //         confirmButtonText: "Cool",
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             handleDelete()
    //         }
    //     })
    // }

    const [refresh, setrefresh] = useState(false);

    const handleSearchForm = (e) => {
        e.preventDefault();
        console.log(searchquery, "searchquery");
        console.log(stories, "stories");
        console.log(
            stories?.filter((x) => x?.content?.first_name?.includes(searchquery)),
            "searchquery"
        );
        getStories(
            stories?.filter((x) =>
                x?.content?.first_name?.includes(searchquery.toLocaleLowerCase())
            )
        );
        // getStories2(stories)
        setrefresh(!refresh);
    };

    const handleClearSearch = (e) => {
        getStories(stories2);
        setSearchqury("");
    };


    const FetchData = () => {
        setLoading(true);

        const Storyblok = new StoryblokClient({
            accessToken: "rGrunKNU32hha77QQKkdfgtt",
            //   accessToken: 'Xh2EhgBpDto1tHct8qGEDAtt-139200-CCGF4UwNMnQ9x3pDk7NJ',
            cache: {
                clear: "auto",
                type: "memory",
            },
        });

        Storyblok.get("cdn/stories", {
            version: "published",
        })
            .then((response) => {
                console.log(response, "1");
                getStories(response?.data?.stories);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }



    useEffect(() => {
        setDeleteContact(false)
        FetchData()
    }, [deletecontact]);

    return (
        <div className="main_body">
            {
                <div className="main_">
                    <div className="contactandform">
                        <div>
                            <h1 className="title_text" onClick={() => navigate("/")}>
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
                                                            x?.content?.first_name?.charAt(0).toUpperCase()
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

                                        <div onClick={
                                            () => {
                                                return (
                                                    handleDelete(x?.id)
                                                    //  console.log
                                                    // setDeleteContact(true),
                                                    // stageOne(x.id)



                                                )
                                            }
                                        }>
                                            <p className="phone_num">
                                                {" "}
                                                <MdDeleteOutline />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            }
        </div>
    );
}
