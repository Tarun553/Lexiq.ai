import sql from "../config/db.js";



export const getUserCreation = async (req,res)=>{
    try {
        const {userId} = req.auth();
        const creation = await sql`
            SELECT * FROM creation WHERE user_id = ${userId} ORDER BY created_at DESC
        `
        return res.status(200).json({
            success: true,
            data: creation
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const getPublishedCreation = async (req,res)=>{
    try {
     
        const creations = await sql`
            SELECT * FROM creation WHERE publish = TRUE ORDER BY created_at DESC
        `
        return res.status(200).json({
            success: true,
            data: creations
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// export const toggleLikeCreation = async (req, res)=>{
//     try {
//         const {userId} = req.auth();
//         const {creationId} = req.body;
//         const creation = await sql`
//             SELECT * FROM creation WHERE id = ${creationId}
//         `
//         if(!creation[0]){
//             return res.status(404).json({
//                 success: false,
//                 message: "Creation not found"
//             })
//         }

//         const currentLike = await sql`
//             SELECT * FROM likes WHERE user_id = ${userId} AND creation_id = ${creationId}
//         `
//         if(currentLike[0]){
//             await sql`
//                 DELETE FROM likes WHERE user_id = ${userId} AND creation_id = ${creationId}
//             `
//             return res.status(200).json({
//                 success: true,
//                 message: "Like removed"
//             })
//         }
//         await sql`
//             INSERT INTO likes (user_id, creation_id) VALUES (${userId}, ${creationId})
//         `
//         return res.status(200).json({
//             success: true,
//             message: "Like added"
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }