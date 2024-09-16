
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import NextAuth, { NextAuthOptions } from "next-auth";

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


const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: clientIdText,
            clientSecret: clientSecretText
        }),

        CredentialsProvider({


            // The name to display on the sign in form (e.g. 'Sign in with...')
            // id: 'credentials',
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "email", type: "text", placeholder: "jhoncena@gmail.com" },
                password: { label: "password", type: "password", placeholder: "yourPass@5192" }
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

                // console.log({ user })

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

        // // // This fn for logIn creating session.
        async session({ session }: any) {

            try {

                await connect()

                // // // Jsut want to ready user model befour populating (in below code ) (I wnat just my model should be model ready here) ---------->
                await User.findById("65ffbc7cf6215d659db3b197")

                const sessionUserData = await User.findOne({ email: session.user.email })

                // console.log(sessionUserData)

                // // // Store user image url in session ------>
                session.user.image = sessionUserData.profilePic.toString();

                session.user.id = sessionUserData._id.toString();

                session.user._id = sessionUserData._id.toString();
                // session.expires = Date.now() + ( 3600 * 1000 * 24)

                session.maxAge = 30 * 24 * 60 * 60 * 1000  // // // For 30 days.

                return session;
            } catch (err: any) {

                console.log(err)
                return false

            }
        },

        // // // This fn when user sing in first time by google.
        async signIn({ profile, user }: any) {

            try {

                await connect()

                // if (!profile) return false

                // console.log({ profile, user })

                let email, name, picture;

                if (profile) {
                    // // // For google users ------>
                    email = profile.email
                    name = profile.name
                    picture = profile.picture
                }

                if (user) {
                    // // // For Credentials user ------->
                    email = user.email
                    name = user.name
                }


                const getUser = await User.findOne({ email })

                // console.log(getUser)


                // // // For new users here ------>
                if (!getUser) {

                    let newUserData = {
                        username: name,
                        email: email,
                        password: "LOG_IN_BY_GOOGLE",
                        profilePic: picture,
                        allProfilePic: [picture],
                        isVerified: true
                    }

                    let createUser = new User(newUserData)
                    createUser = await createUser.save()
                }


                return true

            } catch (err: any) {

                console.log(err)
                return false

            }
        },

    },

    theme: {
        // colorScheme: "dark",
        logo: "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png"
    },

    debug: true,
    // pages: {
    //     signIn: "/sign-in"
    // },

    secret: process.env.NEXTAUTH_SECRET!,

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// export default NextAuth(authOptions)

