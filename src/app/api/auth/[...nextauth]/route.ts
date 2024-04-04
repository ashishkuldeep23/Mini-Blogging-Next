
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google";

// import GitHubProvider from "next-auth/providers/github";

import CredentialsProvider from "next-auth/providers/credentials"


const clientIdText = process.env.GOOGLE_ID!
const clientSecretText = process.env.GOOGLE_SECRATE!


// console.log(
//     {
//         clientIdText,
//         clientSecretText
//     }
// )

// const gitClientId = "2bc666d4920090979952"
// const gitClientSecrate = "80493608c01f8b211b0c3decf307dd9a8a4e4d1d"



const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: clientIdText,
            clientSecret: clientSecretText
        }),

        CredentialsProvider({


            // The name to display on the sign in form (e.g. 'Sign in with...')
            id: 'credentials',
            name: 'Password',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "email", type: "text", placeholder: "jhoncena@gmail.com" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, req) {

                // console.log({ req })
                // console.log({ credentials })

                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const res = await fetch(`${process.env.DOMAIN}/api/users/loginAuth`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })


                // console.log({ res })

                const user = await res.json()

                console.log({ user })

                // If no error and we have user data, return it
                if (user && user.profile) {
                    return user.profile
                }
                // Return null if user data could not be retrieved
                return null
            }
        })



    ],



    callbacks: {

        async session({ session }: any) {

            // console.log({ token })

            const sessionUserData = await User.findOne({ email: session.user.email })

            // console.log(sessionUserData)

            session.user.id = sessionUserData._id.toString();
            // session.expires = Date.now() + ( 3600 * 1000 * 24)

            session.maxAge = 30 * 24 * 60 * 60 * 1000  // // // For 30 days.

            return session;
        },

        async signIn({ profile, user }: any) {

            try {

                await connect()

                // if (!profile) return false

                // console.log({ profile, user })

                let email, name, picture

                if (profile) {
                    email = profile.email
                    name = profile.name
                    picture = profile.picture
                }

                if (user) {
                    email = user.email
                    name = user.name
                }


                const getUser = await User.findOne({ email })

                // console.log(getUser)

                if (!getUser) {

                    let newUserData = {
                        username: name,
                        email: email,
                        password: "LOG_IN_BY_GOOGLE",
                        profilePic: picture,
                        isVerified : true
                    }


                    let createUser = new User(newUserData)

                    createUser = await createUser.save()

                }


                return true

            } catch (err: any) {

                console.log(err)
                return false

            }
        }

    }


})




export { handler as GET, handler as POST }


