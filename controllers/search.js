import { User } from "../models/User.js";
import { Blog } from "../models/Blog.js";

// export const Searchbyuser = async (req,res) =>{
//     const queryuser=new RegExp(req.params?.name,'i');
//     if(queryuser!==''){
//         try{
//             const search_res=await User.find({
//                 name:queryuser
//             });
//             res.status(200).json(search_res);
//         }
//         catch(error){
//             console.log(error);
//             res.status(404).json({message:'No matched User Found'});
//         }

//     }
//     else{
//         res.status(404).json({message:"No queryuser"});
//     }
// }


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


// //search on the basis of interests

// export const searchbyinterests= async (req, res) => {
//     try {
//         console.log(req.params.interests.split(","));
//         let interests = req.params.interests.split(",");
//         if (!interests) {
//           return res.status(400).json({ error: 'Interests parameter is missing' });
//         }

//         // interests = interests.split(',');
//         const interestsCount = interests.length;
//         console.log(interestsCount);

//         // const users = await User.find({ interests: { $in: interests } });
//     let users;
//     console.log(interests);

//     if (interestsCount==1) {
//       users = await User.find({ interests: {$in: interests }});
//     } else {
//     //   interests = interests.split(",");
//       users = await User.find({ interests: { $in: interests } });
//     }
//         res.json(users);
//       } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//       }
//     }

export const searchAll = async (req, res) => {
    const { query } = req.params;

    if (!query) {
        res.status(404).json([]);
        return;
    }

    const decodedQuery = decodeURIComponent(query);

    const firstChar = decodedQuery.charAt(0);

    if (firstChar === "@") {
        const searchRegex = new RegExp(decodedQuery.slice(1), "i");
        try {
            const search_res = await User.find({ name: searchRegex });
            res.status(200).json(search_res);
            return;
        } catch (error) {
            console.log(error);
            res.status(404).json([]);
            return;
        }
    }

    if (firstChar === "#") {
        const searchRegex = new RegExp(decodedQuery.slice(1), "i");
        try {
            const search_res = await Blog.find({ tags: searchRegex });
            res.status(200).json(search_res);
            return;
        } catch (error) {
            console.log(error);
            res.status(404).json([]);
            return;
        }
    }

    const searchRegex = new RegExp(decodedQuery, "i");
    try {
        const search_res = await Blog.find({
            $or: [{ title: searchRegex }, { content: searchRegex }],
        });
        res.status(200).json(search_res);
        return;
    } catch (error) {
        console.log(error);
        res.status(404).json([]);
        return;
    }
};





