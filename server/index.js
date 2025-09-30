import express from "express"
import cors from "cors"
import multer from "multer"
import { Queue } from "bullmq"
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';

const queue = new Queue("file-upload-queue",{connection:{
    host: 'localhost',
    port: 6379
}})




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})

const upload = multer({storage:storage})

const app = express()
app.use(cors())

app.get('/',(req,res)=>{
    res.send("all fine")
})

app.post('/upload/pdf', upload.single('pdf'),async(req,res)=>{
  await queue.add('file-ready',JSON.stringify({
    filename:req.file.originalname,
    destination:req.file.destination,
    path:req.file.path,
  }))
    return res.json({message:'uploaded'})
})

app.get('/chat',async(req,res)=>{
  const userQuery = "best player in cricket"
   const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey:"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"
      });
  
   const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: `http://localhost:6333`,
        collectionName: "langchainjs-testing",
      });
      const ret = vectorStore.asRetriever({
        k:2,
      })
      const result = await ret.invoke(userQuery)
      return res.json({result})
})

app.listen(8000,()=>{
    console.log(`server started at port:${8000}`)
})