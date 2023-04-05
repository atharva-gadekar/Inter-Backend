//Requests to serve
// router.get("/blog", getAllBlogs);
// router.get("/blog/:id", getBlog);
// router.post("/blog", createBlog);
// router.post("/blog/:id/comment", addComment);
// router.patch("/blog/:id/like", addLike);

import { Blog } from "../models/Blog.js";
import {Comment} from "../models/Comment.js";

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({ blogs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json({ blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createBlog = async (req, res) => {
    try {
        const { title, content, bannerImage, owner, tags , date } = req.body;
        const blog = new Blog({
            title,
            content,
            bannerImage,
            owner,
            tags,
            date,
            likes : {},
            comments : []
        })
        await blog.save();
        res.status(201).json({ blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const addComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const {content, author} = req.body;
        const comment = new Comment({
            content,
            author,
            blogID : blog._id,
        });
        comment.save();

        // const comment = await Comment.create(req.body);
        blog.comments.push(comment);
        blog.save();
        comment.save();
        res.status(201).json({ comment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const addLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        
        const { userID } = req.body;
        const isLiked = blog.likes.get(userID);
        
        if (isLiked) {
            blog.likes.delete(userID);
        } else {
            blog.likes.set(userID, true);
        }

        const updatedBlog = await Blog.findOneAndUpdate({_id : req.params.id}, {likes : blog.likes}, {new : true});
        updatedBlog.save();

        blog.save();
        res.status(200).json({ blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




// export const SearchbyTag = async (req,res) =>{
//     const querytag=new RegExp(req.params?.tags,'i');
//     if(querytag!==''){
//         try{
//             const search_res=await Blog.find({
//                 tags:querytag
//             });
//             res.status(200).json(search_res);
//         }
//         catch(error){
//             console.log(error);
//             res.status(404).json({message:'No matched Blog Found'});
//         }
        
//     }
//     else{
//         res.status(404).json({message:"No querytags"});
//     }
// }

// export const SearchbyTitle = async (req,res) =>{
//     const querytitle=new RegExp(req.params?.title,'i');
//     if(querytitle!==''){
//         try{
//             const search_res=await Blog.find({
//                 title:querytitle
//             });
//             res.status(200).json(search_res);
//         }
//         catch(error){
//             console.log(error);
//             res.status(404).json({message:'No matched Blog Found'});
//         }
        
//     }
//     else{
//         res.status(404).json({message:"No querytitle"}) ;
//     }
// }

