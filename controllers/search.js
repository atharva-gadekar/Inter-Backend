import { User } from "../models/User.js";
import {Blog} from "../models/Blog.js";

export const Searchbyuser = async (req,res) =>{
    const queryuser=new RegExp(req.params?.name,'i');
    if(queryuser!==''){
        try{
            const search_res=await User.find({
                name:queryuser
            });
            res.status(200).json(search_res);
        }
        catch(error){
            console.log(error);
            res.status(404).json({message:'No matched User Found'});
        }
        
    }
    else{
        res.status(404).json({message:"No queryuser"});
    }
}


export const SearchbyTag = async (req,res) =>{
    const querytag=new RegExp(req.params?.tags,'i');
    if(querytag!==''){
        try{
            const search_res=await Blog.find({
                tags:querytag
            });
            res.status(200).json(search_res);
        }
        catch(error){
            console.log(error);
            res.status(404).json({message:'No matched Blog Found'});
        }
        
    }
    else{
        res.status(404).json({message:"No querytags"});
    }
}

export const SearchbyTitle = async (req,res) =>{
    const querytitle=new RegExp(req.params?.title,'i');
    if(querytitle!==''){
        try{
            const search_res=await Blog.find({
                title:querytitle
            });
            res.status(200).json(search_res);
        }
        catch(error){
            console.log(error);
            res.status(404).json({message:'No matched Blog Found'});
        }
        
    }
    else{
        res.status(404).json({message:"No querytitle"}) ;
    }
}

