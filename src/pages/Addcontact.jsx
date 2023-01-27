import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Contact.css";
import StoryblokClient from "storyblok-js-client";

function Addcontact() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState();
    const [location, setLocation] = useState("");
    const [email, setEmail] = useState("");
    const [imageUrl, setImageUrl] = useState();
    const [loading, setloading] = useState(false);

    const fileInput = useRef(null);

    const generateRandom = (length) => {
        var result = "";
        var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
    const Storyblok = new StoryblokClient({
        accessToken: "rGrunKNU32hha77QQKkdfgtt",
        cache: {
            clear: "auto",
            type: "memory",
        },
    });


    const UploadImage = () => {
        console.log('call image')
        window.cloudinary
            .openUploadWidget(
                { cloud_name: "femakin", upload_preset: "ml_default" },
                (error, result) => {
                    if (!error && result && result.event === "success") {
                        console.log(result)
                        setImageUrl(result);
                    }
                }
            )
            .open();
    };





    const handleSubmit = (e) => {
        e.preventDefault();


        if (imageUrl?.info?.id === " " || imageUrl === undefined) {
            alert('Please upload your image')
        } else {
            console.log(imageUrl, 'imageUrl')
            setloading(true)
            // const file = fileInput.current.files[0];
            e.preventDefault();

            // const fileName = generateRandom(4);
            var formdata = new FormData();
            // formdata.append("file", file, "[PROXY]");
            // formdata.append("upload_preset", "ml_default");
            // formdata.append("public_id", `${fileName}`);
            formdata.append("api_key", `${process.env.REACT_APP_CLOUDINARY_API_KEY}`);

            var requestOptions = {
                method: "POST",
                body: formdata,
                redirect: "follow",
            };


            fetch("https://api.cloudinary.com/v1_1/femakin/auto/upload", requestOptions)
                .then(async (response) => {
                    return await response.json();
                })
                .then(async (result) => {
                    // const UserDetails = JSON.parse(localStorage?.getItem('user_id'))

                    // console.log(result, "resultttt");

                    if (result?.secure_url !== " ") {
                        setloading(false)
                        const spaceId = "187484";
                        const accessToken = "rGrunKNU32hha77QQKkdfgtt";

                        // Create a new instance of the StoryblokClient
                        const client = new StoryblokClient({ spaceId, accessToken });

                        // Define the data for the new story
                        // const data = {
                        //     story: {
                        //         name: "My New Story",
                        //         slug: "my-new-story",
                        //         content: {
                        //             imagetwo: "",
                        //             location: location,
                        //             component: "ContactForm",
                        //             image_one: "",
                        //             last_name: lastName,
                        //             first_name: fileName,
                        //             phone_number: phoneNumber,
                        //             email_address: email,
                        //         },
                        //     },
                        // };


                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", process.env.REACT_APP_AUTH_TOKEN);
                        myHeaders.append("Accept", "application/json");
                        myHeaders.append("Content-Type", "application/json");

                        var raw = JSON.stringify({
                            "story": {
                                "name": imageUrl?.info?.id,
                                "slug": imageUrl?.info?.id,
                                "content": {
                                    "imagetwo": result?.secure_url,
                                    "location": location,
                                    "component": "ContactForm",
                                    "image_one": imageUrl,
                                    "last_name": lastName?.toLowerCase(),
                                    "first_name": firstName?.toLowerCase(),
                                    "phone_number": phoneNumber,
                                    "email_address": email,
                                    "body": []
                                }
                            },
                            "publish": 1
                        });

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };

                        fetch(`https://api.storyblok.com/v1/spaces/187484/stories/`, requestOptions)
                            .then((res) => {
                                res.json()
                                // console.log(res.json(), 'resss')
                            }).then((res) => {
                                console.log(res, 'res')
                                navigate('/')
                            }).catch((err) => {
                                console.log(err)
                            });


                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }



        // if (imageUrl === "") {
        //     alert('Please upload your image')
        // } else {
        // setloading(true)
        // // const file = fileInput.current.files[0];
        // e.preventDefault();

        // // const fileName = generateRandom(4);
        // var formdata = new FormData();
        // // formdata.append("file", file, "[PROXY]");
        // // formdata.append("upload_preset", "ml_default");
        // // formdata.append("public_id", `${fileName}`);
        // formdata.append("api_key", `${process.env.REACT_APP_CLOUDINARY_API_KEY}`);

        // var requestOptions = {
        //     method: "POST",
        //     body: formdata,
        //     redirect: "follow",
        // };


        // fetch("https://api.cloudinary.com/v1_1/femakin/auto/upload", requestOptions)
        //     .then(async (response) => {
        //         return await response.json();
        //     })
        //     .then(async (result) => {
        //         // const UserDetails = JSON.parse(localStorage?.getItem('user_id'))

        //         // console.log(result, "resultttt");

        //         if (result?.secure_url !== " ") {
        //             setloading(false)
        //             const spaceId = "187484";
        //             const accessToken = "rGrunKNU32hha77QQKkdfgtt";

        //             // Create a new instance of the StoryblokClient
        //             const client = new StoryblokClient({ spaceId, accessToken });

        //             // Define the data for the new story
        //             // const data = {
        //             //     story: {
        //             //         name: "My New Story",
        //             //         slug: "my-new-story",
        //             //         content: {
        //             //             imagetwo: "",
        //             //             location: location,
        //             //             component: "ContactForm",
        //             //             image_one: "",
        //             //             last_name: lastName,
        //             //             first_name: fileName,
        //             //             phone_number: phoneNumber,
        //             //             email_address: email,
        //             //         },
        //             //     },
        //             // };


        //             var myHeaders = new Headers();
        //             myHeaders.append("Authorization", process.env.REACT_APP_AUTH_TOKEN);
        //             myHeaders.append("Accept", "application/json");
        //             myHeaders.append("Content-Type", "application/json");

        //             var raw = JSON.stringify({
        //                 "story": {
        //                     "name": fileName,
        //                     "slug": fileName,
        //                     "content": {
        //                         "imagetwo": result?.secure_url,
        //                         "location": location,
        //                         "component": "ContactForm",
        //                         "image_one": imageUrl,
        //                         "last_name": lastName.toLowerCase(),
        //                         "first_name": firstName.toLowerCase(),
        //                         "phone_number": phoneNumber,
        //                         "email_address": email,
        //                         "body": []
        //                     }
        //                 },
        //                 "publish": 1
        //             });

        //             var requestOptions = {
        //                 method: 'POST',
        //                 headers: myHeaders,
        //                 body: raw,
        //                 redirect: 'follow'
        //             };

        //             fetch(`https://api.storyblok.com/v1/spaces/187484/stories/`, requestOptions)
        //                 .then((res) => {
        //                     res.json()
        //                     // console.log(res.json(), 'resss')
        //                 }).then((res) => {
        //                     console.log(res, 'res')
        //                     navigate('/')
        //                 }).catch((err) => {
        //                     console.log(err)
        //                 });


        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
        // }
    };

    // useEffect(() => {
    //     console.log(process.env.REACT_APP_CLOUDINARY_API_KEY);
    // }, []);

    return (
        <div>
            <div className="form_conatianer">
                <div className="contactandform">
                    <div>
                        <h1 className="title_text" onClick={() => navigate("/")}>
                            All Contacts
                        </h1>
                    </div>

                    <div>
                        <h1 className="title_text" onClick={() => navigate("/addcontact")}>
                            Add Contact
                        </h1>
                    </div>
                </div>

                <div className="form_container">

                    <div className="form_first_name_label">
                        <label htmlFor="img">Upload Image</label>
                        {/* <input type="file" id="img" name="img" accept="image/*" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /> */}
                        {/* <input type="file" required id="img" accept="image/*" ref={fileInput} /> */}
                        <button onClick={UploadImage} className='img-file' >Choose file</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form_body">
                            <div className="form_first_name_label">
                                <label htmlFor="first_name">First Name</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div className="form_first_name_label">
                                <label htmlFor="last_name">Last Name</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            <div className="form_first_name_label">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form_first_name_label">
                                <label htmlFor="phone_number">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone_number"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>

                            <div className="form_first_name_label">
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    required
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>



                            <div className="submit_container">
                                <div className="submit_btn">
                                    {/* <input className="btn_" type="submit" value="Submit" /> */}
                                    <input className="btn_" type="submit" value={`${loading ? 'loading...' : 'Submit'}`} />
                                </div>
                            </div>
                        </div>
                    </form>


                </div>
            </div>
        </div>
    );
}

export default Addcontact;
