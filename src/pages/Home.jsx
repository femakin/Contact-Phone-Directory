import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StoryblokClient from "storyblok-js-client";
import { FiEdit } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md'
import { MdClear } from 'react-icons/md'

export default function Home() {
    const Data = [
        {
            first_name: "Femi Tosin",
            last_name: "TosinLove",
            phone_number: "+2347037495325",
            email_address: "akinfemi46@gmail.com",
            location: "Nigeria",
            img: "https://a.storyblok.com/f/187484/350x782/2ac6c8ea01/whatsapp-image-2022-11-07-at-6-21-20-am.jpeg",
        },
        {
            first_name: "Femi Tosin",
            phone_number: "+2347037495325",
            email_address: "akinfemi46@gmail.com",
            location: "Nigeria",
            img: "https://a.storyblok.com/f/187484/350x782/2ac6c8ea01/whatsapp-image-2022-11-07-at-6-21-20-am.jpeg",
        },



    ];

    const navigate = useNavigate();

    const [stories, getStories] = useState();
    const [stories2, getStories2] = useState();
    const [searchquery, setSearchqury] = useState("")


    const HandleEdit = (data) => {
        navigate('/editpage', {
            state: data
        })

    }



    const handleDelete = (data) => {


        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Xh2EhgBpDto1tHct8qGEDAtt-139200-CCGF4UwNMnQ9x3pDk7NJ");

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://mapi.storyblok.com/v1/spaces/187484/stories/${data}`, requestOptions)
            .then(response => response.text())
            .then((result) => {
                window.location.reload()
            })
            .catch(error => console.log('error', error));




    }

    const [refresh, setrefresh] = useState(false)

    const handleSearchForm = (e) => {
        e.preventDefault()
        console.log(searchquery, 'searchquery')
        console.log(stories, 'stories')
        console.log(stories?.filter(x => x?.content?.first_name?.includes(searchquery)), 'searchquery')
        getStories(stories?.filter(x => x?.content?.first_name?.includes(searchquery)))
        // getStories2(stories)
        setrefresh(!refresh)
    }


    const handleClearSearch = (e) => {
        getStories(stories2)
        setSearchqury('')
    }


    useEffect(() => {
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
                console.log(response, '1');
                getStories(response?.data?.stories)
                getStories2(response?.data?.stories)
            })
            .catch((error) => {
                console.log(error);
            });








        // // use the universal js client to perform the request
        // Storyblok.get('cdn/stories/', {
        //     "starts_with": "stories/",
        //     "filter_query": {
        //         "content": {
        //             "in": "Tosin"
        //         }
        //     }
        // })
        //     .then(response => {
        //         console.log(response, 2)
        //     }).catch(error => {
        //         console.log(error)
        //     })


        Storyblok.get('cdn/stories/', {
            "starts_with": "posts/",
            "filter_query": {
                "content": {
                    "is": "Tosin"
                }
            }
        })
            .then(response => {
                console.log(response, 2)
            }).catch(error => {
                console.log(error)
            })



    }, []);

    return (
        <div className="main_body">




            <div className="main_"  >





                <div className="contactandform">
                    <div>
                        <h1 className="title_text" onClick={() => navigate("/")}>All Contacts</h1>
                    </div>

                    <div>
                        <h1 className="title_text" onClick={() => navigate("/addcontact")}>
                            Add Contact
                        </h1>
                    </div>
                </div>



                <div className="search_input_btn">

                    <form onSubmit={handleSearchForm}  >
                        <div className="search_input">
                            <input required className="searchinput" value={searchquery} onChange={(e) => setSearchqury(e.target.value)} type="text" placeholder="Search for contact..." />
                            {/* <button>Search</button> */}
                            <input className="btn_" type="submit" value="Search" />
                            {/* <input className="btn_" type="submit" value="Search" /> */}
                            <MdClear onClick={() => handleClearSearch()} className="mdclear" />
                        </div>
                    </form>

                </div>


                <div className="main_conatiner">

                    {
                        stories?.map((x, i) => {
                            return (
                                <div key={i} className="img_others">

                                    <div className="imganddetails"  >
                                        <div className="img_body">
                                            {" "}
                                            <img src={x?.content?.imagetwo} alt={x?.content?.first_name} />{" "}
                                        </div>
                                        <div className="other_contents">
                                            <div>
                                                <div>
                                                    <p className="firstname">{x?.content?.first_name}</p>
                                                </div>
                                                <div>
                                                    <p className="phone_num">{x?.content?.phone_number}</p>
                                                </div>
                                            </div>




                                        </div>

                                    </div>

                                    <div className="edit_delete_container"  >
                                        <div onClick={() => HandleEdit(x)}  >
                                            <p className="firstname">  <FiEdit /></p>

                                        </div>
                                        <div onClick={() => handleDelete(x?.id)}>
                                            <p className="phone_num">   <MdDeleteOutline /></p>

                                        </div>
                                    </div>
                                </div>
                            );
                        })

                    }

                </div>
            </div>
        </div>
    );
}
