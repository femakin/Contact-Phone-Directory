import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Contact.css";
import StoryblokClient from "storyblok-js-client";

function EditPage() {
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


    const parameters = useLocation()


    const handleSubmit = (e) => {
        setloading(true)
        const file = fileInput.current.files[0];
        e.preventDefault();
        // console.log(
        //     firstName,
        //     "firstname",
        //     lastName,
        //     phoneNumber,
        //     location,
        //     email,
        //     imageUrl,
        //     imageUrl,
        //     file
        // );

        const fileName = generateRandom(4);
        var formdata = new FormData();
        formdata.append("file", file, "[PROXY]");
        formdata.append("upload_preset", "ml_default");
        formdata.append("public_id", `${fileName}`);
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

                console.log(result, "resultttt");

                if (result?.secure_url !== " ") {
                    setloading(false)
                    const spaceId = "187484";
                    const accessToken = "rGrunKNU32hha77QQKkdfgtt";

                    // Create a new instance of the StoryblokClient
                    const client = new StoryblokClient({ spaceId, accessToken });

                    // Define the data for the new story
                    const data = {
                        story: {
                            name: `${firstName + lastName}`,
                            slug: `${firstName + lastName}`,
                            content: {
                                imagetwo: result?.secure_url,
                                location: location,
                                component: "ContactForm",
                                image_one: result?.secure_url,
                                last_name: lastName,
                                first_name: fileName,
                                phone_number: phoneNumber,
                                email_address: email,
                            },
                        },
                    };


                    var myHeaders = new Headers();
                    myHeaders.append("Authorization", "Xh2EhgBpDto1tHct8qGEDAtt-139200-CCGF4UwNMnQ9x3pDk7NJ");
                    myHeaders.append("Accept", "application/json");
                    myHeaders.append("Content-Type", "application/json");

                    var raw = JSON.stringify({
                        "story": {
                            "name": fileName + lastName,
                            "slug": fileName + lastName,
                            "content": {
                                "imagetwo": result?.secure_url,
                                "location": location,
                                "component": "ContactForm",
                                "image_one": result?.secure_url,
                                "last_name": lastName.toLowerCase(),
                                "first_name": firstName.toLowerCase(),
                                "phone_number": phoneNumber,
                                "email_address": email,
                                "body": []
                            }
                        },
                        "publish": 1
                    });

                    var requestOptions = {
                        method: 'PUT',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };

                    fetch(`https://mapi.storyblok.com/v1/spaces/187484/stories/${parameters?.state?.id}`, requestOptions)
                        .then(response => response.json())
                        .then((result) => {
                            console.log(result, 'resultttt')
                            navigate('/')
                        })
                        .catch(error => console.log('error', error));


                }
            })
            .catch((err) => {
                console.log(err);
            });
    };






    useEffect(() => {

        console.log(parameters, 'parameters')

        if (parameters?.state?.content?.first_name !== "") {
            setFirstName(parameters?.state?.content?.first_name)
        }
        if (parameters?.state?.content?.last_name !== "") {
            setLastName(parameters?.state?.content?.last_name)
        }
        if (parameters?.state?.content?.email_address !== "") {
            setEmail(parameters?.state?.content?.email_address)
        } if (parameters?.state?.content?.phone_number !== "") {
            setPhoneNumber(parameters?.state?.content?.phone_number)
        }
        if (parameters?.state?.content?.location !== "") {
            setLocation(parameters?.state?.content?.location)
        }



    }, []);


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

                            <div className="form_first_name_label">
                                <label htmlFor="img">Upload Image</label>
                                {/* <input type="file" id="img" name="img" accept="image/*" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /> */}
                                <input type="file" required id="img" accept="image/*" ref={fileInput} />
                            </div>

                            <div className="submit_container">
                                <div className="submit_btn">
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

export default EditPage;
