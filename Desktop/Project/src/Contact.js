import React, { useState } from "react";
import "./Contact.css";
import { BiCloudUpload } from "react-icons/bi";

function Contact() {
  const [userRegister, setUserRegister] = useState({
    username: "",
    email: "",
    number: "",
    location: "",
    exp: "",
    ctc: "",
    expect: "",
    file: null,
  });

  const [record, setRecord] = useState([]);
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value);

    setUserRegister({ ...userRegister, [name]: value });
    console.log(userRegister)
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecord = { ...userRegister, id: new Date().getTime().toString() };
    setRecord([...record, newRecord]);
    console.log(record);
    setUserRegister({
      username: "",
      email: "",
      number: "",
      location: "",
      exp: "",
      ctc: "",
      expect: "",
      file: null
    });
  };

  const addFile = () => {
    document.getElementById("addFile").click();
  };

  const changeHandler = (event) => {
    // setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0]);
    setUserRegister({ ...userRegister, file: event.target.files[0] });

    console.log(userRegister);
    // setIsSelected(true);
  };
  return (
    <>
      <div className="container">
        <div className="top">
          <div className="top_left">
            <img src = "https://www.producthood.com/wp-content/uploads/vendors/BrainyDx.png" alt="logo"></img>
            <h2>
              Brainy<span>DX</span>{" "}
            </h2>
          </div>
          <div className="top_right">
            <button>Mail Us</button>
          </div>
        </div>

        <div className="header">
          <button className="btn">GO BACK</button>
          <h1>Complete your Application</h1>
        </div>

        <div className="form_container">
          <div className="formInput">
            <form className="inputs" action="" onSubmit={handleSubmit}>
              <div className="form-input">
                <div className="Fields first">
                  <div class="inputField">
                    <label>Name </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={userRegister.username}
                      onChange={handleInput}
                      name="username"
                      id="username"
                    />
                  </div>

                  <div class="inputField">
                    <label>Email </label>
                    <input
                      type="email"
                      placeholder="abc@xyz.com"
                      value={userRegister.email}
                      onChange={handleInput}
                      name="email"
                      id="email"
                    />
                  </div>

                  <div class="inputField">
                    <label>Phone</label>
                    <input
                      type="number"
                      placeholder="10 digit number"
                      value={userRegister.number}
                      onChange={handleInput}
                      name="number"
                      id="number"
                    />
                  </div>
                </div>

                <div className="Fields">
                  <div class="inputField">
                    <label> Current Location </label>
                    <input
                      type="text"
                      placeholder="eg. Delhi"
                      value={userRegister.location}
                      onChange={handleInput}
                      name="location"
                      id="location"
                    />
                  </div>

                  <div class="inputField">
                    <label> Years of experience </label>
                    <input
                      type="text"
                      placeholder="eg. 2+"
                      value={userRegister.exp}
                      onChange={handleInput}
                      name="exp"
                      id="exp"
                    />
                  </div>

                  <div class="inputField">
                    <label> Notice Period</label>
                    <input
                      type="text"
                      placeholder="eg. 15 days"
                      value={userRegister.period}
                      onChange={handleInput}
                      name="period"
                      id="period"
                    />
                  </div>
                </div>

                <div className="Fields">
                  <div class="inputField">
                    <label> Current CTC </label>
                    <input
                      type="text"
                      placeholder="per year"
                      value={userRegister.ctc}
                      onChange={handleInput}
                      name="ctc"
                      id="ctc"
                    />
                  </div>

                  <div class="inputField">
                    <label> Expected CTC</label>
                    <input
                      type="text"
                      placeholder="eg. 2+"
                      value={userRegister.expect}
                      onChange={handleInput}
                      name="expect"
                      id="expect"
                    />
                  </div>

                  <div class="inputField last">
                    <label> Expected CTC</label>
                    <input type="text" placeholder="eg. 2+" />
                  </div>
                </div>
              </div>

              <div className="form_footer">
                <h5>Upload Your Resume</h5>

                <div className="drag_box" id="upload" onClick={addFile}>
                  <input type="file" id="addFile" onChange={changeHandler} />
                  <span>
                    <BiCloudUpload />
                  </span>

                  <p>Click to upload or drag and drop the file</p>
                </div>
                

                <button type="submit">APPLY NOW</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="output">
        {record.map((curElem) => {
          return (
            <div className="showData">
              <p>{curElem.username}</p>
              <p>{curElem.email}</p>
              <p>{curElem.number}</p>
              <p>{curElem.location}</p>
              <p>{curElem.period}</p>
              <p>{curElem.ctc}</p>
              <p>{curElem.exp}</p>
              {userRegister.file?.name && <p>{userRegister.file.name}</p>}
              
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Contact;
