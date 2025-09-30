import { NavBar } from "./NavBar";
import cls from '../CSSfiles/SignUp.module.css'
import React, { useEffect, useRef, useState } from "react";
import { useNavigate} from "react-router-dom";
let localConnection=require("./localhostConfig");

const SignUp=()=>{
    let navigate=useNavigate();
    let [userName,setName]=useState("");
    let [password,setPassword]=useState("");
    let [email,setEmail]=useState("");
    let [input_status,setInputStatus]=useState(false);
    let [registervalue,setRegisterStatus]=useState(false);
    let [registrystatus,setregistryStatus]=useState(false);
    let [userNotification,setNotification]=useState(true);
    let [result,setResult]=useState({});
    let [userProfileresult,setuserResult]=useState({});
    let [branch,setBranch]=useState("");
    let [yearofStudy,setStudyyear]=useState("");
    let profilePicture=useRef("");
    let [file,setFile]=useState(null);

    let [profilePic,setPic]=useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");
    let signUp = async () => {
    setRegisterStatus(true);

    // Check empty fields
    if (!userName || !password || !email || !branch || !yearofStudy) {
        setInputStatus(true);
        return;
    }

    // Check file
    if (!file) {
        alert("Please upload a profile picture before signing up.");
        return;
    }

    let ext = file.name.split('.').pop().toLowerCase();
    if (!["jpg","jpeg","png","svg"].includes(ext)) {
        alert("Please select a valid format of image");
        return;
    }

    try {
        let formData = new FormData();
        formData.append("file", file);

        // signup API call
        let res = await fetch(`${localConnection}/signup`, {
            method: "POST",
            body: JSON.stringify({ username: userName, password, email, branch, yearofstudy: yearofStudy }),
            headers: { "Content-Type": "application/json" }
        });
        let resultData = await res.json();

        // upload profile picture
        let profileRes = await fetch(`${localConnection}/uploadProfilePic/${userName}/${email}`, {
            method: "POST",
            body: formData
        });
        let profileData = await profileRes.json();

        localStorage.setItem("stduser", JSON.stringify({
            name: resultData.username,
            email: resultData.email,
            branch: resultData.branch,
            year: resultData.yearofstudy,
            fileName: profileData.UserfileName
        }));
        localStorage.setItem("forgotUser", JSON.stringify({ name: resultData.username, email: resultData.email }));

        setResult(resultData);
        setregistryStatus(true);

        setTimeout(() => {
            setEmail("");
            setName("");
            setPassword("");
            setRegisterStatus(false);
            navigate("/");
        }, 2000);
    } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
    }
};
    useEffect(()=>{
    },[result])

   useEffect(()=>{
    setNotification(true);
   },[])   
   let setPicture=()=>{
    profilePicture.current.click();
   }
    return(
        <div>
            {userNotification?<><div className={cls.launchDescription}></div>
            <div className={cls.whiteDivs}>
                <span onClick={()=>{setNotification(false)}} className={cls.cross}>&#x2716;</span>
                <div>Dear user,</div>
                <div>Use your personal Gmail account so that you are notified earlier about our services for smooth experiences.Any further recommendations are welcomed.(Currently this website is being improved and new features are yet to be added .Sorry for all inconvenience if any).</div>
            </div></>:<></>}
           <NavBar></NavBar>
           <div className={cls.signUpContainerMainDiv}>
             <div className={cls.userDetailsInfo}>

             <div className={cls.userProfilePic}>
                   <input onChange={(e)=>{setFile(e.target.files[0])}}  type="file" className={cls.filePic} ref={profilePicture}/>
                    <div className={cls.profilepicContsiner}><img draggable="false" unselectable="on"  className={cls.imageProfile} src={profilePic} alt="profilepic"/></div>
                    <div className={cls.btnUpload}><button onClick={setPicture} className={cls.btnuploader}>Upload</button></div>


                </div>

                <div className={cls.userContainer}>
                    <div className={cls.label}>User Name</div>
                    <div><input className={cls.userinputs} value={userName} onChange={(e)=>{setName(e.target.value)}} type="text" placeholder="Enter User Name"/></div>
                    {input_status && userName==="" ? <div className={cls.errMess}>User Name Missing</div>:<></>}
                </div>

                <div className={`${cls.userContainer} ${cls.newInput}`}>
                    <div className={cls.label}>Pasword</div>
                    <div><input className={cls.userinputs} value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Enter Password"/></div>
                    {input_status && password==="" ? <div className={cls.errMess}>Password Empty</div>:<></>}

                </div>

                <div className={`${cls.userContainer} ${cls.newInput}`}>
                    <div className={cls.label}>Email </div>
                    
                    <div><input className={cls.userinputs} value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Enter Email"/></div>
                    {input_status && email==="" ? <div className={cls.errMess}>Email empty</div>:<></>}

                </div>

                <div className={`${cls.userContainer} ${cls.newInput}`}>
                    <div className={cls.label}>Branch </div>
                    
                    <div><input className={cls.userinputs} value={branch} onChange={(e)=>{setBranch(e.target.value)}} type="text" placeholder="Enter Your Current branch  (e.g MnC)"/></div>
                    {input_status && branch==="" ? <div className={cls.errMess}>Empty field</div>:<></>}

                </div>

                <div className={`${cls.userContainer} ${cls.newInput}`}>
                    <div className={cls.label}>Year </div>
                    
                    <div><input className={cls.userinputs} value={yearofStudy} onChange={(e)=>{setStudyyear(e.target.value)}} type="number" placeholder="Enter Your Current Year of Study"/></div>
                    {input_status && yearofStudy===null ? <div className={cls.errMess}>Empty field</div>:<></>}

                </div>

                {registervalue?<div className={cls.CheckingData}>{registrystatus?"Registered":"Not registered till now"}</div>:<></>}
                <div className={cls.btnLogin}><button onClick={signUp}>Sign Up</button></div>
             </div>
           </div>
        </div>
    )
}
export{SignUp}
