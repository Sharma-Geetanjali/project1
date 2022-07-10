import React, { useState } from 'react'
import './Contact.css'
import DragandDrop from './DragandDrop';

function Contact() {

  const [userRegister, setUserRegister]= useState({
    username:"",
    email:"",
    number:"",
    location:"",
    exp:"",
    ctc:"",
    expect:""
   });
   

   const [record,setRecord]= useState([]);
   const handleInput= (e) =>{
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value);

    setUserRegister({...userRegister,[name] :value });


   }

   const handleSubmit=(e)=>{
   e.preventDefault();

   const newRecord = {...userRegister, id: new Date().getTime().toString()}
   setRecord([...record, newRecord]);
   console.log(record);
   setUserRegister({username:"",
   email:"",
   number:"",
   location:"",
   exp:"",
   ctc:"",
   expect:""});
 } 
 return (
    <>
    <div className='container'>
      
      <div className='top'>
         <div className='top_left'>
         <img src="BrainyDx.png" alt=''></img>
         <h2>Brainy<span>DX</span> </h2>
         </div>
         <div className='top_right'>
         <button>Mail Us</button>
         </div>
      </div>
      
      <div className='header'>
         <button className='btn'>GO BACK</button>
         <h1>Complete your Application</h1>
      </div> 


        
      <div className='form_container'>
       
        <div className='formInput'>
        
          <form className='inputs' action="" onSubmit={handleSubmit}>
            <div className='form-input'>
            <div className='Fields first'>
            <div class="inputField">
            <label>Name </label>
            <input type="text" placeholder="Your full name" 
            value={userRegister.username} onChange={handleInput} name="username" id='username'/>
            </div>
            
            <div class="inputField">
            <label>Email  </label>
            <input type="email" placeholder="abc@xyz.com" 
            value={userRegister.email} onChange={handleInput} name="email" id='email'/>
            </div>

            <div class="inputField">
            <label>Phone</label>
            <input type="number" placeholder="10 digit number" 
            value={userRegister.number} onChange={handleInput} name="number" id='number'/>
            </div>

            </div>
              
            <div className='Fields'>
            <div class="inputField">
            <label> Current Location </label>
            <input type="text" placeholder="eg. Delhi" 
            value={userRegister.location} onChange={handleInput} name="location" id='location' />
            </div>
            
            <div class="inputField">
            <label> Years of experience </label>
            <input type="text" placeholder="eg. 2+" 
            value={userRegister.exp} onChange={handleInput} name="exp" id='exp'/>
            </div>

            <div class="inputField">
            <label> Notice Period</label>
            <input type="text" placeholder="eg. 15 days"  
            value={userRegister.period} onChange={handleInput}  name="period" id='period'/>
            </div>

            </div>
              
            
            <div className='Fields'>
            <div class="inputField">
            <label>  Current CTC </label>
            <input type="text" placeholder="per year" 
             value={userRegister.ctc} onChange={handleInput} name="ctc" id='ctc'/>
            </div>
            
            <div class="inputField">
            <label>  Expected CTC</label>
            <input type="text" placeholder="eg. 2+" 
            value={userRegister.expect} onChange={handleInput}  name="expect" id='expect'/>
            </div>

            <div class="inputField last">
            <label>  Expected CTC</label>
            <input type="text" placeholder="eg. 2+"/>
            </div>
            </div>
            </div>

            <div className='form_footer'>
            <h5>Upload Your Resume</h5>
            
            <span><DragandDrop/></span>
            
            {/* <input type="submit"></input> */}
            <button type='submit'>APPLY NOW</button>
        </div>
        
            
          </form>
                  
          </div> 
       
           
    </div>

    
    
    </div>
    <div className='output'>
      {record.map((curElem)=>{
        return(
          <div className='showData'>
            <p>{curElem.username}</p>
            <p>{curElem.email}</p>
            <p>{curElem.number}</p>
            <p>{curElem.location}</p>
            <p>{curElem.period}</p>
            <p>{curElem.ctc}</p>
            <p>{curElem.exp}</p>
           

            </div>
        )
      })}
    </div>
    </>

  )
}

export default Contact