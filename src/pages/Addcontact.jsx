import React, { useState, } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Contact.css";

function Addcontact() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState();
    const [location, setLocation] = useState("");
    const [email, setEmail] = useState("");
    const [imageUrl, setImageUrl] = useState();
    const [loading, setloading] = useState(false);



    const UploadImage = () => {
        window?.cloudinary
            .openUploadWidget(
                { cloud_name: "femakin", upload_preset: "ml_default" },
                (error, result) => {
                    if (!error && result && result.event === "success") {
                        setImageUrl(result);
                    }
                }
            )
            .open();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (imageUrl?.info?.id === " " || imageUrl === undefined) {
            alert("Please upload your image");
        } else {
            setloading(true);
            e.preventDefault();

            var myHeaders = new Headers();
            myHeaders.append("Authorization", `${process.env.REACT_APP_AUTH_TOKEN}`);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                story: {
                    name: imageUrl?.info?.id,
                    slug: imageUrl?.info?.id,
                    content: {
                        imagetwo: imageUrl?.info?.secure_url,
                        location: location,
                        component: "ContactForm",
                        image_one: imageUrl,
                        last_name: lastName?.toLowerCase(),
                        first_name: firstName?.toLowerCase(),
                        phone_number: phoneNumber,
                        email_address: email,
                        body: [],
                    },
                },
                publish: 1,
            });

            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            fetch(
                `https://api.storyblok.com/v1/spaces/187484/stories/`,
                requestOptions
            )
                .then((res) => {
                    res.json();
                })
                .then((res) => {
                    navigate("/");
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

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
                        <button onClick={UploadImage} className="img-file">
                            Choose file
                        </button>
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
                                    <input
                                        className="btn_"
                                        type="submit"
                                        value={`${loading ? "loading..." : "Submit"}`}
                                    />
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
