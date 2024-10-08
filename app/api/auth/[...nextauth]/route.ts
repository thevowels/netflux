import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prismadb from "@/lib/prismadb";
import {compare} from "bcrypt";

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import {PrismaAdapter} from "@next-auth/prisma-adapter"

const handler = NextAuth({
    providers:[
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || ''
        }),
        GithubProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        Credentials({
            id:'credentials',
            name:'Credentials',
            credentials:[{
                email:{
                    label: 'email',
                    type: 'email',
                },
                password:{
                    label:'Password',
                    type:'password',
                }
            }],
            async authorize(credentials){
                console.log('authroize function called')
                console.log(credentials)
                if(!credentials.email || !credentials.password){
                    console.log('Missing email')
                    throw new Error("Email and password required");
                }
                const user = await prismadb.user.findUnique({
                    where:{
                        email: credentials.email
                    }
                });
                if(!user || !user.hashedPassword){
                    throw new Error('Email does not exist');
                }
                const isCorrectPassword = await compare (
                    credentials.password,
                    user.hashedPassword
                )

                if(!isCorrectPassword){
                    throw new Error(" Incorrect password");
                }

                return user;
            }
        })
    ],
    pages:{
        signIn: '/auth',
    },
    debug: process.env.NODE_ENV === 'development',
    adapter: PrismaAdapter(prismadb),
    session:{
        strategy:'jwt',
    },
    jwt:{
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
})


export { handler as GET, handler as POST };
