'use client'
import { Upload } from "lucide-react"
import * as React from "react"

const FileUploadComponent:React.FC=()=>{
    const handleFileUploadButtonClick =()=>{
        const el = document.createElement('input')
        el.setAttribute('type','file')
        el.setAttribute('accept','application/pdf')
        el.addEventListener('change',async(ev)=>{
            if(el.files && el.files.length >0){
                const file = el.files.item(0)
                if(file){
                    const formData = new FormData()
                    formData.append('pdf',file)
                   await fetch('http://localhost:8000/upload/pdf',{
                        method:'POST',
                        body:formData

                    })
                    console.log("file uploaded")
                }
            }
        })
        el.click()

    }
    return(
        <div className="bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-white">
            <div onClick={handleFileUploadButtonClick} className="flex justify-center items-center flex-col">
                <h3>Upload a pdf file</h3>
             <Upload/>
            </div>
        </div>
    )

}

export default FileUploadComponent