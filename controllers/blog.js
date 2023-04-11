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
        const { title, content, bannerImage, owner, tags ,brief, formattedDate } = req.body;
        const blog = new Blog({
            title,
            content,
            bannerImage,
            owner,
            tags,
            formattedDate,
            brief,
            likes : {},
            comments : []
        })
        await blog.save();
        const date = blog.formattedDate;
        res.status(201).json({ blog, date});
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

export const updateblog= async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
          return res.status(404).json({ message: "Blog post not found" });
        }
    
        if (req.body.title) {
          blog.title = req.body.title;
        }
    
        if (req.body.content) {
          blog.content = req.body.content;
        }
    
        if (req.body.brief) {
          blog.brief = req.body.brief;
        }
    
        if (req.body.tags) {
          blog.tags = req.body.tags;
        }
        // if(req.body.date){
        //     blog.date = req.body.date;
        // }
        
    
        const updatedBlog = await blog.save();
        res.json(updatedBlog);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  }

//delete blog
export const deleteBlog=async (req, res) => {
    const { id } = req.params;
    try {
      const deletedBlog = await Blog.findByIdAndDelete(id);
      if (!deletedBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  

//   export const getAllComments = async (req, res) => {
//     try {
//         const blog = await Blog.findById(req.params.id).populate("comments");
//         if (!blog) {
//             return res.status(404).json({ error: "Blog not found" });
//         }
//         const comments = blog.comments;
//         res.status(200).json({ comments });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }


//   //delete comment

// export const deleteComment = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.blogId);
//     if (!blog) {
//       return res.status(404).json({ error: 'Blog not found' });
//     }

//     const comment = await Comment.findById(req.params.commentId);
//     if (!comment) {
//       return res.status(404).json({ error: 'Comment not found' });
//     }

//     // Remove the comment from the blog's comments array
//     blog.comments = blog.comments.filter((commentId) => commentId.toString() !== comment._id.toString());
//     await blog.save();

//     // Delete the comment from the database
//     await Comment.findByIdAndDelete(req.params.commentId);

//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };







