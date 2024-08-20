import bcrypt from 'bcrypt';
import {NextApiRequest, NextApiResponse} from 'next';
import prismadb  from "@/lib/prismadb";

export async function GET(req:Request){
    return new Response(null, {status:405});
}

export async function POST(req:Request){
    try{
        const { name, email, password } = await req.json();
        console.log('******************** check')
            console.log({name, email, password});
        console.log('******************** check')


        const existingUser  = await prismadb.user.findUnique({
            where:{
                email:email
            }
        });


        if(existingUser){
            // return res.status(422).json({error:'Email Taken'})
            return new Response(JSON.stringify({error:'Email Taken'}),{status:422})
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prismadb.user.create({
            data:{
                email,
                name,
                hashedPassword,
                image:'',
                emailVerified: new Date(),
            }
        });

        // return res.status(201).json(user);
        return new Response(JSON.stringify({user:user}), {status:201})

    }catch (error){
        // console.log(error)
        console.log('*********************')
        return new Response(null, {status:405});
    }
}