import React from 'react'
import './DragandDrop.css'
import { BiCloudUpload } from "react-icons/bi";




function DragandDrop() {


    // const DragandDrop =() => {
    //     const dragOver =(e) =>{
    //         e.preventDefault();
    
    //     }
    //     const dragEnter =(e)=>{
    //     e.preventDefault();
    //     }
    
    //     const dragLeave =(e)=>{
    //     e.preventDefault();
    //     }

    //     const fileDrop =(e)=>{
    //     e.preventDefault();
    //     const files =e.dataTransfer.files;
    //     console.log(files);
    //     }
    
    // }
  return (
    <div className='drag_box'>
         {/* <div className='drop-container' 
         onDragOver= {dragOver}
         onDragEnter = {dragEnter}
         onDragLeave = {dragLeave}
         onDrop= {fileDrop}> */}
         
        <span><BiCloudUpload/></span>
        
        <h5>Click to upload or drag and drop the file</h5>
        {/* <input type="file" /> */}
        </div>
    // </div>
  )
}

export default DragandDrop