//Requests to serve
// router.get("/blog", getAllBlogs);
// router.get("/blog/:id", getBlog);
// router.post("/blog", createBlog);
// router.post("/blog/:id/comment", addComment);
// router.patch("/blog/:id/like", addLike);
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import crypto from "crypto";
import path from "path";
import { Blog } from "../models/Blog.js";
import { Comment } from "../models/Comment.js";
import dotenv from "dotenv";

dotenv.config();
const bukcetName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    region
});


export const getAllBlogs = async (req, res) => {
    try {
        const temp = await Blog.find().populate("owner");
        temp.map(async blog=>{
            const getObjectParams = {
							Bucket: bukcetName,
							Key: blog.bannerImage,
						};
            const command = new GetObjectCommand(getObjectParams);
            const bannerUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            blog.bannerUrl = bannerUrl;
            await blog.save();
        })
        const blogs = await Blog.find().populate("owner");
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
        const getObjectParams = {
            Bucket: bukcetName,
            Key: blog.bannerImage,
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        res.status(200).json({ blog, url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createBlog = async (req, res) => {
    try {
        const { title, content, owner, tags, date } = req.body;
        const randomImgName = (bytes = 16) => crypto.randomBytes(bytes).toString("hex");
        const imgName = randomImgName();
        const params = {
            Bucket: bukcetName,
            Key: imgName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        const command = new PutObjectCommand(params);
        const result = await s3.send(command);
        const blog = new Blog({
            title,
            content,
            bannerImage: imgName,
            owner,
            tags,
            date,
            likes: {},
            comments: []
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

        const { content, author } = req.body;
        const comment = new Comment({
            content,
            author,
            blogID: blog._id,
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

        const updatedBlog = await Blog.findOneAndUpdate({ _id: req.params.id }, { likes: blog.likes }, { new: true });
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

