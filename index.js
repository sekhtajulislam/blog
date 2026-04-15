import express from "express"
import fs from "fs"

const app = express();
const port = 3000;

app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))


app.get("/",(req,res)=>{
    res.render("index.ejs")
})
app.get("/create-post",(req,res)=>{
    res.render("create-post.ejs")
})
app.get("/viewing",(req,res)=>{
    res.render("View-post.ejs")
})
app.post("/submit",(req,res)=>{
    let blog={
        id:Date.now(),
        title: req.body.title,
        content:req.body.content,
        author:req.body.author_name,
        createdAt: Date.now(),
    }
   
   
    fs.readFile("./public/blog.json","utf-8",(err,filedata)=>{
        let blogArray=[]
        
        if(!err && filedata){
            try{
                 blogArray = JSON.parse(filedata);
                }catch(e){
                blogArray=[];
            }
        }
        
          
        blogArray.push(blog)
        
        blogArray.sort((a, b) => b.createdAt - a.createdAt);
        fs.writeFileSync("./public/blog.json",JSON.stringify(blogArray,null,2),(err)=>{
            if(err) 
                console.log("Error in saving blog")
            else
                console.log("Blog saved")
        })
    })
   
    res.render("View-post.ejs")
})

app.get("/post/:id",(req,res)=>{
    const id=Number(req.params.id);
    fs.readFile("./public/blog.json","utf-8",(err,data)=>{
        let blogs=JSON.parse(data || "[]");
        const blog=blogs.find(b=>b.id=== id)
        res.render("single-post.ejs",{ blog })
    })
})

app.post("/delete/:id",(req,res)=>{
    const id=Number(req.params.id);
    fs.readFile("./public/blog.json","utf-8",(err,data)=>{
        let blogs=JSON.parse(data || "[]")
        const updatedBlogs=blogs.filter(b=>b.id !== id);
        fs.writeFileSync("./public/blog.json", JSON.stringify(updatedBlogs,null,2))
        res.render("View-post.ejs")
    })
})

app.get("/edit/:id", (req, res) => {
    const id = Number(req.params.id);

    fs.readFile("./public/blog.json", "utf-8", (err, data) => {
        let blogs = JSON.parse(data || "[]");

        const blog = blogs.find(b => b.id === id);

        res.render("edit-post.ejs", { blog });
    });
});

app.post("/edit/:id", (req, res) => {
    const id = Number(req.params.id);

    fs.readFile("./public/blog.json", "utf-8", (err, data) => {
        let blogs = JSON.parse(data || "[]");

        blogs = blogs.map(b => {
            if (b.id === id) {
                return {
                    ...b,
                    title: req.body.title,
                    content: req.body.content,
                    author: req.body.author_name
                };
            }
            return b;
        });

        fs.writeFileSync("./public/blog.json", JSON.stringify(blogs, null, 2));

        res.redirect("/post/" + id);
    });
});

app.listen(port,()=>{
    console.log(`Server running at port ${port} at http://localhost:${port}`)
})